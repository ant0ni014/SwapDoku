# SwapDoku: Wissenschaftliche Konzeption & Dokumentations-Leitfaden für die Seminararbeit

> **Modul:** Web Technologie  
> **Hochschule:** FOM Hochschule für Oekonomie & Management (München)  
> **Studiengang:** Wirtschaftsinformatik  
> **Dozent / Erstgutachter:** Dr. Albert Schappert  
> **Umfang:** Einzelarbeit (~4.000 Wörter, ca. 14–16 Textseiten)  
> **Formaler Standard:** FOM-Leitfaden zur formalen Gestaltung von Seminar- und Abschlussarbeiten (Stand: Januar 2024)  
> **Stand:** Oktober 2026  
> **Autor:** Antonio Famog  
> **Projekt:** SwapDoku (Minimalistisches Echtzeit-Sudoku mit kooperativem Board-Swap, Versus-Modus & Lofi Web Audio)

---

## 1. Status Quo der Codebase & Feature-Inventur

Was ist im Code (`index.html`, `style.css`, `app.js`, `schema.sql`) bereits implementiert und was wird wie betrieben?

### 1.1 Co-Op Swap mit Bot vs. mit Online-Partner
- **Swap mit Bot (bereits 100 % fertig implementiert):**
  - Befindet sich der Spieler im Modus `Co-Op Swap` und wählt `Mit Bot spielen`, läuft ein 10-Sekunden-Countdown (`startSwapCountdown()`).
  - Alle 10 Sekunden wird `doBoardSwap()` aufgerufen: Die Boards (`state.currentBoard` und `state.botBoard`) tauschen lokal die Plätze. Der Bot löst im Hintergrund sein zugewiesenes Gitter schrittweise weiter (`botStep()`), während der Spieler das Board des Bots übernimmt.
  - Optische Kennzeichnung: Dynamischer Wechsel zwischen **Board A (Blauer Rahmen & Badge)** und **Board B (Roter Rahmen & Badge)** inklusive visueller Schrumpf-/Rotationsanimation (`.swapping`).
- **Co-Op Swap online über Supabase Realtime (im Code vorbereitet):**
  - Nutzt WebSockets via `supabase.channel('room:' + code)`.
  - Bei `SWAP` sendet der Client ein Broadcast-Event mit dem aktuellen Board-Zustand an den Partner.
  - Funktioniert im Live-Betrieb, sobald reale Supabase-Projekt-Credentials (URL & Anon-Key) hinterlegt sind; andernfalls greift automatisch der robuste **Offline-/Demo-Modus**.

### 1.2 Konto-Erstellung & Authentifizierung
- **Client-Logik (`app.js`):**
  - Modal mit Umschaltung zwischen „Anmelden“ (`loginUser`) und „Registrieren“ (`registerUser`).
  - Prüfung von E-Mail-Syntax und Mindestpasswortlänge (6 Zeichen).
  - Bei hinterlegten Supabase-Credentials: Echte Benutzerverwaltung über `supabase.auth.signUp()` und `supabase.auth.signInWithPassword()`.
  - **Graceful Fallback:** Ist kein Backend erreichbar oder befindet sich das Spiel im Offline-Modus, wird ein lokales Gastkonto im `localStorage` emuliert, sodass alle Gamification-Funktionen (Theme-Freischaltung, Punkte) ohne Serverunterbrechung nutzbar bleiben.
- **Datenbank (`schema.sql`):**
  - PostgreSQL-Schema mit `public.profiles` und `public.unlocked_themes`.
  - Row Level Security (RLS) Richtlinien für Datensicherheit und automatischer User-Trigger (`handle_new_user()`).

---

## 2. Definitive Gliederung (4.000 Wörter, FOM-Leitfaden 2024 konform)

Diese Gliederung erfüllt alle Kriterien des FOM-Leitfadens (Subordinationsprinzip: mind. 2 Unterpunkte je Stufe, Proportionalität der Kapitel, neutraler wissenschaftlicher Stil, Pflicht-Verzeichnisse).

