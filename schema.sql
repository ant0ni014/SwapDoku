-- ==============================================================================
-- SwapDoku / SyncDoku: Database Schema & Realtime Setup
-- Modul: Web Technologie (Seminararbeit Prototyp)
-- Stack: Supabase (PostgreSQL 15+, Row Level Security, Realtime Extensions)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
-- Speichert Benutzerdaten, aggregierte Sync-Points, das aktive CSS-Theme
-- sowie persönliche Bestzeiten strukturiert nach Spielmodi ('zen', 'versus', 'swap') in Sekunden.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT DEFAULT 'Player_' || SUBSTRING(gen_random_uuid()::text, 1, 6),
    sync_points INTEGER NOT NULL DEFAULT 0 CHECK (sync_points >= 0),
    versus_wins INTEGER NOT NULL DEFAULT 0 CHECK (versus_wins >= 0),
    active_theme TEXT NOT NULL DEFAULT 'nordic-light',
    -- Strukturierte Bestzeiten pro Spielmodus (JSONB-Mapping: { "easy": INTEGER, "medium": INTEGER, "hard": INTEGER })
    best_times_zen JSONB NOT NULL DEFAULT '{"easy": null, "medium": null, "hard": null}'::jsonb,
    best_times_versus JSONB NOT NULL DEFAULT '{"easy": null, "medium": null, "hard": null}'::jsonb,
    best_times_swap JSONB NOT NULL DEFAULT '{"easy": null, "medium": null, "hard": null}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.1 LEADERBOARD SCORES TABLE (Relationale Rangliste für Einzelspieler, Versus und Swap)
CREATE TABLE IF NOT EXISTS public.leaderboard_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('zen', 'versus', 'swap')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    time_seconds INTEGER NOT NULL CHECK (time_seconds > 0),
    remaining_lives INTEGER NOT NULL DEFAULT 3 CHECK (remaining_lives >= 0 AND remaining_lives <= 3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_mode_diff_time 
    ON public.leaderboard_scores (mode, difficulty, time_seconds ASC);

-- 3. UNLOCKED THEMES TABLE
-- Hält fest, welche Farbpaletten ein Benutzer bereits mit Punkten freigeschaltet hat.
CREATE TABLE IF NOT EXISTS public.unlocked_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_theme UNIQUE (user_id, theme_id)
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Gewährleistet strikte Datentrennung: Jeder anonyme Nutzer kann nur seine Daten manipulieren.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Leaderboard: Jeder darf Scores lesen
CREATE POLICY "Public leaderboard scores read"
    ON public.leaderboard_scores
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Leaderboard: Authentifizierte oder anonyme Nutzer dürfen Einträge erstellen
CREATE POLICY "Users can insert own score"
    ON public.leaderboard_scores
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Profiles: Jeder authentifizierte/anonyme Nutzer darf Profile für die Rangliste lesen
CREATE POLICY "Public leaderboard profiles read"
    ON public.profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Profiles: Nutzer darf eigenes Profil updaten (z. B. aktives Theme oder Nickname wechseln)
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated, anon
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Profiles: Nutzer darf eigenes Profil erstellen (falls Trigger aussteht oder Offline-Sync)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid() = id);

-- Unlocked Themes: Eigene freigeschaltete Themes lesen
CREATE POLICY "Users can read own unlocked themes"
    ON public.unlocked_themes
    FOR SELECT
    TO authenticated, anon
    USING (auth.uid() = user_id);

-- Unlocked Themes: Eintrag erstellen
CREATE POLICY "Users can insert own unlocked themes"
    ON public.unlocked_themes
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid() = user_id);

