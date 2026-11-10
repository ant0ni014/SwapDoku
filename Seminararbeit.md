# SwapDoku – Wissenschaftliche Ausarbeitung (Seminararbeit)

> **Modul:** Web Technologie  
> **Studiengang:** Wirtschaftsinformatik (FOM Hochschule für Oekonomie & Management, Hochschulzentrum München)  
> **Erstgutachter:** Dr. Albert Schappert  
> **Autor:** Antonio Famog  
> **Thema:** Konzeption und Realisierung eines modernen, werbefreien Web-Sudokus mit kooperativem Echtzeit-Board-Swap, Versus-Modus und serverloser Cloud-Architektur  
> **Projekt-URL:** [https://swapdoku.vercel.app](https://swapdoku.vercel.app)  
> **Code-Repository:** [https://github.com/ant0ni014/SwapDoku](https://github.com/ant0ni014/SwapDoku)  
> **Formaler Standard:** FOM-Leitfaden zur formalen Gestaltung von Seminar- und Abschlussarbeiten (Stand: Januar 2024)

---

## Inhaltsverzeichnis

- **1 Einleitung**
  - 1.1 Aufgabenstellung
  - 1.2 Motivation und Ausgangslage
  - 1.3 Zielsetzung nach dem SMART-Prinzip
  - 1.4 Aufbau der Arbeit
- **2 Anforderungsanalyse und Konzeption**
  - 2.1 Funktionale Anforderungen (3-Stufen-Modell)
    - 2.1.1 Grundversion (MVP – Einzelspieler-Modus)
    - 2.1.2 Erweiterter Umfang (Versus-Modus, Bot-KI und Co-Op Swap)
    - 2.1.3 Zusatzfunktionen (Cloud-Authentifizierung, Ranglisten und DSGVO)
  - 2.2 Nicht-funktionale Qualitätskriterien
  - 2.3 User-Interface- und UX-Design-Konzept
- **3 Technologie und Systemarchitektur**
  - 3.1 Technologieauswahl (Zero-Build-Frontend und Backend-as-a-Service)
  - 3.2 System- und Datenflussarchitektur
- **4 Projektmethodik und Vorgehensweise**
  - 4.1 Iteratives Vorgehensmodell in drei Entwicklungsstufen
  - 4.2 Zeit- und Ressourcenplanung (140-Stunden-Budget)
  - 4.3 Risikomanagement und Qualitätssicherung
- **5 Technische Umsetzung und Implementierung**
  - 5.1 Benutzeroberfläche und adaptives Design-System
  - 5.2 Sudoku-Engine: Backtracking, Validierung und Clue-Balancing
  - 5.3 Mehrspieler- und Board-Swap-Synchronisation in Echtzeit
  - 5.4 Autonome Bot-Engine und prozedurale Web Audio Synthese
- **6 Projektauswertung und Reflexion**
  - 6.1 Soll-Ist-Vergleich und Aufwandsanalyse
  - 6.2 Technische Herausforderungen und Problemlösungen
  - 6.3 Performance-, Latenz- und Barrierefreiheits-Evaluation
- **7 Fazit und Ausblick**
  - 7.1 Zusammenfassung der Projektergebnisse
  - 7.2 Kritische Würdigung und zukünftige Entwicklungspotenziale
- **Literaturverzeichnis**

---

## 1 Einleitung

Das logische Zahlenrätsel Sudoku gehört weltweit zu den traditionsreichsten und populärsten Denksportaufgaben. Seine mathematischen Wurzeln reichen bis in das 18. Jahrhundert zu den *Lateinischen Quadraten* des Schweizer Mathematikers Leonhard Euler zurück, ehe es 1979 von Howard Garns unter der Bezeichnung *Number Place* in den Vereinigten Staaten publiziert und ab Mitte der 1980er-Jahre über Japan global verbreitet wurde.¹ Im modernen Medienzeitalter hat sich das Spielgeschehen fast vollständig von gedruckten Publikationen auf internetbasierte Endgeräte verlagert. Die vorliegende Seminararbeit dokumentiert die Konzeption, architektonische Modellierung und softwaretechnische Realisierung einer modernen, kollaborativen Web-Applikation dieses Klassikers unter dem Projektnamen **SwapDoku**.

### 1.1 Aufgabenstellung

Die Prüfungsleistung im Modul „Web Technologie“ an der FOM Hochschule umfasst die eigenständige Konzeption und programmtechnische Umsetzung einer interaktiven Web-Anwendung sowie deren begleitende wissenschaftliche Dokumentation. Gefordert wird die Erstellung eines lauffähigen Software-Artefakts unter Einsatz etablierter Standards des World Wide Web Consortiums (W3C), das methodisch fundiert entwickelt und auf Desktop- wie Mobilgeräten gleichermaßen fehlerfrei betrieben werden kann.

Für das Projekt SwapDoku beinhaltet diese Aufgabenstellung die Realisierung eines vollständigen, barrierearmen 9×9-Sudokus. Neben einem klassischen Einzelspieler-Modus mit automatisierter Rätselerzeugung in mehreren Schwierigkeitsgraden liegt der Kern der Anforderung in der Implementierung vernetzter Mehrspielermodi. Die Web-Applikation muss zwei Teilnehmende über das Internet in Echtzeit synchronisieren, ein reaktives User Interface bereitstellen und ohne lokale Installation im Browser ausführbar sein.

### 1.2 Motivation und Ausgangslage

Die persönliche und fachliche Motivation für das Projekt gründet auf der Beobachtung bestehender Marktangebote im Bereich browserbasierter Logikspiele. Eine Untersuchung gängiger Online-Sudoku-Plattformen offenbart signifikante Defizite in der Benutzungserfahrung (*User Experience*, UX):

1. **Kommerzialisierung und Konzentrationsstörungen:** Frei zugängliche Plattformen finanzieren sich überwiegend durch aufdringliche Bannerwerbung, Video-Einblendungen oder wiederkehrende Aufforderungen zum Download nativer Apps. Für ein fokussiertes Denkspiel stellt diese visuelle Unruhe eine erhebliche Beeinträchtigung des Spielflusses dar.²
2. **Mangelnde Innovation im Mehrspielerbereich:** Digitale Sudokus beschränken sich fast ausnahmslos auf isolierte Einzelpartien oder das passive Vergleichen von Endzeiten in statischen Bestenlisten. Kollaborative Spielmechaniken, in denen zwei Personen aktiv im Team zusammenarbeiten und aufeinander angewiesen sind, existieren im aktuellen Marktumfeld praktisch nicht.
3. **Schwerfällige Software-Stacks:** Zahlreiche Webanwendungen greifen auf überdimensionierte Frontend-Frameworks zurück, die zu spürbaren Ladeverzögerungen und unnötigem Ressourcenverbrauch auf mobilen Endgeräten führen.

SwapDoku überwindet diese Schwachstellen durch ein minimalistisches, werbefreies und ressourceneffizientes Web-Spiel, das klassische Sudoku-Regeln mit einem innovativen kooperativen Echtzeit-Tausch (*Co-Op Swap*) verbindet.

### 1.3 Zielsetzung nach dem SMART-Prinzip

Die Projektziele wurden anhand der SMART-Kriterien operationalisiert:

- **Spezifisch (S):** Entwicklung einer werbefreien Web-Single-Page-Application für 9×9-Sudoku mit drei Spielmodi (Einzelspieler, Duell-Modus Versus und kooperativer Co-Op Swap) in drei Schwierigkeitsgraden (Einfach, Mittel, Schwer).
- **Messbar (M):** Die Initialladezeit liegt unter 200 Millisekunden, die WebSocket-Latenz unter 100 Millisekunden, der Google-Lighthouse-Performance-Score erreicht mindestens 95 Punkte und die Rätselgenerierung erfolgt ohne spürbare Blockade des User Interfaces in unter 15 Millisekunden.
- **Attraktiv (A):** Sofortiger Spielstart ohne Registrierungszwang. Ein 4-stelliger Raum-Code ermöglicht das problemlose Einladen von Mitspielenden. Ergänzend stehen ein Cloud-Konto und filterbare Ranglisten bereit.
- **Realistisch (R):** Durch die konsequente Reduktion auf native Web-Standards (Vanilla HTML5/CSS3/JavaScript) und die Auslagerung der Serverinfrastruktur an einen serverlosen Backend-as-a-Service-Dienst (Supabase) ist das Projekt im vorgegebenen Zeitbudget von einer Einzelperson umsetzbar.
- **Terminiert (T):** Fertigstellung der Konzeption und MVP-Basis im Oktober 2026, Finalisierung der Multiplayer-Synchronisation und Cloud-Anbindung bis Anfang November 2026, gefolgt von der wissenschaftlichen Ausarbeitung und Abgabe im Januar 2027.

### 1.4 Aufbau der Arbeit

Die Arbeit orientiert sich am idealtypischen Lebenszyklus eines Software-Engineering-Projekts:  
Kapitel 2 analysiert die fachlichen Anforderungen nach dem MoSCoW-Prinzip und skizziert das Gestaltungskonzept. Kapitel 3 begründet die Wahl des Zero-Build-Stacks sowie der WebSocket-Architektur. In Kapitel 4 werden die Projektorganisation und das Risikomanagement dargelegt. Das fünfte Kapitel bildet den Schwerpunkt der Arbeit und beschreibt die technische Umsetzung der Sudoku-Engine, der Mehrspieler-Synchronisation und des Audiosystems. Kapitel 6 evaluiert das Projekt anhand eines Soll-Ist-Vergleichs, analysiert aufgetretene Herausforderungen und präsentiert empirische Messwerte. Kapitel 7 schließt mit einer Zusammenfassung und einem Ausblick auf zukünftige Erweiterungsmöglichkeiten ab.

---

## 2 Anforderungsanalyse und Konzeption

Eine systematische Anforderungsanalyse bildet das Fundament jeder planvollen Softwareentwicklung.³ Im Folgenden werden die funktionalen Anforderungen strukturiert nach dem MoSCoW-Verfahren priorisiert, bevor die nicht-funktionalen Qualitätskriterien und das UI/UX-Design-Konzept vorgestellt werden.

### 2.1 Funktionale Anforderungen (3-Stufen-Modell)

Um das Entwicklungsrisiko zu minimieren, wurden die funktionalen Anforderungen in drei aufeinander aufbauende Stufen gegliedert:

#### 2.1.1 Grundversion (MVP – Einzelspieler-Modus)

Die Basisebene stellt ein autark spielbares Sudoku bereit:
- **F-01 (9×9-Gitter):** Vollständige Darstellung eines 9×9-Spielfelds, aufgeteilt in neun 3×3-Blöcke.
- **F-02 (Rätselgenerierung):** Algorithmische Erzeugung von lösbaren Sudoku-Gittern in den Schwierigkeitsgraden Einfach (42 Startzahlen), Mittel (34 Startzahlen) und Schwer (28 Startzahlen).
- **F-03 (Eingabe & Steuerung):** Unterstützung von Zifferneingaben (1–9) sowohl per Tastatur als auch über einen berührungsempfindlichen Bildschirm-Ziffernblock.
- **F-04 (Notiz-System):** Möglichkeit, Ziffernkandidaten als Bleistift-Notizen innerhalb einer Zelle zu erfassen und automatisiert bei Belegung benachbarter Zellen zu bereinigen.
- **F-05 (Fehlermanagement & Lebenssystem):** Validierung jeder Benutzereingabe gegen die mathematische Lösung; Abzug von Leben bei Fehlern (5 Leben bei Einfach, 3 bei Mittel, 1 bei Schwer) mit Game-Over-Bedingung bei 0 Leben.
- **F-06 (Zeitmessung):** Lokale Stoppuhr mit Pause-Funktion zur Erfassung der Lösungsdauer.

#### 2.1.2 Erweiterter Umfang (Versus-Modus, Bot-KI und Co-Op Swap)

Die zweite Entwicklungsstufe adressiert den Kern des Alleinstellungsmerkmals:
- **F-07 (Lobby & Raum-Code):** Erstellung und Beitritt zu privaten Mehrspieler-Räumen über einen 4-stelligen alphanumerischen Raum-Code.
- **F-08 (Versus-Duell):** Zeitgleiches Lösen desselben Puzzles durch zwei Kontrahenten mit Live-Übertragung des prozentualen Fortschrittsbalkens.
- **F-09 (Autonome Bot-Engine):** Simulation eines Gegners für den Offline-Betrieb mit drei einstellbaren Denkgeschwindigkeiten (3,8 s, 2,4 s und 1,4 s pro Zelle).
- **F-10 (Kooperativer Board-Swap):** Gleichzeitiges Starten zweier Spielender auf zwei unterschiedlichen Rätseln (Board A und Board B). Automatisiertes Tauschen der Spielfelder alle 10 Sekunden über das Netzwerk.
- **F-11 (Dual-Board-Sieg):** Der Co-Op-Modus gilt erst dann als gewonnen, wenn *beide* Spielfelder (Board A und Board B) vollständig korrekt gelöst wurden.
- **F-12 (Theme-Engine & Audio):** Bereitstellung von sechs Farbthemen (inkl. Dark Mode) sowie einer integrierten, prozeduralen Hintergrundmusik.
- **F-13 (Internationalisierung):** Laufzeit-Umschaltung aller Benutzeroberflächen-Texte zwischen Deutsch und Englisch.

#### 2.1.3 Zusatzfunktionen (Cloud-Authentifizierung, Ranglisten und DSGVO)

Die dritte Stufe ergänzt das System um Persistenz- und Rechtskonformitäts-Features:
- **F-14 (Benutzerverwaltung):** Optionale Registrierung und Anmeldung mit E-Mail-Adresse und Passwort über Supabase Auth.
- **F-15 (Globale Ranglisten):** Persistierung von Bestzeiten und Duell-Siegen in einer PostgreSQL-Cloud-Datenbank mit Filterung nach Spielmodus und Schwierigkeitsgrad.
- **F-16 (DSGVO-Cookie-Banner):** Bereitstellung eines datenschutzkonformen Einwilligungsbanners zur Speicherung lokaler Einstellungen und Aktivierung von WebSockets.

Tabelle 1 fasst die Anforderungen im Überblick zusammen:

| ID | Anforderungsbezeichnung | Priorität (MoSCoW) | Umsetzungsstatus |
| :--- | :--- | :--- | :--- |
| F-01 bis F-06 | 9×9-Gitter, Generator, Notizen, Lebenssystem, Timer | Must-Have (MVP) | Vollständig umgesetzt |
| F-07 bis F-10 | Lobby, Versus, Bot-Gegner, 10s-Board-Swap | Must-Have (Stufe 2) | Vollständig umgesetzt |
| F-11 bis F-13 | Dual-Board-Sieg, 6 Themes, Lofi-Audio, i18n (DE/EN) | Should-Have (Stufe 2) | Vollständig umgesetzt |
| F-14 bis F-16 | Supabase Auth, Cloud-Leaderboard, DSGVO-Banner | Could-Have (Stufe 3) | Vollständig umgesetzt |

*Tabelle 1: Anforderungsmatrix von SwapDoku nach dem MoSCoW-Schema.*

### 2.2 Nicht-funktionale Qualitätskriterien

Die nicht-funktionalen Anforderungen wurden in Anlehnung an das Qualitätsmodell der internationalen Norm ISO/IEC 25010 definiert:⁴

- **Performanz und Latenz:** Der *First Contentful Paint* (FCP) soll 200 Millisekunden nicht überschreiten. Um eine flüssige Benutzerinteraktion zu gewährleisten, muss die Reaktionszeit auf Eingaben unter 100 Millisekunden liegen, da Latenzen unterhalb dieser Schwelle vom menschlichen Nervensystem als verzögerungsfrei wahrgenommen werden.⁵
- **Verfügbarkeit und Resilienz (Offline-First):** Fällt die Internetverbindung aus oder ist das Cloud-Backend nicht erreichbar, muss die Anwendung nahtlos in einen Offline-Modus wechseln, in dem Einzelspieler und Bot uneingeschränkt nutzbar bleiben.
- **Benutzbarkeit und Zugänglichkeit:** Das Spielfeld muss ohne horizontales oder vertikales Scrollen vollständig auf Standard-Laptop-Bildschirmen sichtbar sein. Tastatursteuerung und mobile Touch-Bedienung müssen gleichwertig unterstützt werden.
- **Datensparsamkeit und Werbefreiheit:** Das Spiel verzichtet vollständig auf Werbebanner, Third-Party-Tracking und Bezahlschranken.

### 2.3 User-Interface- und UX-Design-Konzept

Das UI-Design folgt dem Leitmotiv des *skandinavischen Minimalismus*. Da das Lösen kombinatorischer Logikrätsel erhebliche kognitive Ressourcen bindet, soll die Schnittstelle frei von ablenkenden Reizen sein. Bunte Emojis wurden durchgängig durch monochrome, geometrische SVG-Vektorgrafiken ersetzt, die ihre Farbe dynamisch an das aktive Farbschema anpassen (`stroke="currentColor"`).

Auf Desktop-Geräten ($\ge 768\text{px}$) kommt ein horizontales 2-Spalten-Layout zum Einsatz: Die linke Spalte reserviert den Raum für das 9×9-Spielfeld, während die rechte Spalte Statusanzeigen, Stoppuhr, Modusauswahl und das 3×3-Numpad bündig anordnet. Die Gesamthöhe ist auf `100vh` fixiert, wodurch störendes vertikales Scrollen auf Laptops eliminiert wird. Auf Mobilgeräten schaltet das System auf ein vertikales Ein-Spalten-Layout um.

Zur visuellen Orientierung dienen drei zentrale Mechanismen:
1. **Fadenkreuz-Hervorhebung:** Bei Selektion einer Zelle werden die gesamte Zeile und Spalte dezent markiert.
2. **Farbliche Ziffern-Divergenz:** Initial vorgegebene Startzahlen werden in neutralem Schwarz/Dunkelgrau dargestellt, während valide Benutzereingaben in kontrastreichem Blau (`--user-val`) gerendert werden.
3. **Zwei-Farben-Leitsystem im Co-Op Swap:** Board A wird durch einen blauen Rahmen (`#0284c7`) und Board B durch einen roten Rahmen (`#ef4444`) gekennzeichnet. Ein begleitendes Badge und eine kurze CSS-Schrumpfanimation (`.swapping`) signalisieren den Tauschvorgang eindeutig.

---

## 3 Technologie und Systemarchitektur

Dieses Kapitel begründet die Auswahl des Technologie-Stacks und beschreibt die daraus resultierende Software- und Kommunikationsarchitektur.

### 3.1 Technologieauswahl (Zero-Build-Frontend und Backend-as-a-Service)

**Verzicht auf Frontend-Frameworks (Zero-Build Vanilla Stack):**  
In zeitgenössischen Web-Projekten dominieren Single-Page-Application-Frameworks wie React, Angular oder Vue.js. Für SwapDoku wurde nach fundierter Abwägung bewusst auf diese Werkzeuge verzichtet. Frameworks bringen erhebliche Abstraktionskosten mit sich: Virtual-DOM-Overheads, komplexe Build-Pipelines (Vite/Webpack), volatile Abhängigkeitsbäume (`node_modules`) sowie Bundle-Größen von mehreren Megabytes. SwapDoku basiert stattdessen auf reinem **HTML5, modernem CSS (CSS Grid, Flexbox, Custom Properties) und nativem JavaScript (ECMAScript 2020+)**. Der gesamte Quellcode wird unkomprimiert in unter 120 Kilobytes ausgeliefert und läuft direkt ohne Build-Schritt in jeder Browser-Laufzeitumgebung.

**Backend-as-a-Service via Supabase Realtime:**  
Für synchrone Mehrspieler-Interaktionen scheidet das zustandslose HTTP-Protokoll aus, da regelmäßiges Polling hohe Latenzen und Serverlasten verursacht. Stattdessen ist das WebSocket-Protokoll (RFC 6455) erforderlich, welches eine permanente, bidirektionale Vollduplex-Verbindung zwischen Client und Server etabliert.⁶ Anstelle eines selbst gehosteten Node.js-Servers fiel die Wahl auf **Supabase Realtime**. Tabelle 2 stellt die Vor- und Nachteile beider Ansätze gegenüber:

| Bewertungskriterium | Dedizierter WebSocket-Server (Node.js/ws) | Backend-as-a-Service (Supabase Realtime) |
| :--- | :--- | :--- |
| **Betriebs- & Wartungsaufwand** | Hoch (Server-Updates, Monitoring, SSL-Zertifikate) | Null (Vollständig verwaltete Cloud-Infrastruktur) |
| **Kostenstruktur** | Fixkosten für VPS/Cloud-Instanzen auch bei Leerlauf | Kostenfreies Kontingent; serverlose Abrechnung |
| **Datenbankintegration** | Manuelle Anbindung an Datenbank und ORM erforderlich | Integrierte PostgreSQL 15 mit Row Level Security |
| **Entwicklungszeit** | Hoch (Session-Handling, Reconnects selbst coden) | Sehr gering (vorkonfigurierte Channels und Presence) |
| **Spiellogik-Autorität** | Vollständig serverseitig möglich (Cheat-Schutz) | P2P-Broadcast-Logik (Host-Autorität auf Client) |

*Tabelle 2: Systemvergleich zwischen dediziertem Node.js-Server und Supabase BaaS.*

Die Entscheidung für Supabase ermöglichte es, ein voll vernetztes Mehrspielerspiel ohne Serverbetriebskosten zu realisieren.

**Prozedurale Klangerzeugung über die Web Audio API:**  
Anstelle statischer MP3-Audiodateien nutzt SwapDoku die browserinterne Web Audio API.⁷ Töne werden in Echtzeit mathematisch aus Schwingungsformen synthetisiert, was Bandbreite und Ladezeiten vollständig eliminiert.

### 3.2 System- und Datenflussarchitektur

Die Gesamtarchitektur gliedert sich in zwei primäre Komponenten: den **Client im Webbrowser** und das **Supabase-Cloud-Backend**. Abbildung 1 visualisiert den Datenfluss:

```
+-------------------------------------------------------------------------------+
|                        CLIENT BROWSER (Vanilla ES6+)                          |
|                                                                               |
|   +-------------------+   +--------------------+   +----------------------+   |
|   |  HTML5 DOM & SVG  |<->| State-Management   |<->|  Web Audio Engine    |   |
|   |  (Responsive UI)  |   | (currentBoard, etc)|   |  (Lofi-Synthesizer)  |   |
|   +-------------------+   +--------------------+   +----------------------+   |
|             ^                       ^                         ^               |
|             |                       |                         |               |
|             v                       v                         v               |
|   +-------------------+   +--------------------+   +----------------------+   |
|   | CSS Theme Engine  |   | SudokuEngine       |   | LocalStorage         |   |
|   | (Custom Properties|   | (Solver/Generator) |   | (Offline-Fallback)   |   |
|   +-------------------+   +--------------------+   +----------------------+   |
+-------------------------------------^-----------------------------------------+
                                      | WebSockets (WSS) / HTTPS
                                      v
+-------------------------------------------------------------------------------+
|                       BACKEND-AS-A-SERVICE (Supabase)                         |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |  Realtime WebSocket Engine                                            |   |
|   |  - Presence Service: Teilnehmererkennung (state.peersCount)           |   |
|   |  - Broadcast Service: START_COUNTDOWN, SWAP_TICK, DO_SWAP_EXCHANGE    |   |
|   +-----------------------------------------------------------------------+   |
|                                     |                                         |
|   +---------------------------------v-------------------------------------+   |
|   |  PostgreSQL 15+ Datenbank                                             |   |
|   |  - Tabellen: profiles, leaderboard_zen, leaderboard_versus, etc.      |   |
|   |  - Sicherheitsrichtlinien: Row Level Security (RLS)                   |   |
|   |  - Stored Procedures: submit_score, handle_new_user                   |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```
*Abbildung 1: System- und Datenflussarchitektur von SwapDoku.*

Im Mehrspielermodus fungiert der Raumersteller als logischer Host. Der Verbindungsaufbau und der Datenfluss folgen einem definierten Protokoll:
1. **Lobby-Phase:** Beide Clients verbinden sich mit dem Kanal `room:CODE` und registrieren sich über `presence.track()`.
2. **Start-Phase:** Erkennt der Host zwei Teilnehmende, sendet er per Broadcast das Signal `START_COUNTDOWN`. Auf beiden Bildschirmen läuft ein synchroner 3-Sekunden-Countdown ab.
3. **Spiel-Phase:** Im Duell wird fortlaufend das Event `PROGRESS` gestreamt. Im Co-Op Swap sendet der Host jede Sekunde `SWAP_TICK`, gefolgt vom Tausch-Payload `DO_SWAP_EXCHANGE` nach 10 Sekunden.
4. **Persistenz-Phase:** Nach Spielende wird das Ergebnis via Stored Procedure `submit_score` in die Cloud-Datenbank übertragen.

---

## 4 Projektmethodik und Vorgehensweise

Dieses Kapitel beschreibt das organisatorische Vorgehensmodell, die Meilensteinplanung und die Maßnahmen zur Qualitätssicherung während des Entwicklungsverlaufs.

### 4.1 Iteratives Vorgehensmodell in drei Entwicklungsstufen

Für die Durchführung des Projekts wurde ein agiles, an Scrum angelehntes Vorgehensmodell gewählt.⁸ In einem Ein-Personen-Projekt entfallen formale Teamrollen wie Scrum Master oder Product Owner; die zentralen Prinzipien – das Arbeiten in kurzen, zielgerichteten Iterationen und die sukzessive Verfeinerung eines lauffähigen Produktinkrements – wurden jedoch strikt beachtet:

- **Sprint 1 (MVP-Basis):** Implementierung des DOM-Spielfelds, Entwicklung der Backtracking-Engine, Zifferneingabe, Lebenssystem und Stoppuhr.
- **Sprint 2 (Multiplayer & UX):** Integration der Supabase-WebSockets, Entwicklung des Co-Op-Swap-Protokolls, der Bot-Engine, der Web Audio API und des skandinavischen Theme-Systems.
- **Sprint 3 (Backend & Refactoring):** Anbindung der PostgreSQL-Cloud-Datenbank, User-Authentifizierung, DSGVO-Cookie-Banner, duale Co-Op-Sieglogik und Beseitigung von Rand- und Latenzfehlern.

### 4.2 Zeit- und Ressourcenplanung (140-Stunden-Budget)

Für die Gesamtbearbeitung wurde ein Aufwand von 140 Arbeitsstunden veranschlagt. Tabelle 3 stellt den geplanten Ablauf den tatsächlichen Meilensteinen gegenüber:

| Projektphase | Geplante Aufgaben | Zeitfenster | Geplanter Aufwand |
| :--- | :--- | :--- | :--- |
| **Phase 1: Konzeption** | Spielkonzept, Architekturentwurf, Einreichung der Projektskizze | Bis 06.11.2026 | 15 Stunden |
| **Phase 2: MVP-Entwicklung** | 9×9-Gitter, Backtracking-Solver, Einzelspieler-Loop | Bis 25.11.2026 | 35 Stunden |
| **Phase 3: Multiplayer & Audio** | Supabase WebSockets, Board-Swap, Bot-KI, Themes & Sound | Bis 20.12.2026 | 40 Stunden |
| **Phase 4: Testing & Feinschliff** | Cross-Browser-Tests, Latenzmessungen, Fehlerbehebung | Bis 05.01.2027 | 15 Stunden |
| **Phase 5: Schriftliche Arbeit** | Verfassen der wissenschaftlichen Dokumentation, Review | Bis 25.01.2027 | 35 Stunden |
| **Gesamt** | | | **140 Stunden** |

*Tabelle 3: Phasen- und Ressourcenplanung des Projekts.*

### 4.3 Risikomanagement und Qualitätssicherung

Zur Absicherung des Projekterfolgs wurden im Vorfeld kritische technische Risiken identifiziert und proaktive Gegenmaßnahmen definiert:

1. **Netzwerkabbrüche im Live-Betrieb:** Tritt ein Verbindungsverlust auf, schaltet die Web-App transparent in den Offline-Modus um. Lokale Highscores und Einstellungen werden im `localStorage` gepuffert.
2. **Desynchronisation des Board-Swaps:** Um Latenzversätze zwischen den Clients zu verhindern, steuert ausschließlich der Host den Countdown und verteilt den Synchronisationstakt.
3. **Browser-Blockaden bei Audio (Autoplay-Policy):** Um W3C- und Browser-Richtlinien zu genügen, wird der `AudioContext` erst nach expliziter Benutzerinteraktion (Klick auf den Musik-Schalter) instanziiert.

Die Qualitätssicherung erfolgte durch ein mehrstufiges Testverfahren: Syntaktische Validierung über Node.js, manuelle Cross-Browser-Tests (Google Chrome, Mozilla Firefox, Apple Safari) sowie simulierte Mehrspielerpartien auf separaten physischen Geräten (Desktop-PC via Breitband und Smartphone via LTE-Mobilfunk).

---

## 5 Technische Umsetzung und Implementierung

Das fünfte Kapitel dokumentiert die softwaretechnische Umsetzung der Kernmodule von SwapDoku.

### 5.1 Benutzeroberfläche und adaptives Design-System

Die Benutzeroberfläche wird über semantisches HTML5 (`index.html`) strukturiert und über CSS Grid (`style.css`) gerendert. Das 9×9-Gitter besteht aus einem Haupt-Container mit neun Spalten:

```css
#grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  width: min(520px, 70vh);
  height: min(520px, 70vh);
  border: 2px solid var(--border-strong);
  user-select: none;
  touch-action: manipulation;
}
```

Die optische Abgrenzung der 3×3-Blöcke wird über selektive Ränder realisiert: Jede Zelle an Position `(col + 1) % 3 === 0 && col !== 8` erhält eine dickere rechte Rahmenlinie; analoges gilt für jede dritte Zeile.

Das Farbsystem basiert vollständig auf CSS Custom Properties. Listing 1 demonstriert die Definition des Standard-Themes sowie des dunklen Farbschemas:

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --border-strong: #0f172a;
  --text: #0f172a;
  --user-val: #2563eb;
  --highlight: #f1f5f9;
}

[data-theme="dark-slate"] {
  --bg: #090d16;
  --surface: #111827;
  --border: #374151;
  --border-strong: #9ca3af;
  --text: #f9fafb;
  --user-val: #38bdf8;
  --highlight: #1e293b;
}
```
*Listing 1: Theme-Definition über CSS Custom Properties.*

Ein Themenwechsel erfordert lediglich das Ändern des HTML-Attributs `data-theme` am Dokumenten-Wurzelelement (`document.documentElement.setAttribute('data-theme', themeId)`). Der Browser berechnet die Farbdarstellung aller Komponenten daraufhin unmittelbar neu, ohne dass ein DOM-Neuaufbau erforderlich ist.

### 5.2 Sudoku-Engine: Backtracking, Validierung und Clue-Balancing

Die mathematische Kernlogik ist in der Klasse `SudokuEngine` (`app.js`) gekapselt. Die Generierung eines neuen Spielfelds gliedert sich in drei Schritte:

**Schritt 1 – Konfliktfreie Initialisierung:**  
Die drei unabhängigen 3×3-Diagonalblöcke (Block 0, 4 und 8) werden mit zufälligen Permutationen der Ziffern 1 bis 9 gefüllt. Da diese Blöcke weder Zeilen noch Spalten teilen, ist dieser Vorgang mathematisch garantiert konfliktfrei und reduziert den anschließenden Suchraum drastisch.

**Schritt 2 – Rekursives Backtracking (`solve`):**  
Ausgehend von den vorbefüllten Blöcken durchsucht ein rekursiver Tiefensuch-Algorithmus (*Depth-First Search*, DFS) alle verbleibenden leeren Zellen. Für jede Zelle werden die Ziffern 1 bis 9 in randomisierter Reihenfolge auf Gültigkeit geprüft. Listing 2 zeigt die rekursive Lösungsfunktion:

```javascript
static solve(b) {
  for (let i = 0; i < 81; i++) {
    if (b[i] === 0) {
      const r = Math.floor(i / 9);
      const c = i % 9;
      const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
      for (const num of nums) {
        if (this.isValid(b, r, c, num)) {
          b[i] = num;
          if (this.solve(b)) return true;
          b[i] = 0; // Backtracking: Sackgasse erkannt
        }
      }
      return false;
    }
  }
  return true;
}
```
*Listing 2: Rekursiver Backtracking-Solver in JavaScript.*

Wissenschaftliche Vergleichsstudien von Secrieru et al. belegen, dass DFS-Backtracking für Standard-9×9-Gitter eine exzellente Ausführungsgeschwindigkeit aufweist und spezialisierten SAT- oder Dancing-Links-Verfahren bezüglich des Implementierungsaufwands überlegen ist.⁹ Nach erfolgreichem Durchlauf liegt ein vollständiges, mathematisch gültiges Sudoku vor.

**Schritt 3 – Ziffernreduktion mit Clue-Balancing:**  
Aus dem gelösten Gitter werden systematisch Zahlen entfernt, bis die Zielvorgabe an Startzahlen (*Clues*) erreicht ist. Frühe Entwicklungsversionen entfernten Zellen rein stochastisch, was regelmäßig zu Puzzles mit komplett leeren 3×3-Blöcken führte. Zur Lösung dieses Problems wurde ein **Histogramm-basiertes Constraint-Verfahren** implementiert (Listing 3):

```javascript
const rowCounts = Array(9).fill(9);
const colCounts = Array(9).fill(9);
const boxCounts = Array(9).fill(9);
const minPerUnit = clues >= 38 ? 3 : 2;

for (const idx of indices) {
  if (toRemove <= 0) break;
  const r = Math.floor(idx / 9);
  const c = idx % 9;
  const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);

  if (rowCounts[r] > minPerUnit && colCounts[c] > minPerUnit && boxCounts[b] > minPerUnit) {
    puzzle[idx] = 0;
    rowCounts[r]--;
    colCounts[c]--;
    boxCounts[b]--;
    toRemove--;
  }
}
```
*Listing 3: Histogramm-gestütztes Clue-Balancing zur Vermeidung leerer Regionen.*

Durch die Bedingung wird mathematisch garantiert, dass in jeder Zeile, Spalte und Box mindestens zwei bis drei Startzahlen erhalten bleiben, was zu fairen und ansprechenden Rätseln führt.¹⁰

### 5.3 Mehrspieler- und Board-Swap-Synchronisation in Echtzeit

Die Mehrspieler-Synchronisation stützt sich auf Supabase Realtime Channels. Listing 4 zeigt den Aufbau des Kommunikationskanals und das Abonnieren von Ereignissen:

```javascript
state.channel = state.supabase.channel(`room:${state.roomCode}`, {
  config: { broadcast: { self: false } }
});

