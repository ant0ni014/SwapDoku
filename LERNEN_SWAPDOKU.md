# SwapDoku: Lerneffekte, Erkenntnisse & Wissenschaftliche Reflexion

Diese Datei bündelt die persönlichen, fachlichen und methodischen Lerneffekte aus der Entwicklung von SwapDoku. Sie dient als direkte inhaltliche Grundlage für **Kapitel 5.3 (Reflexion)** und **Kapitel 6.1 (Zusammenfassung der Lernerfolge)** der Seminararbeit nach dem FOM-Leitfaden.

---

## 1. Fachlich-technische Lerneffekte

### 1.1 Web-Architektur: Die Stärke von Zero-Build gegenüber Frameworks
- **Erkenntnis:** Moderne Frameworks wie React, Vue oder Next.js bringen beträchtliche Abstraktionskosten mit sich (Virtual DOM, komplexe Build-Pipelines wie Vite/Webpack, riesige `node_modules`-Ordner).
- **Lerneffekt:** Für interaktive Spiele reicht **Vanilla JavaScript (ES6+)** vollkommen aus und bietet unschlagbare Vorteile: Ladezeiten unter 100 ms, keine Abhängigkeitsrisiken, sofortige Ausführbarkeit in jedem Browser und direkter Zugriff auf den DOM-Baum ohne Rehydration-Lags.

### 1.2 Algorithmik: Rekursives Backtracking & Constraint-Zufriedenheit
- **Erkenntnis:** Ein vollständiges Sudoku ist mathematisch ein NP-vollständiges Überdeckungsproblem (*Exact Cover*).
- **Lerneffekt:** Das Verständnis von Tiefensuche (*Depth-First Search*) mit Backtracking: Wie ein Algorithmus Entscheidungen auf einem Stapel (*Call Stack*) trifft, Sackgassen erkennt und Werte deterministisch zurücksetzt. Besonders die Balance zwischen Zufälligkeit und Lösbarkeit (Constraint-Balancing durch Histogramm-Zähler) war eine zentrale mathematische Erkenntnis.

### 1.3 Verteilte Systeme & Echtzeit-Web (HTTP vs. WebSockets)
- **Erkenntnis:** Klassische REST-APIs über HTTP eignen sich nicht für Live-Spiele, da Polling-Anfragen hohe Serverlast und Latenzen erzeugen.
- **Lerneffekt:** Die Funktionsweise bidirektionaler, persistenter **WebSockets** über Supabase Realtime Channels. Verständnis des Unterschieds zwischen **Presence-Tracking** (wer ist im Raum?) und **Broadcasts** (Senden von Spielzuständen und Fortschrittsbalken).

### 1.4 Web Audio API statt statischer Sounddateien
- **Erkenntnis:** Das Einbinden externer MP3-/WAV-Dateien frisst Bandbreite, erfordert Pufferzeiten und kann bei mobilen Datenverbindungen abbrechen.
- **Lerneffekt:** Wie Klang mathematisch direkt im Browser synthetisiert werden kann (`OscillatorNode`, `GainNode`, Hüllkurven). Mit wenigen Zeilen Code entsteht ein ressourcenschonender, latenzfreier Soundgenerator mit 0 Byte Ladezeit.

### 1.5 CSS Grid, CSS Variables & Barrierefreies Theming
- **Erkenntnis:** Responsives Layout bedeutet mehr als nur `@media (max-width: ...)`: Es erfordert eine intelligente Viewport-Nutzung.
- **Lerneffekt:** Beherrschung von CSS Custom Properties (`var(--...)`) für nahtloses Theming und Dark-Mode-Unterstützung sowie CSS Grid (`min(520px, 70vh)`) zur Vermeidung von vertikalem Scrollen auf Laptop-Displays.

---

## 2. Methodische & Projektmanagement-Lerneffekte

### 2.1 Das Prinzip „MVP First“ (Minimum Viable Product)
- **Erkenntnis:** Bei ambitionierten Softwareprojekten besteht die Gefahr, sich frühzeitig in optionalen Features (wie globalen Ranglisten oder Freundeslisten) zu verlieren.
- **Lerneffekt:** Die strikte Priorisierung nach dem 3-Stufen-Modell (MVP $\rightarrow$ Erweitert $\rightarrow$ Optional). Erst als die Core-Engine (Einzelspieler-Sudoku) stabil lief, wurde der Multiplayer aufgesetzt. Dies minimierte Entwicklungsrisiken drastisch.

### 2.2 Robuste Fallback-Strategien (Graceful Degradation)
- **Erkenntnis:** Im Live-Betrieb und bei Präsentationen kann das Netzwerk unvorhersehbar ausfallen.
- **Lerneffekt:** Ein System muss fehlertolerant aufgebaut sein. Durch den lokalen Speicher (`localStorage`) und den integrierten Bot-Gegner funktioniert das Spiel selbst dann zu 100 %, wenn die Cloud-Datenbank oder die WebSocket-Verbindung temporär offline ist.

### 2.3 Refactoring & visuelle Hygiene
- **Erkenntnis:** Überladene Interfaces mit bunten Emojis und inkonsistenten Rahmen stören den Spielfluss und wirken unprofessionell.
- **Lerneffekt:** Schlichtes, reduziertes Design verbessert die Usability (UX) massiv. Konsistente Inline-SVGs und klare Farbwelten schaffen eine ablenkungsfreie Umgebung, die für Denkspiele essenziell ist.

---

## 3. Persönliches Fazit für die Seminararbeit
Die eigenständige Realisierung von SwapDoku von der Konzeption bis zur fertigen Web-Anwendung hat gezeigt, wie theoretische Konzepte der Wirtschaftsinformatik (Zustandsautomaten, verteilte Systeme, Algorithmen) in der Praxis ineinandergreifen. Vor allem die Erfahrung, aufgetretene Hürden (wie den Balancing-Bug bei der Rätselerstellung) strukturiert zu analysieren und methodisch zu lösen, stellt den größten Mehrwert dieses Projekts dar.
