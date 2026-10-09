-- ==============================================================================
-- SwapDoku / SyncDoku: Database Schema & Realtime Setup
-- Modul: Web Technologie (Seminararbeit Prototyp)
-- Stack: Supabase (PostgreSQL 15+, Row Level Security, Realtime Extensions)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
-- Speichert Benutzerdaten, aggregierte Sync-Points und das aktive CSS-Theme.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT DEFAULT 'Player_' || SUBSTRING(gen_random_uuid()::text, 1, 6),
    sync_points INTEGER NOT NULL DEFAULT 0 CHECK (sync_points >= 0),
    active_theme TEXT NOT NULL DEFAULT 'nordic-light',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

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

-- Profiles: Jeder authentifizierte/anonyme Nutzer darf sein eigenes Profil lesen
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated, anon
    USING (auth.uid() = id);

-- Profiles: Nutzer darf eigenes Profil updaten (z. B. aktives Theme wechseln)
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated, anon
    USING (auth.uid() = id)
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
    INSERT INTO public.profiles (id, sync_points, active_theme)
    VALUES (NEW.id, 0, 'nordic-light')
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
