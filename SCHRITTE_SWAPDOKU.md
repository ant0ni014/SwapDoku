# SwapDoku: Chronologische Projektschritte & Meilensteine

In dieser Datei wird jeder einzelne Entwicklungsschritt von SwapDoku mit exaktem Datum, Uhrzeit, Commit-Hash und inhaltlicher Beschreibung festgehalten. So hast du für deine Seminararbeit (insbesondere **Kapitel 3: Projektmethodik & Vorgehensweise** und **Kapitel 5: Soll-Ist-Vergleich**) ein lückenloses Protokoll deines Arbeitsverlaufs.

---

## 📅 Chronologischer Arbeitsverlauf

### 09. Oktober 2026: Projektstart & Erster lauffähiger Prototyp (MVP)
* **2026-10-09 15:11** (`445b18e`) – **Initial Commit**
  - Initialisierung des Repositories und Grundstruktur der Dateien (`index.html`, `style.css`, `app.js`).
* **2026-10-09 15:26** (`1d07487`) – **Prototyp mit Core-Engine, Supabase & Board-Swap**
  - Entwicklung der `SudokuEngine` mit rekursivem Backtracking-Algorithmus zur Spielfelderstellung und Lösungsprüfung.
  - Integration von Supabase Realtime Channels (`room:CODE`) für Raum-Verwaltung und ersten Peer-to-Peer-Board-Austausch.
  - Basis-Theming und Rendering des 9×9-Gitters.
* **2026-10-09 15:33** (`ec74226`) – **Code- & UI-Bereinigung**
  - Behebung von Zell-Rendering-Fehlern, Reduktion überflüssiger Schnittstellen und Bereinigung von Entwicklungs-Artefakten.

---

### 12. Oktober 2026: Bot-Engine, Gamification & Viewport-Optimierung
* **2026-10-12 22:24** (`2fd1fc8`) – **Bot-Gegner & Dark/Light-Toggle**
  - Entwicklung der autonomen Bot-Engine (`botStep()`) für den Offline-Betrieb im Versus- und Co-Op-Swap-Modus.
  - Implementierung des Schnell-Umschalters für Hell-/Dunkelmodus.
* **2026-10-12 22:34** (`510b673`) – **Bot-Schwierigkeitsstufen & Fortschrittskalibrierung**
  - Kalibrierung der Fortschrittsberechnung (`getProgress()`) in Prozent.
  - Einführung von 3 wählbaren Bot-Geschwindigkeitsstufen (Einfach, Mittel, Schwer).
  - Visuelle Verbesserungen bei der Zellenselektion.
* **2026-10-12 22:43** (`e5097e6`) – **Lebens-System, Schwierigkeitsgrade & Ziffern-Dimmung**
  - Einführung des Fehlersystems mit Leben und automatischer Game-Over-Erkennung.
  - Unterteilung in drei Rätsel-Schwierigkeitsgrade (Leicht, Mittel, Schwer) mit unterschiedlicher Startzahlen-Anzahl (*Clues*).
  - Ausgrauen/Dimmen von Zifferntasten auf dem Numpad, sobald eine Zahl 9-mal korrekt im Gitter platziert wurde.
  - Lokales Leaderboard mit Spielernamen.
* **2026-10-12 23:25** (`3d15f86`) – **Laptop-Viewport-Fitting & Design-Entrümpelung**
  - Anpassung der Layout-Dimensionen auf `100vh`, um vertikales Scrollen auf Notebooks zu verhindern.
  - Ersetzen von Herzen durch dezente Symbole (Sterne/Sparkles).
  - Bereinigung greller Farben in der Bestenliste für ein ruhigeres Gesamtbild.
* **2026-10-12 23:28** (`926cc1b`) – **Mobile-Zoom-Sperre & Board-Vergrößerung**
  - Maximierung der Spielfeldgröße für bessere Lesbarkeit auf Desktop und Tablet.
  - Unterbindung von ungewollten Touch- und Doppeltipp-Zoom-Effekten auf mobilen Browsern (`touch-action: manipulation`).

---

### 13. Oktober 2026: Das große Architektur-, Audio- & Co-Op-Update
* **2026-10-13 18:12** (`1268231`) – **Stoppuhr, Audio, Modals & Rechtliches**
  - Umbenennung des Zen-Modus in *Einzelspieler*.
  - Implementierung der Stoppuhr mit Pause-Funktion.
  - Erste Integration der prozeduralen Web Audio API für entspannende Hintergrundklänge.
  - Einbindung von Modal-Fenstern für Spielregeln, Profil, Impressum und Datenschutzerklärung.
  - Behebung von Kontrastproblemen der Gitterränder im Dark Mode.
* **2026-10-13 18:25** (`06a4420`) – **2-Spalten-Desktop-Layout & Authentifizierung**
  - Einführung des 2-Spalten-Layouts: Spielfeld links, Steuerung und 3×3-Numpad rechts.
  - Pause-Overlay bei Spielunterbrechung.
  - Benutzerverwaltung mit Registrierung, Login und Session-Handling.
