# Projektskizze: SwapDoku

**Titel:** SwapDoku — Kollaboratives Echtzeit-Web-Sudoku  
**Untertitel:** Performance-optimierte Single-Page-Application mit Co-Op Board-Swap, Versus-Modus und prozeduralem Web Audio  
**Modul:** Web Technologie / Verteilte Systeme  
**Autor:** Antonio Famog | **Deadline Forum:** 06.11.2026 | **Umfang Arbeit:** ca. 4.000 Wörter + Web-App  
**Repository:** [https://github.com/ant0ni014/SwapDoku](https://github.com/ant0ni014/SwapDoku)

---

### 1. Pitch & Plausibilisierung (Management- / VC-Perspektive)
Klassische Online-Sudokus sind starre, werbeüberladene Singleplayer-Tools. **SwapDoku** revolutioniert dieses Genre durch echte kooperative Vernetzung: Über einen synchronisierten 10-Sekunden-Timer tauschen zwei Spieler in Echtzeit ihre Spielfelder aus (**Co-Op Swap**) oder treten im **Versus-Modus** gegeneinander an. 

**Warum das Projekt überzeugt und technisch machbar ist:**
- **Zero-Build & Zero-Assets:** Keine schwerfälligen Frameworks (React/Angular) und keine MP3-Dateien. Pures Vanilla ES6+, CSS Grid und Web Audio API garantieren Ladezeiten unter 100 ms.
- **Serverlose Echtzeit-Architektur:** Skalierbare WebSockets über Supabase BaaS eliminieren Server-Wartungskosten vollständig.
- Die technische Machbarkeit mathematischer Backtracking-Solver und latenzarmer Synchronisation ist durch lauffähige Prototypen bereits nachgewiesen.

---

### 2. Angestrebtes Ergebnis
1. **Lauffähige Web-App:** Eine responsive Single-Page-Application (Desktop & Mobile) mit 3 Spielmodi (Zen-Einzelspieler, Versus gegen Mensch/Bot, Co-Op Swap), 6 Themes und Offline-Fähigkeit.
2. **Wissenschaftliche Semesterarbeit (ca. 4.000 Wörter):** Fundierte Analyse von Echtzeit-Synchronisation, Frontend-Algorithmen und nativer Web-Performance.

---

### 3. Ziele und Nutzen (SMART)
- **S (Spezifisch):** Vollständige Implementierung eines zustandsbehafteten Echtzeit-Sudokus mit browsernativem Stack und serverlosen WebSockets.
- **M (Messbar):** First Contentful Paint (FCP) < 200 ms, WebSocket-Sync-Latenz < 80 ms, Google Lighthouse Score > 95, 0 Build-Abhängigkeiten.
- **A (Attraktiv):** Sofort spielbar ohne Registrierungszwang, 100 % werbefrei, barrierearmes minimalistisches Design.
- **R (Realistisch):** Schlanker nativer Stack reduziert Framework-Risiken; Zeitbudget von ca. 140 h ist für eine Person im Semesterrahmen ideal dimensioniert.
- **T (Terminiert):** Forum-Skizze bis 06.11., MVP bis Ende November, finale Semesterarbeit im Januar 2027.

---

### 4. Scope: Leistungsumfang & Qualität
- **In-Scope:** Deterministischer Backtracking-Solver/Generator (3 Schwierigkeitsgrade), Raum-Code-Lobby (4-stellig), Supabase Realtime-Broadcasting, autonome Bot-KI, Web Audio Synthesizer, 6 Kontrast-Themes, zweisprachig (DE/EN).
- **Out-of-Scope:** Native App-Store-Builds (Fokus bleibt 100 % Open Web Standards), In-App-Käufe oder Bezahlschranken.
- **Qualität:** Robuste Fehlerbehandlung mit `localStorage`-Fallback bei Netzausfall, strikte Barrierefreiheit und vollständige Tastatursteuerung.

---

### 5. Strukturierung der Arbeitspakete (3 Stufen)

#### Gruppe A: Minimales MVP (Ziel: Gerade so bestehen / Note 4.0)
* **AP 1.1 UI-Grid:** Responsives 9×9 Spielfeld mit semantischem HTML5 und CSS Grid.
* **AP 1.2 Sudoku-Engine:** Backtracking-Algorithmus zur Validierung und Generierung eindeutig lösbarer Gitter.
* **AP 1.3 Singleplayer Loop:** Zifferneingabe, Notizenfunktion, Fehlerüberprüfung, Timer und lokale Highscores.

#### Gruppe B: "Schöne" Arbeit (Ziel: Gute bis sehr gute Arbeit / Note 2.x – 1.x)
* **AP 2.1 Echtzeit-Multiplayer:** WebSocket-Räume via Supabase Realtime für Versus & Co-Op Board-Swap.
* **AP 2.2 Autonome Bot-KI:** Simulierter Singleplayer-Gegner mit realistischer menschlicher Bedenkzeit.
* **AP 2.3 Web Audio Sound:** Integrierter prozeduraler Lofi-Synthesizer (keine externen Audio-Dateien).
* **AP 2.4 Theme-Engine:** Dynamisches CSS-Variablensystem mit 6 distinkten Farbwelten (inkl. Dark Mode).
* **AP 2.5 i18n:** Unterbrechungsfreie Sprachumschaltung (Deutsch/Englisch).
> *Begründung bei Nicht-Realisierung:* Sollten BaaS-Verbindungslimits oder Web-Audio-Einschränkungen auftreten, greifen definierte Fallbacks: Die Bot-Engine sichert den Versus-Modus 100 % offline ab; Sound wird über "Graceful Degradation" stummgeschaltet. Die Arbeit dokumentiert dies als architektonische Resilienz.

#### Gruppe C: Zusätzliche Erweiterungen (Stretch Goals / Exzellenz)
* **AP 3.1 Cloud-Auth:** Optionale Benutzerkonten und servergespeicherte Profile (Supabase Auth).
* **AP 3.2 Globale Rangliste:** Filterbare Bestenliste nach Schwierigkeitsgrad und Lösungszeit.
* **AP 3.3 Empirische Messreihen:** RTT-Latenzmessungen unter künstlicher Netzwerkdrosselung.

---

### 6. Zeit- & Aufwandsplanung (~140 Personenstunden)
1. **Konzeption & Skizze (bis 06.11.):** Anforderungsanalyse & Architektur (15 h)
2. **MVP-Entwicklung Gruppe A (bis 25.11.):** Grid, Solver, Game-Loop (35 h)
3. **Multiplayer & Features Gruppe B (bis 20.12.):** WebSockets, Swap-Logik, Audio, Themes (40 h)
4. **Testing & Messungen (bis 05.01.):** Cross-Browser-Tests, RTT-Latenzanalysen (15 h)
5. **Schriftliche Ausarbeitung (bis 25.01.):** 4.000-Wörter-Bericht, Review & Abgabe (35 h)

---

### 7. Risiken & Mitigation
- **WebSocket-Abbrüche:** Abfangen durch automatischen Reconnect-Handshake und Zwischenspeicherung im `localStorage`.
- **Latenz-Versatz beim Board-Swap:** Zeitstempel-basierte Synchronisation; Client berechnet Swap-Animation lokal voraus.
- **Rechenaufwand des Solvers:** Optimiertes Backtracking mit Zeilenpermutation erzeugt Puzzles in < 15 ms ohne UI-Blockade.
- **Audio-Autoplay-Richtlinien:** AudioContext startet erst nach Klick auf den Musik-Button (W3C-konform).

---

### 8. Gliederungsvorschlag für die Semesterarbeit (ca. 4.000 Wörter)
1. **Einleitung & Motivation:** Problemstellung, Zielsetzung und Alleinstellungsmerkmal (~400 Wörter)
2. **Technologische Grundlagen:** Zero-Build Vanilla Web vs. Frameworks, WebSockets vs. REST (~700 Wörter)
3. **Konzeption & Systemdesign:** Use Cases, Datenfluss, skandinavisches 2-Spalten-UI (~800 Wörter)
4. **Implementierung der Kernmodule:** Backtracking-Solver, Realtime-Swap, Bot-KI, Web Audio (~1.200 Wörter)
5. **Evaluation & Performance:** Latenzmessungen, Lighthouse-Audit, kritische Würdigung (~600 Wörter)
6. **Fazit & Ausblick:** Zusammenfassung und Erweiterungspotenziale (~300 Wörter)