```text
Inhaltsverzeichnis .................................................................... II
Abbildungsverzeichnis ................................................................. III
Tabellenverzeichnis .................................................................... IV
Abkürzungsverzeichnis ................................................................... V

1. Einleitung .......................................................................... 1
   1.1 Problemstellung und Ausgangslage im Markt browserbasierter Rätselspiele ......... 1
   1.2 Zielsetzung und Alleinstellungsmerkmal des kooperativen Board-Swaps ............ 2
   1.3 Aufbau der Arbeit ............................................................... 3

2. Konzeptionelle Anforderungen und Systemarchitektur ................................. 4
   2.1 Anforderungsdefinition nach dem MoSCoW-Schema ................................... 4
       2.1.1 Funktionale Kernanforderungen und Spielmodi ............................... 4
       2.1.2 Nicht-funktionale Kriterien bezüglich Latenz, Barrierefreiheit und UI ..... 5
   2.2 Architekturentwurf .............................................................. 6
       2.2.1 Client-Architektur im Zero-Build-Paradigma (HTML5/CSS3/Vanilla JS) ........ 6
       2.2.2 Backend-as-a-Service: Serverlose Echtzeitkommunikation über WebSockets .... 7

3. Vorgehensmodell und Arbeitsorganisation ............................................ 8
   3.1 Adaption des agilen Vorgehensmodells für ein Ein-Personen-Projekt ............... 8
   3.2 Meilenstein- und Ressourcenplanung .............................................. 9
   3.3 Qualitätssicherungs- und Risikostrategie ....................................... 10

4. Technische Realisierung der Kernsysteme ............................................ 11
   4.1 Sudoku-Engine und Spiellogik .................................................... 11
       4.1.1 Deterministische Gitter-Generierung und Backtracking-Solver ............... 11
       4.1.2 Validierung, Fehlermanagement und lokales Notiz-System .................... 12
   4.2 Vernetzung und synchrone Spielmechanik .......................................... 13
       4.2.1 Peer-Synchronisation und Session-Handling via Supabase Realtime ........... 13
       4.2.2 Algorithmische Umsetzung des synchronen 10-Sekunden-Board-Swaps ........... 14
   4.3 Audio-Synthese und responsives Design-System ................................... 15
       4.3.1 Prozedurale Klangerzeugung über die Web Audio API ......................... 15
       4.3.2 Adaptives Layout und Dark-Mode-Integration mittels CSS Custom Properties .. 16

5. Projektevaluation und kritische Würdigung .......................................... 17
   5.1 Soll-Ist-Vergleich von Aufwand und Funktionsumfang .............................. 17
   5.2 Analyse technischer Hürden und Lerneffekte ..................................... 18
   5.3 Methodische und fachliche Reflexion ............................................ 19

6. Fazit und Ausblick ................................................................. 20
   6.1 Zusammenfassung der Ergebnisse ................................................. 20
   6.2 Zukünftiges Entwicklungspotenzial .............................................. 21

Literaturverzeichnis .................................................................. 22
KI-Hilfsmittelverzeichnis ............................................................. 24
Anhang ................................................................................ 25
```

---

## 3. Wortbudget & Kapitelproportionen (Ziel: 4.000 Wörter)

| Kapitel | Bezeichnung | Ziel-Wörter | Entspricht Seiten | Primärer Inhalt |
| :--- | :--- | :---: | :---: | :--- |
| **1.** | Einleitung | **ca. 400** | ~1,5 | Web-Sudoku Markt, Werbung, Ziel: Zen & Co-Op, SMART-Ziele |
| **2.** | Konzeption & Architektur | **ca. 800** | ~3,0 | MoSCoW-Matrix, Zero-Build vs. React, BaaS vs. Node.js WebSocket-Server |
| **3.** | Vorgehensmodell & Planung | **ca. 600** | ~2,0 | Agil solo, Meilensteintabelle (80h), Risiken & Fail-Fast |
| **4.** | Technische Realisierung | **ca. 1.400**| ~5,0 | Backtracking-Code, Swap-Sync, Bot-Logik, Web Audio, CSS Custom Props |
| **5.** | Projektevaluation | **ca. 500** | ~2,0 | Soll-Ist Tabelle, Balancing-Bug, Timer-Race-Conditions, Lerneffekte |
| **6.** | Fazit & Ausblick | **ca. 300** | ~1,0 | Lernerfolge WebSockets/Canvas/Audio, PWA-Ausblick |
| **Gesamt** | **Reiner Fließtext** | **~4.000 Wörter** | **~15 Seiten** | (exkl. Verzeichnisse & Anhang) |

---

## 4. Arbeitspakete & Ressourcenplanung (Einzelperson: 80 Stunden)

### 4.1 Geplante Aufwände (für Kapitel 3.2)
| Meilenstein | AP-Nr. | Arbeitspaket | Geplante Stunden |
| :--- | :---: | :--- | :---: |
| **Phase 1: Vorbereitung & MVP** | AP 1 | Anforderungsanalyse, Systemarchitektur & Datenfluss | 8 h |
| | AP 2 | Semantisches HTML5-Gerüst & Responsive CSS-Grid | 8 h |
| | AP 3 | Sudoku Core-Engine (Backtracking-Generator & Lösungsprüfer) | 12 h |
| **Phase 2: Game-Loop & Audio** | AP 4 | Spielfluss (Eingabesystem, Notizen, Lebens-System, Timer) | 8 h |
| | AP 5 | Prozeduraler Lofi-Synthesizer via Web Audio API | 4 h |
| **Phase 3: Realtime & Co-Op** | AP 6 | Supabase BaaS Setup, Realtime Channels & Auth-Anbindung | 8 h |
| | AP 7 | Kooperative 10-Sekunden-Swap-Mechanik (Bot & WebSocket) | 10 h |
| | AP 8 | Autonome Bot-KI für den Singleplayer-Versus | 4 h |
| **Phase 4: Abschluss & Doku** | AP 9 | Qualitätssicherung, Usability-Tests & Bugfixing | 6 h |
| | AP 10 | Verfassen der wissenschaftlichen Seminararbeit | 10 h |
| | — | Puffer / Zeitreserve | 2 h |
| **Gesamt** | | | **80 h** |