* **2026-10-13 18:38** (`e99421d`) – **Typografie, SVGs & Feste Board-Dimensionen**
  - Umstellung auf geometrische Schriftarten und vollständige SVG-Vektor-Icons.
  - Fixierung der Spielfeld-Dimensionen gegen Layout-Verschiebungen während des Spiels.
* **2026-10-13 19:17** (`0b5f534`) – **Skandinavischer Minimalismus-Stil**
  - Gestalterischer Feinschliff: Klare Kontraste, reduzierte Farbpalette und ablenkungsfreie Bedienelemente.
* **2026-10-13 22:24** (`9e66ee9`) – **Numpad-Ergonomie**
  - Abrundung der Zifferntasten (`border-radius: 8px`) und ergonomische Anordnung, um das starre „Taschenrechner-Gefühl“ zu eliminieren.
* **2026-10-13 22:32** (`a15c785`) – **Vertikales Stacking & Bündige Header-Ausrichtung**
  - Vertikale Anordnung der Spieloptionen in der Sidebar.
  - Exakte bündige Ausrichtung der Header-Elemente mit den Außenkanten des Sudoku-Boards.
* **2026-10-13 22:39** (`0751e12`) – **Layout-Verbreiterung & SVG-Account-Icon**
  - Verbreiterung des Gesamt-Containers auf 920px für mehr Raumgefühl.
  - Sauberes monochromes SVG-Profil-Icon im Header und Fußzeile mit Impressum/Datenschutz-Links.
* **2026-10-13 23:26** (`e45d304`) – **Der Meilenstein-Commit (Kern-Features)**
  - **i18n:** Zweisprachigkeit Deutsch/Englisch zur Laufzeit.
  - **Lofi-Synthesizer:** Prozedurale Klangerzeugung direkt im Browser (0 MB Download).
  - **Clue-Balancing:** Histogramm-Verfahren in der Sudoku-Engine zur Vermeidung leerer 3×3-Blöcke.
  - **Ready-State:** Timer verharrt auf `00:00` bis zur ersten Nutzerinteraktion.
  - **Co-Op Farbsystem:** Klare visuelle Trennung mit Board A (Blau) und Board B (Rot) bei Live-Swaps.
  - **Theme-Shop & Zeit-Rangliste:** Lokale Bestzeiten sortiert nach Zeit und Schwierigkeitsgrad.
* **2026-10-13 23:31** (`f61815b`) – **Emoji-Eliminierung**
  - Ersetzen der letzten bunten Emojis im Themes-Button und Timer durch monochrome Inline-SVGs.
* **2026-10-13 23:46** (`f3138af`) – **Fadenkreuz-Reparatur (Crosshair)**
  - Behebung eines Selektor-Bugs: Zeilen- und Spalten-Hervorhebung der ausgewählten Zelle wieder voll funktionsfähig.
* **2026-10-13 23:49** (`fba709f`) – **Gitterrand-Reparatur (Box-Shadow-Fix)**
  - Entfernung störender Inset-Outlines, sodass alle 3×3-Blocklinien gleichmäßig und symmetrisch bleiben.

---

### 14.–15. Oktober 2026: Theming-Erweiterung & UI-Zentrierung
* **2026-10-14 07:21** (`098a604`) – **Erste akademische Dokumentation**
  - Erstellung der Basis-Referenzdokumentation für die wissenschaftliche Seminararbeit (4.000 Wörter).
* **2026-10-15 09:25** (`e421402`) – **6 Farb-Themes & Vorschaubereiche**
  - Erweiterung der Theme-Engine um 6 kontrastreiche Farbwelten inklusive interaktiver Farbfelder im Auswahl-Modal.
* **2026-10-15 11:28** (`c2b54ac`) – **Horizontale Numpad-Zentrierung**
  - Exakte Ausrichtung des Numpads in der rechten Spalte für harmonische Abstände.
* **2026-10-15 11:32** (`f02be17`) – **Vertikale Sidebar-Zentrierung**
  - Vertikales Ausrichten aller Bedienelemente der Sidebar auf die genaue Höhe des linken Sudoku-Gitters.

---

### 16.–26. Oktober 2026: Konzeption, Projektskizzen & Kursforum
* **2026-10-16 12:48** (`cea21b1`) – **Erste Projektskizze für Moodle-Forum**
  - Verfassen der formellen Projektskizze zur Einreichung beim Erstgutachter Dr. Schappert.
* **2026-10-18 20:22** (`110fb4b`) – **Kompakte Forums-Fassung**
  - Erstellung einer prägnanten Kurzfassung für den Foren-Austausch.
* **2026-10-22 11:00** (`5e19d63`) – **Struktur-Harmonisierung (Balkan Snake Vergleich)**
  - Anpassung der Sprache an leicht verständliche Formulierungen und Übernahme bewährter Strukturen erfolgreicher Vorjahresarbeiten.