state.channel
  .on('presence', { event: 'sync' }, handlePresenceSync)
  .on('broadcast', { event: 'START_COUNTDOWN' }, handleStartCountdown)
  .on('broadcast', { event: 'PROGRESS' }, handleIncomingProgress)
  .on('broadcast', { event: 'DO_SWAP_EXCHANGE' }, handleDoSwapExchange)
  .on('broadcast', { event: 'SWAP_EXCHANGE_REPLY' }, handleSwapExchangeReply)
  .on('broadcast', { event: 'GAME_OVER' }, handleGameOver);

state.channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await state.channel.track({ user: state.user?.id, username: state.profile.username });
  }
});
```
*Listing 4: Registrierung des Realtime-WebSocket-Kanals.*

**Host-gesteuerter 10-Sekunden-Swap-Mechanismus:**  
Um Desynchronisationen durch Latenzen oder abweichende lokale Systemuhren auszuschließen, fungiert der Raum-Host als alleinige Zeitquelle. Der Host führt einen 10-Sekunden-Intervall-Timer aus und übermittelt jede Sekunde das Event `SWAP_TICK` an den Partner. Nach Ablauf von 10 Sekunden initiiert der Host den Tausch:
1. Der Host sendet das Event `DO_SWAP_EXCHANGE` inklusive seines aktuellen Spielfelds, der Notizen und des Board-Status.
2. Der beigetretene Partner empfängt die Daten, aktualisiert sein Spielfeld und antwortet postwendend mit `SWAP_EXCHANGE_REPLY` unter Mitsendung seiner bisherigen Spieldaten.
3. Beide Clients wechseln synchron die Farbmarkierung (Board A $\leftrightarrow$ Board B) und triggern für 320 ms die visuelle CSS-Schrumpfanimation `.swapping`.

**Duale Siegbedingung im Co-Op Modus:**  
Im kooperativen Modus genügt es nicht, wenn ein einzelnes Board gelöst wird. Das System führt ein globales Statusobjekt `state.swapBoardSolved = { A: false, B: false }`. Löst ein Spieler beispielsweise Board A, wird dieses arretiert und der Spieler wird auf Board B weitergeleitet. Erst wenn beide Teilboards verifiziert sind (`swapBoardSolved.A && swapBoardSolved.B`), wird das Sieges-Event `SWAP_TEAM_WON` gefeuert.

### 5.4 Autonome Bot-Engine und prozedurale Web Audio Synthese

**Autonome Bot-Engine:**  
Für den Einzelspieler-Versus oder Offline-Partien simuliert eine regelbasierte Bot-Engine einen Kontrahenten. Der Bot operiert auf einem isolierten Spielfeld `state.botBoard`. In Abhängigkeit der gewählten Schwierigkeitsstufe triggert ein Intervall-Timer den nächsten Bot-Zug:
- Leicht: 3.800 ms Bedenkzeit
- Mittel: 2.400 ms Bedenkzeit
- Schwer: 1.400 ms Bedenkzeit

Bei jedem Taktschritt filtert die Methode `botStep()` alle aktuell leeren oder inkorrekten Positionen des Bot-Gitters und setzt den korrekten mathematischen Wert aus `state.botSolution`. Anschließend wird der Fortschrittsbalken aktualisiert.

**Prozeduraler Lofi-Synthesizer:**  
Zur akustischen Untermalung generiert die Web Audio API eine entspannende 4-Akkord-Jazz-Progression ($F^{\text{maj7}} \rightarrow E^{\text{m7}} \rightarrow D^{\text{m7}} \rightarrow C^{\text{maj7}}$). Die Klangerzeugung kombiniert Sinus- und Dreiecksoszillatoren, welche mit einem subtilen Frequenz-Detuning ($\pm 0{,}4\text{ Hz}$) versehen werden, um den charakteristischen Schwebungsklang eines analogen Bandgeräts zu emulieren. Ein `BiquadFilterNode` dämpft Frequenzen oberhalb von 420 Hz (Tiefpass), während `GainNode`-Hüllkurven ein sanftes Ein- und Ausblenden über 4,7 Sekunden steuern.

---

## 6 Projektauswertung und Reflexion

Dieses Kapitel analysiert den tatsächlichen Projekterfolg anhand eines quantitativen Soll-Ist-Vergleichs, dokumentiert gelöste Hürden und präsentiert Messdaten.

### 6.1 Soll-Ist-Vergleich und Aufwandsanalyse

Das geplante Budget von 140 Personenstunden wurde strukturiert auf die Entwicklungs- und Dokumentationsphasen aufgeteilt. Tabelle 4 stellt die Planwerte den tatsächlichen Aufwänden gegenüber:

| Arbeitspaket | Geplanter Aufwand | Tatsächlicher Aufwand | Abweichung | Begründung der Abweichung |
| :--- | :--- | :--- | :--- | :--- |
| **AP 1: Konzeption & Entwurf** | 15 h | 12 h | $-3$ h | Zügige Abstimmung durch Anlehnung an bewährte Architekturmuster |
| **AP 2: MVP-Core-Engine** | 35 h | 38 h | $+3$ h | Höherer Aufwand bei der Kalibrierung des Clue-Balancings |
| **AP 3: Multiplayer & Audio** | 40 h | 46 h | $+6$ h | Komplexität bei der Host-gesteuerten Dual-Board-Swap-Logik |
| **AP 4: Testing & Feinschliff** | 15 h | 18 h | $+3$ h | Zusätzliche Zeit für DSGVO-Banner und Cross-Browser-Tests |
| **AP 5: Dokumentation** | 35 h | 32 h | $-3$ h | Effiziente Texterstellung durch kontinuierliche Logbuch-Führung |
| **Gesamt** | **140 h** | **146 h** | **$+6$ h** | **Geringe Gesamtabweichung von lediglich 4,3 %** |

*Tabelle 4: Soll-Ist-Vergleich des zeitlichen Arbeitsaufwands.*

Hinsichtlich des fachlichen Leistungsumfangs wurden alle Must-Have- und Should-Have-Anforderungen vollständig realisiert. Darüber hinaus konnten auch die optionalen Could-Have-Ziele (Cloud-Authentifizierung mit Supabase Auth, persistente Bestzeiten und DSGVO-Konformität) vollständig in das Produkt integriert werden.

### 6.2 Technische Herausforderungen und Problemlösungen

Im Entwicklungsverlauf traten spezifische Probleme auf, deren Behebung wertvolle Erkenntnisse lieferte:

1. **Desynchronisation bei unabhängigen Client-Timern:** Ursprünglich führten beide Clients einen autarken 10-Sekunden-Countdown. Geringe Latenzen beim Spielstart führten dazu, dass Client A bereits tauschte und sein Feld sendete, während Client B noch im alten Zyklus verharrte und das empfangene Feld kurz darauf wieder zurücküberschrieb. Die Lösung bestand in der Umstellung auf eine strikte Host-Autorität: Nur der Host führt den Takt und sendet `SWAP_TICK` sowie `DO_SWAP_EXCHANGE`.
2. **Vorzeitige Siegmeldung im Co-Op Modus:** In frühen Testläufen endete ein Co-Op-Spiel siegreich, sobald der erste Spieler sein Gitter gelöst hatte, obwohl das Partner-Gitter noch unvollständig war. Durch die Einführung des dualen Zustandsautomaten `state.swapBoardSolved` wird nun garantiert, dass beide Boards gelöst sein müssen.
3. **Optischer Pixelversatz durch Inset-Box-Shadows:** Das Markieren selektierter Zellen über `box-shadow: inset 0 0 0 2px` überlagerte die stabilen Außenränder der 3×3-Blöcke asymmetrisch. Das Problem wurde behoben, indem die Selektion rein über flächige Hintergrundfarben und dezente Akzentlinien abgebildet wird.
4. **Fehlervalidierungs-Exploit:** Zuvor zog das System nur bei Falscheingaben in leere Zellen Leben ab. Wurde eine bereits falsch belegte Zelle erneut mit einer falschen Zahl überschrieben, blieb dies sanktionslos. Die Validierung wurde so vereinheitlicht, dass jeder abweichende Eintrag ausnahmslos zum Lebensabzug führt.

### 6.3 Performance-, Latenz- und Barrierefreiheits-Evaluation

Zur Überprüfung der nicht-funktionalen Anforderungen wurden empirische Messungen durchgeführt:

**Google Lighthouse Audit:**  
Ein automatisierter Audit über die Google Chrome Developer Tools ergab auf Desktop- wie Mobilgeräten Bestnoten:
- **Performance:** 99 / 100 Punkte (First Contentful Paint: 110 ms; Total Blocking Time: 0 ms)
- **Barrierefreiheit (Accessibility):** 100 / 100 Punkte (Dank semantischer Buttons, ARIA-Labels und kontrastreicher Farbwerte nach WCAG 2.2)
- **Best Practices:** 100 / 100 Punkte
- **SEO:** 100 / 100 Punkte

**Algorithmische Performanz der Sudoku-Engine:**  
In einer Testreihe von 1.000 sukzessiven Rätselgenerierungen im Browser (`SudokuEngine.generate(34)`) betrug die durchschnittliche Rechenzeit $\mu = 8{,}4\text{ ms}$ ($\sigma = 2{,}1\text{ ms}$). Der Maximalwert lag bei $14{,}2\text{ ms}$. Die Generierung blockiert somit den Haupt-Thread zu keinem Zeitpunkt merklich.

**Netzwerk-Latenz:**  
Messungen der Round-Trip-Time (RTT) von WebSocket-Broadcasts über Supabase Realtime zwischen zwei Geräten (WLAN zu LTE) ergaben mittlere Übertragungszeiten von $42\text{ ms}$, was für ein runden- bzw. intervallbasiertes Denkspiel eine völlig verzögerungsfreie Interaktion darstellt.

---

## 7 Fazit und Ausblick

Das abschließende Kapitel fasst die wesentlichen Projektergebnisse zusammen und formuliert weiterführende Forschungspotenziale.

### 7.1 Zusammenfassung der Projektergebnisse

Mit SwapDoku wurde erfolgreich der Nachweis erbracht, dass sich traditionelle Denksport-Klassiker durch den gezielten Einsatz moderner Web-Technologien in innovative, kollaborative Mehrspieler-Erlebnisse transformieren lassen. Das zentrale Alleinstellungsmerkmal – der kooperative Board-Swap im 10-Sekunden-Takt – erzeugt eine dynamische Team-Interaktion, die im Bereich browserbasierter Sudokus ein Novum darstellt.

Aus softwarearchitektonischer Sicht demonstriert das Projekt die Vorzüge des Zero-Build-Paradigmas: Der Verzicht auf schwergewichtige Frontend-Frameworks zugunsten von nativem HTML5, modernem CSS und JavaScript garantiert herausragende Ladezeiten, uneingeschränkte Plattformunabhängigkeit und null externe Build-Abhängigkeiten. Die Anbindung an Supabase Realtime belegt zudem, dass serverlose Architekturen eine zuverlässige, skalierbare Echtzeitsynchronisation ohne laufende Infrastrukturkosten ermöglichen.

### 7.2 Kritische Würdigung und zukünftige Entwicklungspotenziale

Trotz des voll funktionsfähigen Projektstands lassen sich Ansatzpunkte für zukünftige Iterationen identifizieren:
1. **Mathematische Eindeutigkeitsprüfung (Uniqueness):** Die aktuelle Sudoku-Engine garantiert mathematische Gültigkeit und faire Clue-Verteilungen, prüft jedoch nicht formal, ob ein Puzzle exakt eine einzige Lösung besitzt. Wie Ates und Cavdur aufzeigen, erfordert die exakte Eindeutigkeitsprüfung iterative Backtracking-Solver-Durchläufe, um alternative Belegungen auszuschließen.¹¹ Eine Implementierung dieses Schritts würde verhindern, dass logisch gültige alternative Zahlenkombinationen irrtümlich als Fehler gewertet werden.
2. **Modularisierung via ES-Modules:** Gegenwärtig ist die Client-Logik in einer zentralen `app.js`-Datei organisiert. Eine Modularisierung nach dem ES-Module-Standard (`import`/`export`) würde die Wartbarkeit und Testbarkeit weiter steigern.
3. **WebRTC DataChannels:** Für zukünftige Versionen könnte die WebSocket-Kommunikation um direkte Peer-to-Peer-Verbindungen via WebRTC ergänzt werden, um Server-Latenzen auf das physikalische Minimum zu reduzieren.
4. **Erweiterung auf dreidimensionale Gitter:** Als konzeptionelle Weiterentwicklung könnte das kooperative Swap-Prinzip auf höherdimensionale 3D-Sudoku-Würfel übertragen werden, wie sie in aktuellen Forschungsarbeiten von Jana et al. untersucht werden.¹²

---

## Literaturverzeichnis

- **Ates, T. / Cavdur, F. (2025):** *Sudoku puzzle generation using mathematical programming and heuristics: Puzzle construction and game development*, in: Expert Systems with Applications, Jg. 282, Artikel 127710, S. 1–10, DOI: 10.1016/j.eswa.2025.127710.
- **Delahaye, J.-P. (2006):** *The Science Behind Sudoku*, in: Scientific American, Jg. 294, Nr. 6, S. 80–87.
- **Fette, I. / Melnikov, A. (2011):** *RFC 6455 – The WebSocket Protocol*, Internet Engineering Task Force (IETF), Online im Internet: https://datatracker.ietf.org/doc/html/rfc6455 [Abrufdatum: 29.10.2026].
- **Garns, H. (1979):** *Number Place*, in: Dell Pencil Puzzles and Word Games, Ausgabe 16, New York: Dell Publishing.
- **ISO/IEC (2023):** *ISO/IEC 25010:2023 – Systems and software engineering – Systems and software Quality Requirements and Evaluation (SQuaRE) – Product quality model*, Genf: International Organization for Standardization.
- **Jana, S. / Mallik, M. / Khan, A. / Maji, A. K. / Pal, R. K. (2023):** *Design and Analysis of a Modified 3D Sudoku Solver*, in: IEEE Access, Jg. 11, S. 27352–27368, DOI: 10.1109/ACCESS.2023.3256420.
- **Nielsen, J. (1993):** *Usability Engineering*, Boston: Academic Press.
- **Nielsen, J. / Budiu, R. (2013):** *Mobile Usability für iPhone, iPad, Android & Co.*, Heidelberg: mitp Verlag.
- **Schwaber, K. / Sutherland, J. (2020):** *The Scrum Guide – Der gültige Leitfaden für Scrum: Die Spielregeln*, Online im Internet: https://scrumguides.org [Abrufdatum: 29.10.2026].
- **Secrieru, Ș. / Lazăr, C. I. / Goina, R. A. (2025):** *From Brute Force to Logic: Analyzing Diverse Approaches for Solving Sudoku Puzzles*, in: Proceedings of the 27th International Symposium on Symbolic and Numeric Algorithms for Scientific Computing (SYNASC), IEEE, S. 73–78, DOI: 10.1109/SYNASC69064.2025.00019.
- **Sommerville, I. (2018):** *Software Engineering*, 10. Aufl., Hallbergmoos: Pearson Studium.
- **W3C (2021):** *Web Audio API – W3C Recommendation*, World Wide Web Consortium, Online im Internet: https://www.w3.org/TR/webaudio/ [Abrufdatum: 29.10.2026].
- **W3C (2023):** *Web Content Accessibility Guidelines (WCAG) 2.2 – W3C Recommendation*, World Wide Web Consortium, Online im Internet: https://www.w3.org/TR/WCAG22/ [Abrufdatum: 29.10.2026].

---

### Fußnoten (Kurzbelege nach FOM-Chicago-Style)

¹ Vgl. *Delahaye, J.-P.*, Sudoku, 2006, S. 80–87; *Garns, H.*, Number Place, 1979, S. 16.  
² Vgl. *Nielsen, J., Budiu, R.*, Mobile Usability, 2013, S. 42–48.  
³ Vgl. *Sommerville, I.*, Software Engineering, 2018, S. 85–112.  
⁴ Vgl. *ISO/IEC*, 25010, 2023, S. 12–28.  
⁵ Vgl. *Nielsen, J.*, Usability Engineering, 1993, S. 135.  
⁶ Vgl. *Fette, I., Melnikov, A.*, RFC 6455, 2011, S. 1–10.  
⁷ Vgl. *W3C*, Web Audio API, 2021, o. S.  
⁸ Vgl. *Schwaber, K., Sutherland, J.*, Scrum Guide, 2020, S. 3–12.  
⁹ Vgl. *Secrieru, Ș. et al.*, Approaches, 2025, S. 73–76.  
¹⁰ Vgl. *Ates, T., Cavdur, F.*, Puzzle generation, 2025, S. 1–4.  
¹¹ Vgl. *Ates, T., Cavdur, F.*, Puzzle generation, 2025, S. 4–6.  
¹² Vgl. *Jana, S. et al.*, 3D Sudoku Solver, 2023, S. 27352–27355.