### 4.2 Soll-Ist-Vergleich (für Kapitel 5.1)
| AP | Beschreibung | Soll | Ist | Diff. | Begründung & Lerneffekt |
| :---: | :--- | :---: | :---: | :---: | :--- |
| AP 1–2 | Konzept & UI-Gerüst | 16 h | 15 h | -1 h | Schnelle Umsetzung dank modernem CSS Grid / Flexbox |
| AP 3 | Sudoku Engine | 12 h | 17 h | **+5 h** | **Mehrbedarf:** Unerwartet leere 3×3-Blöcke erforderten Histogramm-Constraint |
| AP 4–5 | Game-Loop & Web Audio | 12 h | 11 h | -1 h | Web Audio API Oszillatoren waren extrem effizient umsetzbar |
| AP 6–7 | Supabase Realtime & Swap | 18 h | 22 h | **+4 h** | **Mehrbedarf:** Synchronisationskonflikte beim gleichzeitigen Board-Tausch |
| AP 8 | Bot-Engine | 4 h | 3 h | -1 h | Klare Taktung und Zufalls-Heuristik liefen schnell stabil |
| AP 9 | QA & Bugfixing | 6 h | 4 h | -2 h | Teile der Fehlerbereinigung wurden direkt in AP 3/7 abgefangen |
| AP 10 | Seminararbeit | 10 h | 12 h | +2 h | Höherer Literaturrecherche-Aufwand zu WebSockets & Graphentheorie |
| — | Puffer | 2 h | 0 h | -2 h | Puffer wurde zur Kompensation der technischen Hürden genutzt |
| **Ges.**| | **80 h** | **84 h** | **+4 h** | **Erfolgreich abgeschlossen (nur 5 % Mehraufwand)** |

---

## 5. Relevante Code-Snippets für Kapitel 4

### Snippet 1: Sudoku Clue-Balancing (Verhinderung leerer Blöcke)
```javascript
// app.js (SudokuEngine.generate)
// Stellt sicher, dass kein 3x3-Block weniger als minClues enthält
if (rowCounts[r] > minClues && colCounts[c] > minClues && boxCounts[b] > minClues) {
  board[idx] = 0;
  rowCounts[r]--;
  colCounts[c]--;
  boxCounts[b]--;
}
```

### Snippet 2: Der 10-Sekunden Board-Swap (Lokal mit Bot & über Supabase)
```javascript
// app.js (doBoardSwap)
// Tauscht die Board-Identität und Arrays zwischen lokalem Spieler und Bot/Netzwerk
state.activeBoard = state.activeBoard === 'A' ? 'B' : 'A';
dom.grid.classList.toggle('board-theme-a', state.activeBoard === 'A');
dom.grid.classList.toggle('board-theme-b', state.activeBoard === 'B');

if (state.opponentType === 'bot') {
  const tempBoard = [...state.currentBoard];
  state.currentBoard = [...state.botBoard];
  state.botBoard = tempBoard;
  render();
} else if (state.channel) {
  broadcast('SWAP', {
    currentBoard: state.currentBoard,
    initialBoard: state.initialBoard,
    solution: state.solution,
    activeBoard: state.activeBoard
  });
}
```

### Snippet 3: Prozeduraler Lofi-Synthesizer via Web Audio API
```javascript
// app.js (Web Audio Synth)
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
osc.connect(gain).connect(audioCtx.destination);
osc.start();
osc.stop(audioCtx.currentTime + 1.2);
```

---

## 6. Vorgaben gemäß FOM-Leitfaden (Januar 2024)
- **Schrift & Abstände:** Times New Roman 12 pt (oder Arial 11,5 pt), 1,5-zeilig. Vor Absatz 0 pt, nach Absatz 6 pt.
- **Ränder:** Oben 4 cm, Unten 2 cm, Links 4 cm, Rechts 2 cm.
- **Zitierweise:** Entweder durchgängig Chicago-Style (Fußnoten mit Kurzbeleg: `Vgl. Nachname, Stichwort, Jahr, S. X.`) oder Harvard-Style im Text.
- **Wissenschaftlicher Stil:** Strikte 3. Person (kein „ich“, kein „wir“, keine Füllwörter wie „eigentlich“, „man“).
- **KI-Dokumentationspflicht:** Eigenes Verzeichnis *KI-Hilfsmittelverzeichnis* nach dem Literaturverzeichnis mit Tool-Nennung, Version und Einsatzzweck.
