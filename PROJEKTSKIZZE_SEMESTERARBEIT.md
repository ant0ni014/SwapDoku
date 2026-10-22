# Projektskizze zur Semesterarbeit: SwapDoku

**Thema:** SwapDoku — Entwicklung eines modernen, werbefreien Web-Sudokus mit kooperativem Echtzeit-Board-Swap  
**Modul:** Web Technologie  
**Studiengang:** Wirtschaftsinformatik (FOM Hochschule München)  
**Autor:** Antonio Famog  
**Projekt-URL & Code:** [https://github.com/ant0ni014/SwapDoku](https://github.com/ant0ni014/SwapDoku)  

---

## 1. Einleitung & Projektidee (Warum SwapDoku?)

Fast jeder kennt Sudoku und hat es schon einmal auf dem Smartphone oder im Browser gespielt. Wenn man heute online nach Sudoku sucht, stößt man jedoch fast immer auf dieselben Probleme:
- Webseiten sind voll mit Bannern, blinkender Werbung und Popups, die den Spielfluss stören.
- Man wird ständig gedrängt, eine App aus dem App Store herunterzuladen.
- Es gibt fast ausschließlich Einzelspieler-Modi. Wenn es mal einen Multiplayer gibt, spielt man lediglich auf Zeit gegeneinander – jeder stur auf seinem eigenen Feld.

**Hier setzt SwapDoku an:**  
SwapDoku ist ein modernes, sauberes Web-Spiel, das direkt im Browser ohne Download und ohne Werbung läuft. Das absolute Alleinstellungsmerkmal (unser **Unique Selling Point**) ist der **Co-Op Swap Modus**:  
Zwei Freunde spielen nicht gegeneinander, sondern *miteinander als Team*. Beide starten gleichzeitig auf zwei unterschiedlichen Sudoku-Feldern. Alle 10 Sekunden ertönt ein Signal und die Spielfelder tauschen in Echtzeit die Seiten! Man muss blitzschnell erfassen, was der Partner vorbereitet oder eingetragen hat, und das fremde Rätsel weiterlösen. 

*(Recherche-Hinweis: Klassische Koop-Sudokus im Netz lassen Spieler meist nur auf demselben Feld tippen. Ein aktiver, zeitgesteuerter Board-Tausch zwischen zwei Spielern existiert so auf dem Markt bisher nicht!)*

---

## 2. Angestrebtes Ergebnis

Das finale Ergebnis der Arbeit besteht aus zwei Teilen:
1. **Das fertige Web-Spiel (Software):** Eine funktionierende Web-App, die sowohl am Laptop/PC als auch auf dem Smartphone flüssig im Browser läuft – mit Einzelspieler, Versus-Modus (auch gegen Computer-Gegner/Bot) und dem innovativen Co-Op Swap.
2. **Die schriftliche Seminararbeit (ca. 4.000 Wörter):** Eine verständliche Dokumentation, die zeigt, wie das Spiel geplant, programmiert und getestet wurde (inkl. Gliederung angelehnt an das erfolgreiche FOM-Projekt *Balkan Snake*).

---

## 3. Ziele und Nutzen (einfach nach SMART erklärt)

Das **SMART-Prinzip** hilft dabei, Ziele so zu formulieren, dass sie nicht schwammig sind, sondern klar überprüft werden können:

- **S (Spezifisch – Was genau wird gemacht?):**  
  Entwicklung eines vollwertigen, werbefreien Sudokus im Web, das um einen Echtzeit-Multiplayer mit automatischem Spielfeld-Tausch erweitert wird.
- **M (Messbar – Woran sieht man, ob es geklappt hat?):**  
  Das Spiel lädt sofort (in unter einer Sekunde), reagiert verzögerungsfrei auf Eingaben, und der Spielfeld-Tausch zwischen zwei Geräten funktioniert stabil über einen Raum-Code.
- **A (Attraktiv – Welchen Mehrwert bringt es?):**  
  Spieler können ohne Registrierung und ohne App-Installation einfach einen 4-stelligen Raum-Code an Freunde schicken und direkt zusammen losrätseln – ohne störende Werbung.
- **R (Realistisch – Ist das alleine im Semester machbar?):**  
  Ja. Statt schwere, unübersichtliche Frameworks zu nutzen, baut SwapDoku auf den Standard-Webtechnologien (HTML, CSS, JavaScript) auf. Für die Vernetzung wird ein fertiger Dienst (Supabase) genutzt, sodass kein eigener Server aufgesetzt oder gewartet werden muss.
- **T (Terminiert – Bis wann?):**  
  - 06.11.2026: Einstellen der Projektskizze im Forum
  - Ende November: Grundlegendes Sudoku spielbar (MVP)
  - Ende Dezember: Multiplayer, Board-Swap und Design fertig
  - Januar 2027: Abgabe der schriftlichen Seminararbeit

---

## 4. Scope: Was gehört dazu und was nicht?

- **Im Projekt enthalten (In-Scope):**
  - Klassisches 9×9 Sudoku mit automatischer Rätsel-Erstellung und Lösungsprüfung (3 Schwierigkeitsgrade).
  - Notiz-Funktion (Bleistift-Zahlen in den Ecken), Fehlerprüfung und Stoppuhr.
  - Der Co-Op Swap Modus (Zwei Spieler, Board-Tausch alle 10 Sekunden).
  - Versus-Modus (Wettrennen gegen Freunde oder gegen einen Computer-Bot).
  - Verschiedene Farb-Designs (Themes wie Dark Mode, Grün, Blau etc.) und entspannte Lofi-Hintergrundmusik.
  - Responsive Anpassung (gut bedienbar am Desktop mit Tastatur und am Handy per Touch).
- **Nicht im Projekt enthalten (Out-of-Scope):**
  - Keine native App für den Apple App Store oder Google Play Store (das Spiel soll eine reine Web-Anwendung bleiben).
  - Keine Bezahlfunktionen, Abos oder In-Game-Käufe (alles bleibt 100 % kostenlos).

---

## 5. Strukturierung der Arbeitspakete (Stufenplan)

Die Entwicklung ist in drei aufeinander aufbauende Stufen unterteilt. Das sorgt dafür, dass am Ende garantiert ein funktionierendes Spiel bereitsteht:

### Stufe 1: Minimaler Umfang (MVP – Die solide Basis)
*Ziel: Ein vollwertiges, funktionierendes Sudoku für eine Person.*
- **AP 1.1 Spielfeld & Oberfläche:** Aufbau des 9×9 Gitters mit sauberem HTML5 und modernem CSS.
- **AP 1.2 Sudoku-Logik:** Programmierung des Algorithmus, der gültige Rätsel erzeugt und Eingaben auf Richtigkeit prüft.
- **AP 1.3 Spielablauf:** Zifferneingabe, Notizen an/aus, Fehlerzähler (3 Leben), Timer und lokale Bestzeit.

### Stufe 2: Erweiterter Umfang (Das Besondere an SwapDoku)
*Ziel: Die Multiplayer-Modi und ein schönes Spielerlebnis.*
- **AP 2.1 Co-Op Swap Modus:** Entwicklung der Tausch-Mechanik, bei der zwei Spieler alle 10 Sekunden automatisch die Boards tauschen.
- **AP 2.2 Versus-Modus & Computer-Bot:** Live-Fortschrittsbalken gegen Mitspieler oder gegen einen virtuellen Bot.
- **AP 2.3 Design, Themes & Sound:** 6 verschiedene Farbwelten (inkl. Dark Mode) und entspannter Lofi-Sound.
- **AP 2.4 Handy-Optimierung:** Anpassung des Layouts für kleine Bildschirme.

### Stufe 3: Optionale Erweiterungen (Das i-Tüpfelchen)
*Ziel: Zusatzfeatures für Langzeitmotivation.*
- **AP 3.1 Benutzer-Accounts:** Optionaler Login/Registrierung für Spieler, die ihr Profil speichern wollen.
- **AP 3.2 Globale Rangliste:** Online-Bestenliste sortiert nach Schwierigkeitsgrad und Bestzeiten.

> **Begründung bei Planänderungen (Fallback-Strategie):**  
> Sollte es wider Erwarten zu zeitlichen Engpässen oder Verbindungsproblemen beim Online-Multiplayer kommen, bleibt das Spiel durch Stufe 1 (Einzelspieler) und den lokalen Computer-Bot jederzeit uneingeschränkt spielbar. In der Seminararbeit wird genau reflektiert, wie solche Hürden gelöst oder strukturiert abgefangen wurden.

---

## 6. Zeit- und Aufwandsplanung

Für das gesamte Projekt (Entwicklung + Ausarbeitung der Seminararbeit) sind ca. **140 Arbeitsstunden** eingeplant:

| Phase | Zeitraum | Aufgaben | Aufwand |
| :--- | :--- | :--- | :--- |
| **Phase 1: Konzeption** | Bis 06.11.2026 | Spielkonzept, Architektur, Projektskizze fürs Forum | ca. 15 h |
| **Phase 2: Basis-Spiel (Stufe 1)** | Bis 25.11.2026 | Spielfeld, Rätsel-Generator, Notizen, Timer (MVP) | ca. 35 h |
| **Phase 3: Swap-Multiplayer (Stufe 2)** | Bis 20.12.2026 | Co-Op Swap, Versus-Modus, Bot-Gegner, Themes & Sound | ca. 40 h |
| **Phase 4: Tests & Verfeinerung** | Bis 05.01.2027 | Testen auf Handy/PC, Fehlerbehebung, Feedback einarbeiten | ca. 15 h |
| **Phase 5: Schriftliche Arbeit** | Bis 25.01.2027 | Verfassen der Seminararbeit (ca. 4.000 Wörter), Korrektur | ca. 35 h |
| **Gesamt:** | | | **ca. 140 h** |

---

## 7. Risiken und wie wir damit umgehen

1. **Risiko: Was passiert, wenn die Internetverbindung während des Spiels kurz abbricht?**  
   *Lösung:* Der Spielstand wird im Browser zwischengespeichert. Bei einem kurzen Verbindungsverlust wird automatisch neu verbunden, ohne dass der Fortschritt verloren geht.
2. **Risiko: Ein Spieler tauscht das Board eine Sekunde später als der andere (Verzögerung).**  
   *Lösung:* Die beiden Browser gleichen ihre Uhren beim Spielstart kurz ab, sodass der 10-Sekunden-Countdown auf beiden Bildschirmen synchron läuft.
3. **Risiko: Das Erstellen des Sudokus dauert zu lange und das Spiel hakt.**  
   *Lösung:* Es wird ein schneller, optimierter Berechnungs-Algorithmus genutzt, der das Spielfeld in wenigen Millisekunden berechnet.

---

## 8. Gliederungsvorschlag für die Seminararbeit

*(Aufbau orientiert sich an der erfolgreichen Seminararbeit „Balkan Snake“ von Haris & Marko an der FOM Hochschule)*

1. **Einleitung**
   - 1.1 Aufgabenstellung
   - 1.2 Motivation (Warum Sudoku neu gedacht werden muss)
   - 1.3 Zielsetzung (SMART)
   - 1.4 Aufbau der Arbeit
2. **Anforderungsanalyse & Konzeption**
   - 2.1 Funktionale Anforderungen
     - 2.1.1 Minimaler Umfang (MVP – Klassisches Sudoku)
     - 2.1.2 Erweiterter Umfang (Co-Op Swap, Versus & Bot)
     - 2.1.3 Optionale Erweiterungen (Accounts & Rangliste)
   - 2.2 Nicht-funktionale Anforderungen (Usability, Werbefreiheit, Performance)
   - 2.3 Technologie & Systemarchitektur (HTML5, CSS, JS, Supabase)
3. **Projektmethodik & Vorgehensweise**
   - 3.1 Agiles Vorgehensmodell (Arbeiten in Sprints)
   - 3.2 Qualitätssicherung & Testen
   - 3.3 Risikomanagement
4. **Implementierung**
   - 4.1 Frontend-Architektur (Dateiorganisation, Single-Page-Application)
   - 4.2 Spiellogik (Spielfeld-Generator, Backtracking-Prüfung, Game-Loop)
   - 4.3 Design, Themes & Audio (Skandinavisches UI, CSS-Variablen, Web Audio)
   - 4.4 Echtzeit-Synchronisation (Raum-Code-Lobby, Board-Swap-Timing)
5. **Projektauswertung**
   - 5.1 Geplanter vs. tatsächlicher Aufwand (Soll-Ist-Vergleich)
   - 5.2 Scope-Analyse (Was wurde umgesetzt, was angepasst?)
   - 5.3 Reflexion & Lerneffekte
6. **Fazit & Ausblick**
   - 6.1 Zusammenfassung der Ergebnisse
   - 6.2 Ausblick auf zukünftige Erweiterungen