* **2026-10-23 bis 2026-10-28** – **Wissenschaftliche Vorbereitung & Peer-Feedback**
  - Feinabstimmung der SMART-Ziele (Gast-Modus mit anonymem Highscore, optionale Benutzerkonten).
  - Definition des 105-Stunden-Zeitrahmens und der Fallback-Strategie mit dem Bot.
  - Abgabe von qualifiziertem Peer-Feedback im Hochschulforum zu den Projekten der Kommilitonen.
* **2026-10-29** – **Aufsetzen des professionellen Forschungs- und Tracking-Systems**
  - Erstellung von `SCHRITTE_SWAPDOKU.md` (Chronologie mit Zeitstempeln), `HERAUSFORDERUNGEN_SWAPDOKU.md` (Problemlösungs-Log) und `LERNEN_SWAPDOKU.md` (Wissenschaftliche Reflexion).

---

### 30. Oktober 2026: Live-Supabase-Anbindung, Multiplayer-Feinschliff & Sieg-Flows
* **2026-10-30 12:09** (`33a5273`) – **Backend-Schema für Multi-Mode-Leaderboards & RLS-Erweiterung**
  - Erweiterung von `schema.sql` um modi-spezifische Tabellen (`leaderboard_zen`, `leaderboard_versus`, `leaderboard_swap`).
  - Stored Procedures und Validierung für echte Multiplayer-Statistiken und 3-Leben-Regelung.
* **2026-10-30 12:16** (`e513b13`) – **UI-Harmonisierung & Default-Konfiguration**
  - Default-Spielstart auf `Einfach` mit sofort sichtbaren Startzahlen.
  - Toolbar auf 3 zentrale Buttons bereinigt und Neustart-Icon direkt neben dem Hilfe-Button verankert.
* **2026-10-30 12:42** (`e127c70`) – **Bugfix: Fehlende Hilfsfunktion deklariert**
  - Deklaration der fehlenden Funktion `updateBotPartnerDifficultyLabels()`.
  - Konsolidierung des Refresh-Icons für den Neustart.
* **2026-10-30 12:45** (`f486db6`) – **Kritische Spielmechanik-Korrektur: Fehlervalidierung**
  - Fehlerabzug korrigiert: Leben wird nun bei *jeder* Falscheingabe abgezogen, auch beim Überschreiben bereits belegter (nicht-initialer) Zellen.
* **2026-10-30 12:47** (`305791c`) – **UI-Bereinigung im Ergebnis-Modal**
  - Entfernung des fehlerhaften Peek-Buttons und des roten Kreuzes.
  - Integration eines sauberen „Lösung anzeigen“-Buttons (`show solution`).
* **2026-10-30 12:58** (`d9ff4c0`) – **Board-Inspektion & Top-Bar nach Spielende**
  - Ergänzung einer dezenten oberen Leiste nach Spielende: Spieler können das fertige Board in Ruhe inspizieren und das Ergebnis-Modal jederzeit wieder öffnen oder die Lösung einblenden.
* **2026-10-30 13:16** (`0ce8e1f`) – **Live-Supabase-Integration (Schärfung des Live-Backends)**
  - Einbindung der realen Supabase-Projekt-URL und des echten Anon-Keys.
  - Aktivierung von Live-WebSockets (`room:CODE`), echter Cloud-Authentifizierung und synchronem Datenbank-Abgleich.
* **2026-10-30 13:37** (`ddc3674`) – **Auto-Lock für vervollständigte Ziffern & Robuste Siegerkennung**
  - Automatisches Sperren/Deaktivieren von Zifferntasten auf dem Numpad, sobald eine Zahl 9-mal korrekt im Gitter gesetzt wurde.
  - Minimalistischer Pause-Button.
  - Absicherung der Sudoku-Abschlussprüfung (`isComplete()`).
* **2026-10-30 13:41** (`4547a0e`) – **Leaderboard-Bereinigung: Reale Spielerdaten**
  - Entfernung aller künstlichen Dummy-/Bot-Einträge aus der Rangliste.
  - Anzeige ausschließlich echter Spielerrekorde aus der Supabase-PostgreSQL-Datenbank.
* **2026-10-30 13:59** (`9479747`) – **Robuste Siegesanzeige (Try-Catch-Kapselung)**
  - Priorisierung von `showResultOverlay()`.
  - Kapselung von Backend- und Toast-Aufrufen in `try-catch`-Blöcken, damit das Sieges-Modal unter allen Umständen garantiert aufpoppt (selbst bei Latenz- oder Netzwerkfehlern).
* **2026-10-30 15:07** (`145d85b`) – **Multiplayer-Vollendung: Synchroner Start, Knockout & Forfeit**
  - **Synchronisierter Start:** Einblendung eines 3-2-1 Countdowns für beide Spieler bei Beitritt in einen Raum.
  - **3-Leben Knockout:** Verliert ein Spieler im Versus alle 3 Leben, gewinnt der Gegner sofort durch Knockout (`KNOCKOUT_WIN`).
  - **Forfeit-Erkennung:** Verlässt ein Spieler den Raum vorzeitig (`presence:leave`), wird dies als Aufgabe gewertet und der verbleibende Spieler siegt.
  - **Versus-Leaderboard:** Rangliste zählt nun echte Versus-Siege.