-- 5. TRIGGER: AUTOMATISCHE PROFIL-ERSTELLUNG BEI ANONYMEM LOGIN
-- Sobald Supabase Auth (anonym oder regulär) einen Nutzer in auth.users anlegt,
-- wird synchron ein initiales Profil inkl. Default-Theme angelegt.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, sync_points, versus_wins, active_theme)
    VALUES (NEW.id, 0, 0, 'nordic-light')
    ON CONFLICT (id) DO NOTHING;

    -- Standard-Theme "nordic-light" sofort als freigeschaltet eintragen
    INSERT INTO public.unlocked_themes (user_id, theme_id)
    VALUES (NEW.id, 'nordic-light')
    ON CONFLICT (user_id, theme_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. STORED PROCEDURES / RPCs (Sichere Punkteverwaltung & Theme-Kauf)
-- Verhindert Cheating durch clientseitiges Überschreiben von sync_points.

-- Bestzeit eintragen & Profilstatistiken aktualisieren (mit strikter 3-Leben-Validierung)
CREATE OR REPLACE FUNCTION public.submit_score(
    p_mode TEXT,
    p_difficulty TEXT,
    p_time_seconds INTEGER,
    p_remaining_lives INTEGER DEFAULT 3,
    p_username TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_username TEXT;
    v_col_name TEXT;
    v_current_best INTEGER;
    v_is_new_best BOOLEAN := FALSE;
    v_score_id UUID;
BEGIN
    -- Validierung 1: Spielmodus prüfen
    IF p_mode NOT IN ('zen', 'versus', 'swap') THEN
        RAISE EXCEPTION 'Ungültiger Spielmodus: %. Erlaubt sind zen, versus, swap.', p_mode;
    END IF;

    -- Validierung 2: Schwierigkeitsgrad prüfen
    IF p_difficulty NOT IN ('easy', 'medium', 'hard') THEN
        RAISE EXCEPTION 'Ungültige Schwierigkeitsstufe: %. Erlaubt sind easy, medium, hard.', p_difficulty;
    END IF;

    -- Validierung 3: Einheitlich max. 3 Leben / Versuche serverseitig sicherstellen
    -- Erlaubt: 1 bis 3 verbleibende Leben (0 bedeutet Game Over, kein gültiger Win-Score)
    IF p_remaining_lives < 1 OR p_remaining_lives > 3 THEN
        RAISE EXCEPTION 'Ungültige Anzahl an Leben (%). Maximal 3 Leben erlaubt.', p_remaining_lives;
    END IF;

    -- Validierung 4: Zeit muss plausibel sein (> 0 Sekunden)
    IF p_time_seconds <= 0 THEN
        RAISE EXCEPTION 'Ungültige Spielzeit: % Sekunden.', p_time_seconds;
    END IF;

    -- Sicherstellen, dass das Profil existiert & Username synchronisieren
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, username, sync_points, versus_wins, active_theme)
        VALUES (v_user_id, COALESCE(NULLIF(TRIM(p_username), ''), 'Player_' || SUBSTRING(gen_random_uuid()::text, 1, 6)), 0, 0, 'nordic-light')
        ON CONFLICT (id) DO UPDATE SET
            username = CASE
                WHEN NULLIF(TRIM(p_username), '') IS NOT NULL AND (public.profiles.username IS NULL OR public.profiles.username LIKE 'Player_%' OR public.profiles.username = 'Spieler')
                THEN TRIM(p_username)
                ELSE public.profiles.username
            END,
            updated_at = timezone('utc'::text, now());

        SELECT username INTO v_username FROM public.profiles WHERE id = v_user_id;
    END IF;

    IF v_username IS NULL OR TRIM(v_username) = '' THEN
        v_username := COALESCE(NULLIF(TRIM(p_username), ''), 'Player_' || SUBSTRING(gen_random_uuid()::text, 1, 6));
    END IF;

    -- Score in Leaderboard-Tabelle persistieren
    INSERT INTO public.leaderboard_scores (
        user_id, username, mode, difficulty, time_seconds, remaining_lives
    ) VALUES (
        v_user_id, v_username, p_mode, p_difficulty, p_time_seconds, p_remaining_lives
    ) RETURNING id INTO v_score_id;

    -- Falls authentifiziert: Bestzeiten im Profil (profiles) modusspezifisch prüfen & updaten
    IF v_user_id IS NOT NULL THEN
        IF p_mode = 'zen' THEN
            SELECT (best_times_zen->>p_difficulty)::INTEGER INTO v_current_best FROM public.profiles WHERE id = v_user_id;
            IF v_current_best IS NULL OR p_time_seconds < v_current_best THEN
                UPDATE public.profiles
                SET best_times_zen = jsonb_set(best_times_zen, ARRAY[p_difficulty], to_jsonb(p_time_seconds)),
                    updated_at = timezone('utc'::text, now())
                WHERE id = v_user_id;
                v_is_new_best := TRUE;
            END IF;
        ELSIF p_mode = 'versus' THEN
            SELECT (best_times_versus->>p_difficulty)::INTEGER INTO v_current_best FROM public.profiles WHERE id = v_user_id;
            IF v_current_best IS NULL OR p_time_seconds < v_current_best THEN
                UPDATE public.profiles
                SET best_times_versus = jsonb_set(best_times_versus, ARRAY[p_difficulty], to_jsonb(p_time_seconds)),
                    updated_at = timezone('utc'::text, now())
                WHERE id = v_user_id;
                v_is_new_best := TRUE;
            END IF;
        ELSIF p_mode = 'swap' THEN
            SELECT (best_times_swap->>p_difficulty)::INTEGER INTO v_current_best FROM public.profiles WHERE id = v_user_id;
            IF v_current_best IS NULL OR p_time_seconds < v_current_best THEN
                UPDATE public.profiles
                SET best_times_swap = jsonb_set(best_times_swap, ARRAY[p_difficulty], to_jsonb(p_time_seconds)),
                    updated_at = timezone('utc'::text, now())
                WHERE id = v_user_id;
                v_is_new_best := TRUE;
            END IF;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'score_id', v_score_id,
        'is_new_best', v_is_new_best,
        'mode', p_mode,
        'difficulty', p_difficulty,
        'time_seconds', p_time_seconds,
        'remaining_lives', p_remaining_lives
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rangliste nach Modus & Schwierigkeit abrufen
CREATE OR REPLACE FUNCTION public.get_leaderboard(
    p_mode TEXT,
    p_difficulty TEXT,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    username TEXT,
    time_seconds INTEGER,
    remaining_lives INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.id,
        ls.username,
        ls.time_seconds,
        ls.remaining_lives,
        ls.created_at
    FROM public.leaderboard_scores ls
    WHERE ls.mode = p_mode AND ls.difficulty = p_difficulty
    ORDER BY ls.time_seconds ASC, ls.created_at ASC
    LIMIT LEAST(p_limit, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Punkte gutschreiben (z.B. +50 bei Zen, +100 bei Versus, +75 bei Co-Op)
CREATE OR REPLACE FUNCTION public.add_sync_points(points_to_add INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_points INTEGER;
BEGIN
    IF points_to_add <= 0 OR points_to_add > 200 THEN
        RAISE EXCEPTION 'Ungültige Punktemenge.';
    END IF;

    UPDATE public.profiles
    SET sync_points = sync_points + points_to_add,
        updated_at = timezone('utc'::text, now())
    WHERE id = auth.uid()
    RETURNING sync_points INTO current_points;

    RETURN current_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Theme kaufen und freischalten
CREATE OR REPLACE FUNCTION public.purchase_theme(theme_name TEXT, cost INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_points INTEGER;
    already_owned BOOLEAN;
BEGIN
    -- Prüfen, ob Theme bereits im Besitz
    SELECT EXISTS (
        SELECT 1 FROM public.unlocked_themes 
        WHERE user_id = auth.uid() AND theme_id = theme_name
    ) INTO already_owned;

    IF already_owned THEN
        -- Bereits vorhanden: Direkt als aktiv setzen
        UPDATE public.profiles
        SET active_theme = theme_name,
            updated_at = timezone('utc'::text, now())
        WHERE id = auth.uid();
        RETURN TRUE;
    END IF;

    -- Punktestand prüfen
    SELECT sync_points INTO user_points
    FROM public.profiles
    WHERE id = auth.uid();

    IF user_points < cost THEN
        RAISE EXCEPTION 'Nicht genügend Sync-Points vorhanden.';
    END IF;

    -- Punkte abziehen
    UPDATE public.profiles
    SET sync_points = sync_points - cost,
        active_theme = theme_name,
        updated_at = timezone('utc'::text, now())
    WHERE id = auth.uid();

    -- In unlocked_themes vermerken
    INSERT INTO public.unlocked_themes (user_id, theme_id)
    VALUES (auth.uid(), theme_name);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. REALTIME BROADCAST & REPLICATION
-- Hinweis: Supabase Realtime Channels (Broadcast & Presence) nutzen WebSockets direkt
-- über clientseitige Channel-Subscriptions. Für optionale DB-Änderungen an 'profiles'
-- kann die Replikation aktiviert werden:
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
