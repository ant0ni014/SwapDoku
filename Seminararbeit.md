# SwapDoku – Arbeitsgrundlage für die Seminararbeit

> [!IMPORTANT]
> **Das ist eine Arbeitsgrundlage, keine Abgabeversion.** Der Text zeigt dir Struktur, Tonfall und Umfang (Ziel: ca. 4.000 Wörter). Formuliere alles in deinen eigenen Worten neu und ergänze deine eigenen Erfahrungen.
> - `[TODO: …]` = Hier fehlen **deine** Daten (Stunden, Messwerte, Screenshots). **Nichts davon ist erfunden. Trag nur ein, was du wirklich gemessen hast.**
> - `[PRÜFEN]` = Quelle vor dem Zitieren selbst in der FOM-Bibliothek oder bei Google Scholar prüfen (Jahr, Seiten, Titel).
> - `💡 Schreibhinweis` = Erklärung, was der Gutachter an der Stelle erwartet.
> - Prüf im FOM-Leitfaden, ob du eine Angabe zur **KI-Nutzung** machen musst.

---

## 1 Einleitung

Das Zahlenrätsel Sudoku gehört zu den bekanntesten Logikrätseln der Welt. Seine mathematischen Wurzeln reichen bis zu den Lateinischen Quadraten Leonhard Eulers im 18. Jahrhundert zurück. In seiner heutigen 9×9-Form erschien es erstmals 1979 unter dem Namen *Number Place* und wurde über Japan weltweit bekannt.¹ Die vorliegende Seminararbeit dokumentiert die Konzeption und Umsetzung einer modernen Web-Anwendung dieses Klassikers unter dem Projektnamen **SwapDoku**.

Projekt: https://swapdoku.vercel.app · Quellcode: https://github.com/ant0ni014/SwapDoku

> 💡 **Schreibhinweis:** Laut FOM-Leitfaden gehören zwischen Haupt- und erstes Unterkapitel 2–4 einleitende Sätze. Das gilt für **jedes** Kapitel unten.

### 1.1 Aufgabenstellung

Die Prüfungsleistung im Modul „Web Technologie“ umfasst die eigenständige Konzeption und Entwicklung einer interaktiven Webanwendung sowie deren Dokumentation in Form einer Seminararbeit. Gefordert ist ein lauffähiges Software-Artefakt, das auf etablierten Web-Standards basiert und dessen Entstehung methodisch nachvollziehbar dargestellt wird.

Für SwapDoku bedeutet das die Entwicklung eines browserbasierten 9×9-Sudokus mit automatischer Rätselerzeugung, das neben einem Einzelspielermodus zwei Mehrspielermodi anbietet. Die Anwendung muss ohne Installation im Browser laufen und sowohl am Desktop per Tastatur als auch auf Smartphones per Touch bedienbar sein.

`[TODO: Exakten Wortlaut der Aufgabenstellung aus dem Modul / Online-Campus übernehmen und ggf. ergänzen.]`

### 1.2 Motivation

Wer im Internet nach einem Sudoku sucht, stößt häufig auf Seiten, die das Spielfeld mit Werbebannern, Pop-ups und Hinweisen zum App-Download umgeben. Gerade bei einem Konzentrationsspiel stören solche Elemente den Spielfluss erheblich. Zudem bieten die meisten Angebote ausschließlich einen Einzelspielermodus. Wenn Mehrspieler-Funktionen existieren, beschränken sie sich in der Regel auf ein Wettrennen, bei dem jede Person isoliert ihr eigenes Feld löst.

SwapDoku soll zeigen, dass ein Sudoku ruhig, werbefrei und trotzdem gemeinschaftlich sein kann. Neben dem klassischen Einzelspiel bietet die Anwendung einen Versus-Modus gegen eine andere Person oder einen Computergegner sowie den kooperativen Co-Op-Swap-Modus, bei dem zwei Personen als Team spielen.

`[TODO: Persönliche Motivation in 2–3 Sätzen ergänzen – z. B. warum gerade Sudoku, eigene Erfahrung mit werbeüberladenen Seiten, Spielen mit Freunden.]`

> 💡 **Schreibhinweis:** Die Aussage „viele Seiten zeigen Werbung“ ist eine Marktbeobachtung. Du kannst sie absichern, indem du 2–3 bekannte Sudoku-Seiten mit Abrufdatum als Internetquelle angibst oder einen Screenshot im Anhang einfügst. Ohne Beleg lieber vorsichtig formulieren („häufig“, „in vielen Fällen“).

### 1.3 Zielsetzung

Die Projektziele wurden nach dem SMART-Prinzip formuliert, um sie am Ende überprüfen zu können.

**Spezifisch:** Entwickelt wird ein werbefreies 9×9-Web-Sudoku mit drei Spielmodi (Einzelspieler, Versus, Co-Op Swap) und drei Schwierigkeitsgraden. **Messbar:** Die Zielerreichung wird an drei Kriterien geprüft: Das Spiel ist ohne Registrierung sofort spielbar, die Rätselerzeugung läuft ohne spürbare Wartezeit im Browser, und der Spielfeldtausch zwischen zwei Geräten funktioniert stabil über einen Raum-Code. **Attraktiv:** Nutzende können ohne Installation einen vierstelligen Raum-Code an Freunde schicken und direkt gemeinsam spielen. **Realistisch:** Durch den Verzicht auf Frontend-Frameworks und den Einsatz eines Backend-as-a-Service-Dienstes (Supabase) ist das Projekt im Rahmen eines Semesters von einer Person umsetzbar. **Terminiert:** `[TODO: Deine tatsächlichen Meilensteine eintragen, z. B. Projektskizze 06.11.2026, MVP Ende November, Mehrspieler Ende Dezember, Abgabe Januar 2027.]`

> 💡 **Schreibhinweis:** „Messbar“ ist der Punkt, den Gutachter am kritischsten lesen. Nimm nur Kriterien auf, die du in Kapitel 6 auch wirklich prüfst. Wenn du dort z. B. einen Lighthouse-Test machst, kannst du hier einen Zielwert nennen.

### 1.4 Aufbau der Arbeit

Die Arbeit folgt dem Ablauf eines Softwareprojekts von der Anforderung bis zur Auswertung. Kapitel 2 beschreibt die funktionalen und nicht-funktionalen Anforderungen sowie das Gestaltungskonzept der Benutzeroberfläche. Kapitel 3 begründet die Wahl der eingesetzten Technologien und stellt die Systemarchitektur vor. Kapitel 4 erläutert das agile Vorgehen und das Risikomanagement. Kapitel 5 bildet den Schwerpunkt und beschreibt die Implementierung von Oberfläche, Spiellogik, Mehrspieler-Synchronisation sowie Bot und Audio. Kapitel 6 wertet das Projekt anhand eines Soll-Ist-Vergleichs aus und reflektiert aufgetretene Probleme. Kapitel 7 fasst die Ergebnisse zusammen und gibt einen Ausblick.

---

## 2 Anforderungsanalyse und Konzeption

Bevor mit der Programmierung begonnen wurde, wurden die Anforderungen an SwapDoku festgelegt. Dieses Kapitel unterscheidet zwischen funktionalen Anforderungen, die beschreiben, *was* das System leisten soll, und nicht-funktionalen Anforderungen, die festlegen, *wie gut* es das tun soll.² Abschließend wird das Gestaltungskonzept der Oberfläche vorgestellt.

### 2.1 Funktionale Anforderungen

Die funktionalen Anforderungen wurden in drei Stufen priorisiert. So war sichergestellt, dass auch bei Zeitproblemen ein vollständig spielbares Produkt entsteht.

#### 2.1.1 Grundversion (MVP)

Die Grundversion bildet ein vollständiges Sudoku für eine Person. Das System muss ein 9×9-Spielfeld darstellen und für jede Partie automatisch ein neues Rätsel erzeugen. Dafür stehen drei Schwierigkeitsgrade zur Verfügung, die sich in der Anzahl der vorgegebenen Zahlen unterscheiden (40, 34 und 28). Nutzende müssen Ziffern per Tastatur oder Ziffernblock eingeben, löschen und als Notizen in einer Zelle vermerken können. Falsche Eingaben werden erkannt und ziehen einen Versuch ab. Je nach Schwierigkeitsgrad stehen fünf, drei oder ein Versuch zur Verfügung. Eine Stoppuhr misst die Lösungszeit, die als persönliche Bestzeit gespeichert wird.

#### 2.1.2 Erweiterter Umfang

Die zweite Stufe umfasst die Mehrspielerfunktionen, die SwapDoku von anderen Angeboten unterscheiden. Im **Versus-Modus** lösen zwei Spielende zeitgleich dasselbe Rätsel. Ein Fortschrittsbalken zeigt live an, wie weit das Gegenüber ist. Steht keine zweite Person zur Verfügung, übernimmt ein Computergegner diese Rolle.

Im **Co-Op-Swap-Modus** beginnen beide Spielenden auf zwei unterschiedlichen Rätseln (Board A und Board B). Alle zehn Sekunden werden die Spielfelder getauscht, sodass jede Person am Rätsel der anderen weiterarbeitet. Beide Partien müssen gemeinsam gelöst werden. Für das Zusammenkommen erzeugt das System einen vierstelligen Raum-Code, den eine Person an die andere weitergibt.

Darüber hinaus gehören zur zweiten Stufe mehrere Farbthemen inklusive Dark Mode, eine optionale Hintergrundmusik sowie eine Umschaltung zwischen Deutsch und Englisch.

#### 2.1.3 Optionale Erweiterungen

Als optionale Erweiterungen wurden Benutzerkonten zur Speicherung von Profilen sowie eine Rangliste geplant, die nach Schwierigkeitsgrad und Lösungszeit sortiert ist.

`[TODO: Ehrlich festhalten, was davon umgesetzt ist. Laut Code läuft die Rangliste aktuell über localStorage, also nur lokal im Browser, nicht global. Accounts sind über Supabase Auth vorbereitet – prüfen, ob sie produktiv funktionieren.]`

> 💡 **Schreibhinweis:** Eine Tabelle macht das Kapitel übersichtlicher und spart Wörter: Spalten *ID | Anforderung | Stufe | Status*. Beispiel: *F-01 | Rätsel automatisch erzeugen | MVP | umgesetzt*. Die Status-Spalte brauchst du später für den Soll-Ist-Vergleich in Kapitel 6.

### 2.2 Nicht-funktionale Anforderungen

Die nicht-funktionalen Anforderungen orientieren sich an den Qualitätsmerkmalen der Norm ISO/IEC 25010.³

- **Benutzbarkeit:** Die Bedienung muss ohne Anleitung verständlich sein. Das Spiel muss vollständig mit der Tastatur (Pfeiltasten, Ziffern, Löschen) und auf Mobilgeräten per Touch bedienbar sein.
- **Leistung:** Die Anwendung soll schnell laden und auf Eingaben unmittelbar reagieren. Nielsen beschreibt eine Reaktionszeit von etwa 0,1 Sekunden als Grenze, unterhalb derer eine Reaktion als sofort wahrgenommen wird.⁴ Dieser Wert dient als Orientierung für Eingaben und für die Rätselerzeugung.
- **Werbefreiheit und Datensparsamkeit:** Die Anwendung enthält keine Werbung und kein Tracking. Eine Registrierung ist für keinen Spielmodus zwingend.
- **Plattformunabhängigkeit:** Das Spiel muss in aktuellen Browsern auf Desktop und Smartphone ohne Installation laufen.
- **Zuverlässigkeit:** Fällt die Internetverbindung aus oder ist der Server nicht erreichbar, muss der Einzelspielermodus weiterhin nutzbar bleiben.

### 2.3 User-Interface- und UX-Design-Konzept

Das Gestaltungskonzept folgt einem bewusst minimalistischen Ansatz. Da Sudoku hohe Konzentration erfordert, soll die Oberfläche möglichst wenige Reize setzen. Es wird auf Emojis und bunte Grafiken verzichtet. Stattdessen werden einfarbige Vektor-Icons verwendet, die sich der jeweiligen Farbgebung anpassen.

Auf dem Desktop ist die Oberfläche zweispaltig aufgebaut: Links befindet sich das Spielfeld, rechts die Modusauswahl, Statusanzeigen und der Ziffernblock. So passt das gesamte Spiel ohne Scrollen auf einen Laptop-Bildschirm. Auf dem Smartphone werden die Bereiche untereinander angeordnet.

Für die Orientierung auf dem Spielfeld werden beim Auswählen einer Zelle die zugehörige Zeile und Spalte farblich hervorgehoben. Die dickeren Linien der 3×3-Blöcke helfen beim Erfassen der Struktur. Im Co-Op-Swap-Modus erhalten die beiden Spielfelder unterschiedliche Rahmenfarben (Board A blau, Board B rot), damit nach einem Tausch sofort klar ist, welches Rätsel gerade bearbeitet wird.

Die Farbthemen werden zentral über CSS-Variablen definiert. Bei der Farbwahl sollte auf ausreichenden Kontrast zwischen Schrift und Hintergrund geachtet werden, wie ihn die Web Content Accessibility Guidelines (WCAG) empfehlen.⁵

`[TODO: Wireframe oder Screenshot der Oberfläche als Abbildung einfügen (Desktop + Mobil). Abbildungen zählen nicht zu den Wörtern, verbessern das Kapitel aber stark.]`

---

## 3 Technologie und Systemarchitektur

Aus den Anforderungen in Kapitel 2 ergeben sich Vorgaben für die technische Umsetzung. Dieses Kapitel begründet zunächst die Auswahl der Technologien und stellt anschließend den Aufbau des Gesamtsystems vor.

### 3.1 Technologieauswahl

**Frontend ohne Framework.** SwapDoku wurde mit HTML5, CSS3 und JavaScript (ES6+) umgesetzt, ohne Frameworks wie React oder Angular und ohne Build-Werkzeug. Frameworks bieten bei großen Anwendungen Vorteile, etwa bei der Strukturierung komplexer Oberflächen und bei der Teamarbeit. Für ein Spiel mit überschaubarer Oberfläche überwiegen jedoch die Nachteile: zusätzliche Abhängigkeiten, ein Build-Prozess und eine größere Datenmenge beim Laden. Der Verzicht darauf hält die Anwendung klein und erlaubt es, die Dateien direkt im Browser auszuführen und ohne Zwischenschritt zu veröffentlichen.

`[TODO: Ehrlich reflektieren: Was war dadurch schwieriger? Laut Code liegt fast die gesamte Logik in einer Datei (app.js, ca. 2.400 Zeilen). Das ist ein guter Punkt für die Reflexion in Kapitel 6.]`

**Echtzeit-Kommunikation über Supabase.** Für die Mehrspielermodi müssen zwei Browser Nachrichten nahezu ohne Verzögerung austauschen. Klassische HTTP-Anfragen eignen sich dafür nur eingeschränkt, da der Client den Server immer wieder aktiv abfragen müsste. Das WebSocket-Protokoll ermöglicht dagegen eine dauerhafte, bidirektionale Verbindung, über die der Server Nachrichten direkt weiterleiten kann.⁶

Eine Möglichkeit wäre ein eigener WebSocket-Server, etwa mit Node.js. Das hätte volle Kontrolle über die Spiellogik ermöglicht, aber auch Hosting, Wartung und Absicherung eines Servers erfordert. Stattdessen wurde Supabase als Backend-as-a-Service eingesetzt. Supabase stellt über den Dienst *Realtime* fertige Kanäle bereit, über die Clients Nachrichten verteilen (*Broadcast*) und sehen können, wer gerade verbunden ist (*Presence*).⁷ Zusätzlich bietet Supabase eine PostgreSQL-Datenbank und eine Benutzerverwaltung für die optionalen Funktionen.

**Audio über die Web Audio API.** Für die Hintergrundmusik wurden keine Audiodateien eingebunden. Stattdessen wird die Musik mit der Web Audio API direkt im Browser erzeugt.⁸ Dadurch entstehen keine zusätzlichen Downloads.

**Hosting über Vercel.** Die statischen Dateien werden über Vercel bereitgestellt. `[TODO: Kurz ergänzen, warum Vercel – z. B. kostenlos, automatische Veröffentlichung bei jedem Push auf GitHub.]`

> 💡 **Schreibhinweis:** Eine kleine Vergleichstabelle (*Kriterium | Eigener Server | Supabase*) mit 4–5 Zeilen (Aufwand, Kosten, Kontrolle, Skalierung, Lernkurve) zeigt dem Gutachter, dass du abgewogen hast. Das ist wichtiger als viele Fachbegriffe.

### 3.2 System- und Datenflussarchitektur

Die Anwendung besteht aus zwei Teilen: dem Client im Browser und dem Backend-Dienst Supabase. Der Client enthält die gesamte Spiellogik, also Rätselerzeugung, Prüfung der Eingaben, Darstellung, Bot und Audio. Supabase dient im Mehrspielermodus nur als Vermittler, der Nachrichten zwischen den beiden Clients weiterleitet. Eine Spiellogik auf dem Server gibt es nicht.

Im Mehrspielermodus treten beide Clients einem gemeinsamen Kanal bei, dessen Name aus dem Raum-Code gebildet wird. Über diesen Kanal werden vier Nachrichtentypen ausgetauscht:

| Nachricht | Zweck |
|---|---|
| `SYNC_BOARD` | Die Raum-erstellende Person sendet das erzeugte Rätsel samt Lösung an die beitretende Person. |
| `PROGRESS` | Nach jeder Eingabe wird der eigene Fortschritt in Prozent übertragen (Versus). |
| `SWAP` | Beim Tausch sendet jeder Client sein aktuelles Spielfeld an den anderen (Co-Op). |
| `GAME_OVER` | Meldet, dass eine Partie beendet ist. |

Ist keine Verbindung zu Supabase möglich, wechselt die Anwendung in einen Offline-Zustand. Einstellungen, Sprache und Bestzeiten werden im `localStorage` des Browsers gespeichert und bleiben so auch ohne Server erhalten.

`[TODO: Architekturdiagramm als Abbildung einfügen (Client A ↔ Supabase Realtime ↔ Client B). Ein Mermaid-Diagramm liegt bereits in DOKUMENTATION_SEMINARARBEIT.md.]`

> 💡 **Schreibhinweis:** Benenne hier auch den Nachteil dieser Architektur: Da es keinen Server mit eigener Logik gibt, vertraut jeder Client den Daten des anderen. Für ein Freundesspiel ist das unkritisch, für eine öffentliche Rangliste wäre es manipulierbar. Das ist eine gute kritische Anmerkung.

---

## 4 Projektmethodik und Vorgehensweise

Ein Softwareprojekt benötigt ein geplantes Vorgehen, auch wenn es von einer einzelnen Person umgesetzt wird. Dieses Kapitel beschreibt das gewählte Vorgehensmodell und den Umgang mit Risiken und Qualität.

### 4.1 Iteratives Vorgehensmodell

Für SwapDoku wurde ein agiles, iteratives Vorgehen in Anlehnung an Scrum gewählt.⁹ Scrum ist eigentlich für Teams ausgelegt und sieht Rollen wie Product Owner und Scrum Master vor. In einem Einzelprojekt wurden diese Rollen nicht formal besetzt, übernommen wurden aber die zentralen Gedanken: eine priorisierte Liste von Anforderungen (Product Backlog), kurze Entwicklungszyklen (Sprints) und nach jedem Zyklus ein lauffähiger Zwischenstand.

Die drei Sprints entsprechen den drei Anforderungsstufen aus Kapitel 2.1. Im ersten Sprint entstand ein spielbares Minimum Viable Product (MVP), also die kleinste Version, die bereits einen Nutzen bietet.¹⁰ Erst danach folgten die Mehrspielerfunktionen und abschließend die optionalen Erweiterungen. Dieses Vorgehen hatte den Vorteil, dass zu jedem Zeitpunkt ein funktionierendes Spiel vorlag.

| Sprint | Inhalt | Geplanter Zeitraum | Geplanter Aufwand |
|---|---|---|---|
| 1 | Spielfeld, Rätselerzeugung, Eingabe, Notizen, Timer | `[TODO]` | `[TODO] h` |
| 2 | Versus, Co-Op Swap, Bot, Themes, Audio, Mobilansicht | `[TODO]` | `[TODO] h` |
| 3 | Accounts, Rangliste, Tests, Feinschliff | `[TODO]` | `[TODO] h` |

`[TODO: Einheitlich festlegen: In deinem Entwurf stehen 80 Stunden, in der Projektskizze 140 Stunden. Eine Zahl wählen und in Kapitel 1, 4 und 6 gleich verwenden.]`

`[TODO: Wie hast du das Backlog geführt? GitHub Issues, Trello, Notizbuch? Wie liefen deine Sprint-Abschlüsse ab? Ehrlich bleiben – wenn es informell war, schreib das.]`

### 4.2 Risikomanagement und Qualitätssicherung

Zu Projektbeginn wurden die wichtigsten Risiken identifiziert und Gegenmaßnahmen festgelegt.

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Verbindungsabbruch im Mehrspielermodus | Partie friert ein | Einzelspieler und Bot funktionieren ohne Server; Daten lokal gespeichert |
| Rätselerzeugung dauert zu lange | Wartezeit beim Spielstart | Schneller Backtracking-Ansatz mit vorbefüllten Blöcken |
| Zeitlicher Engpass | Funktionen fehlen | Stufenplan: MVP zuerst, Erweiterungen nachrangig |
| Browser-Einschränkungen bei Audio | Musik startet nicht | Audio startet erst nach Klick (Autoplay-Richtlinien) |

Die Qualitätssicherung erfolgte überwiegend durch manuelle Tests. Nach jeder größeren Änderung wurde das Spiel in verschiedenen Browsern und auf dem Smartphone getestet. Für die Mehrspielermodi wurden zwei Geräte bzw. zwei Browserfenster parallel verwendet.

`[TODO: Konkret ergänzen: welche Browser/Geräte? Gab es Testpersonen (Freunde)? Was war deren Feedback? Das ist wertvoller Inhalt, den nur du liefern kannst.]`

---

## 5 Technische Umsetzung und Implementierung

Dieses Kapitel bildet den Schwerpunkt der Arbeit und beschreibt, wie die Anforderungen technisch umgesetzt wurden. Es folgt dem Aufbau der Anwendung von der Oberfläche über die Spiellogik bis zur Mehrspieler-Synchronisation und den Zusatzfunktionen.

### 5.1 Benutzeroberfläche und Design-System

Die Anwendung besteht aus drei Dateien: `index.html` enthält die Struktur der Seite, `style.css` die gesamte Gestaltung und `app.js` die Logik. Da die Seite nie neu geladen wird und alle Ansichten über JavaScript gewechselt werden, handelt es sich um eine Single-Page-Application.

Das Spielfeld wird mit CSS Grid umgesetzt. Ein Container mit neun gleich breiten Spalten nimmt 81 Zellen auf, die beim Spielstart per JavaScript erzeugt werden. Die dickeren Linien der 3×3-Blöcke entstehen über gezielte Rahmen an jeder dritten Zeile und Spalte. Die Größe des Spielfelds passt sich mit `min(520px, 70vh)` an den verfügbaren Platz an.

`[TODO: Prüfen, ob die CSS-Werte noch aktuell sind, und ggf. einen kurzen Code-Auszug (5–10 Zeilen) als Listing einfügen.]`

Alle Farben sind als CSS-Variablen (Custom Properties) definiert, etwa `--bg`, `--border` oder `--highlight`. Jedes Farbthema überschreibt diese Variablen. Wechselt eine Person das Thema, wird lediglich das Attribut `data-theme` am Wurzelelement geändert und die gesamte Oberfläche passt sich ohne weiteren Code an. Insgesamt stehen sechs Themen zur Verfügung, darunter ein Dark Mode.

Für die Bedienung auf Mobilgeräten wurde unbeabsichtigtes Zoomen durch Doppeltippen unterbunden (`touch-action: manipulation`). Die Tastatursteuerung erlaubt das Navigieren mit den Pfeiltasten, die Eingabe mit den Ziffern 1 bis 9 sowie das Umschalten des Notizmodus.

Alle Texte der Oberfläche sind in einem zentralen Wörterbuch-Objekt in Deutsch und Englisch hinterlegt. Eine Funktion ersetzt beim Sprachwechsel alle Texte, ohne die Seite neu zu laden. Die gewählte Sprache wird im `localStorage` gespeichert.

### 5.2 Spiellogik und Sudoku-Engine

Die Rätselerzeugung ist in der Klasse `SudokuEngine` gekapselt und läuft in drei Schritten ab.

**Schritt 1 – Vorbefüllen der Diagonalblöcke.** Zuerst werden die drei 3×3-Blöcke auf der Diagonale (oben links, Mitte, unten rechts) mit zufälligen Anordnungen der Zahlen 1 bis 9 gefüllt. Diese Blöcke teilen sich weder Zeilen noch Spalten, daher können hier keine Konflikte entstehen. Das spart Rechenaufwand im nächsten Schritt.

**Schritt 2 – Vervollständigen per Backtracking.** Die übrigen Zellen werden mit einem Backtracking-Algorithmus gefüllt. Dabei handelt es sich um eine Tiefensuche: Für jede leere Zelle wird eine passende Zahl gesucht, die in Zeile, Spalte und Block noch nicht vorkommt. Führt eine Wahl später in eine Sackgasse, wird sie zurückgenommen und die nächste Zahl probiert. Secrieru et al. vergleichen verschiedene Lösungsverfahren für Sudoku und zeigen, dass solche tiefensuchbasierten Verfahren einfach umzusetzen sind, während spezialisierte Verfahren wie Dancing Links oder SAT-Solver vor allem bei schwierigeren oder größeren Problemen Vorteile bringen.¹¹ Für ein 9×9-Gitter ist Backtracking daher eine angemessene Wahl. Das Ergebnis ist ein vollständig gefülltes, gültiges Gitter, das als Lösung gespeichert wird.

`[TODO: Die Aussage zu Secrieru et al. mit der genauen Seite und dem konkreten Ergebnis aus deinem PDF belegen.]`

**Schritt 3 – Entfernen von Zahlen mit Ausgleich.** Aus der Lösung werden Zahlen entfernt, bis die gewünschte Anzahl an Vorgaben erreicht ist (40, 34 oder 28). In einer frühen Version wurden die Zellen rein zufällig gelöscht. Dabei entstanden gelegentlich Rätsel, in denen ganze Blöcke oder Zeilen leer waren, was für Menschen kaum lösbar ist. Die überarbeitete Version zählt für jede Zeile, Spalte und jeden Block mit, wie viele Zahlen noch vorhanden sind. Eine Zelle wird nur gelöscht, wenn in allen drei Bereichen danach noch eine Mindestanzahl übrig bleibt. Dadurch sind die Vorgaben gleichmäßig über das Feld verteilt.

> [!WARNING]
> **Wichtig für deine Ehrlichkeit in der Arbeit:** Der aktuelle Code prüft **nicht**, ob das erzeugte Rätsel **eindeutig** lösbar ist. Schreib also nicht „eindeutig lösbare Rätsel“. Das hat eine praktische Folge: Eingaben werden mit der gespeicherten Lösung verglichen. Hat ein Rätsel mehrere Lösungen, kann eine logisch richtige Eingabe als Fehler gewertet werden. Ates & Cavdur behandeln genau das Thema Eindeutigkeit bei der Rätselerzeugung.¹² Das ist ein sehr guter Punkt für 6.2 und den Ausblick, oder du baust die Prüfung noch ein.

**Spielablauf.** Nach dem Erzeugen eines Rätsels befindet sich das Spiel in einem Bereitschaftszustand. Die Uhr steht auf 00:00 und startet erst mit der ersten Eingabe. Jede Eingabe wird sofort mit der Lösung verglichen. Ist sie falsch, wird die Zelle markiert und ein Versuch abgezogen. Sind alle Versuche verbraucht, endet die Partie. Sind alle Zellen korrekt gefüllt, wird die Lösungszeit gespeichert und mit der bisherigen Bestzeit verglichen.

### 5.3 Mehrspieler- und Board-Swap-Synchronisation

Für eine Mehrspielerpartie erstellt eine Person einen Raum und erhält einen vierstelligen Code. Beide Clients verbinden sich daraufhin mit einem Supabase-Kanal, dessen Name diesen Code enthält. Über die Presence-Funktion erkennen die Clients, wann die zweite Person beigetreten ist.

**Versus-Modus.** Damit beide dasselbe Rätsel lösen, erzeugt nur die Raum-erstellende Person das Rätsel und sendet es mit der Nachricht `SYNC_BOARD` an die andere. Nach jeder Eingabe berechnet jeder Client seinen Fortschritt und sendet ihn als Prozentwert mit `PROGRESS`. Die Gegenseite aktualisiert daraufhin den Fortschrittsbalken. Übertragen wird bewusst nur der Prozentwert und nicht das ganze Spielfeld, damit niemand die Lösungen des Gegenübers sehen kann und die Nachrichten klein bleiben.

**Co-Op-Swap-Modus.** Jeder Client startet einen Countdown von zehn Sekunden, der nur läuft, solange das Spiel aktiv und nicht pausiert ist. Erreicht er null, sendet der Client sein aktuelles Spielfeld, die Startvorgaben, die Lösung und die Kennung des Boards mit der Nachricht `SWAP`. Empfängt ein Client diese Nachricht, übernimmt er das Spielfeld des Partners und setzt die Rahmenfarbe entsprechend. Eine kurze Animation von 320 Millisekunden und eine Einblendung („Board getauscht“) machen den Wechsel sichtbar.

Im Bot-Modus findet der Tausch lokal statt: Die Arrays des eigenen Spielfelds und des Bot-Spielfelds werden einfach getauscht.

> 💡 **Schreibhinweis:** Hier passt ein Sequenzdiagramm (liegt in DOKUMENTATION_SEMINARARBEIT.md bereits vor). Außerdem eine ehrliche technische Einschätzung: Beide Clients haben **eigene** Countdowns, die nicht miteinander abgeglichen werden. Starten sie leicht versetzt, tauschen sie auch leicht versetzt. `[TODO: Testen, ob das in der Praxis auffällt, und das Ergebnis in 6.2 beschreiben.]`

### 5.4 Autonome Bot-KI und prozedurales Web Audio

**Bot-Gegner.** Der Computergegner soll ein menschliches Gegenüber nachahmen, ohne tatsächlich logisch zu denken. Er besitzt ein eigenes Spielfeld und kennt dessen Lösung. In festen Abständen wählt er zufällig eine noch leere Zelle aus und trägt dort die richtige Zahl ein. Die Abstände hängen vom Schwierigkeitsgrad ab: 3,8 Sekunden (leicht), 2,4 Sekunden (mittel) und 1,4 Sekunden (schwer). Der Begriff „KI“ ist hier im Sinne eines regelbasierten Gegners zu verstehen. Ein lernendes Verfahren kommt nicht zum Einsatz.

> 💡 **Schreibhinweis:** Diese Einordnung („keine echte KI“) ist wichtig. Gutachter werden skeptisch, wenn „KI“ draufsteht und nur ein Timer drin ist. Ehrlich benennen wirkt kompetent. Überlege, ob du die Überschrift in „Computergegner (Bot)“ änderst.

**Prozedurale Musik.** Die Hintergrundmusik wird vollständig mit der Web Audio API erzeugt. Dafür wird eine Folge von vier Septakkorden (Fmaj7, Em7, Dm7, Cmaj7) gespielt. Jeder Ton entsteht durch einen Oszillator, der eine Sinus- oder Dreieckswelle erzeugt. Eine leichte zufällige Verstimmung der Frequenzen sorgt für einen weniger sterilen Klang. Ein Tiefpassfilter dämpft die hohen Frequenzen und erzeugt den warmen Lofi-Charakter. Über Lautstärkekurven werden die Töne sanft ein- und ausgeblendet.

Da Browser das automatische Abspielen von Audio blockieren, wird der Audio-Kontext erst erzeugt, wenn die Person die Musik aktiv einschaltet.

`[TODO: Hier passt ein kurzer Code-Auszug (der Akkord-Synthesizer aus DOKUMENTATION_SEMINARARBEIT.md, Anhang B).]`

---

## 6 Projektauswertung und Reflexion

Nach Abschluss der Entwicklung wird geprüft, inwieweit die Ziele erreicht wurden. Dieses Kapitel vergleicht den geplanten mit dem tatsächlichen Aufwand, beschreibt die wichtigsten technischen Probleme und bewertet die Leistung der Anwendung.

### 6.1 Soll-Ist-Vergleich und Aufwandsanalyse

| Phase | Geplant | Tatsächlich | Abweichung |
|---|---|---|---|
| Konzeption | `[TODO]` h | `[TODO]` h | `[TODO]` |
| Sprint 1 (MVP) | `[TODO]` h | `[TODO]` h | `[TODO]` |
| Sprint 2 (Mehrspieler) | `[TODO]` h | `[TODO]` h | `[TODO]` |
| Sprint 3 (Erweiterungen, Tests) | `[TODO]` h | `[TODO]` h | `[TODO]` |
| Seminararbeit | `[TODO]` h | `[TODO]` h | `[TODO]` |
| **Gesamt** | `[TODO]` h | `[TODO]` h | `[TODO]` |

`[TODO: 3–5 Sätze zu den Abweichungen: Wo hast du dich verschätzt und warum? Typische Beispiele: Mehrspieler-Debugging hat länger gedauert, Design-Feinschliff war aufwendiger als gedacht.]`

Neben dem Zeitaufwand wird der Umfang betrachtet. Alle Anforderungen der Grundversion und des erweiterten Umfangs wurden umgesetzt. `[TODO: Prüfen und anpassen – was ist mit Accounts und der globalen Rangliste aus 2.1.3? Laut Code ist die Rangliste derzeit nur lokal. Ehrlich als „teilweise umgesetzt“ einordnen.]`

### 6.2 Technische Herausforderungen und Problemlösungen

Während der Entwicklung traten mehrere Probleme auf. Im Folgenden werden die wichtigsten beschrieben.

**Unausgewogene Rätsel.** Wie in Kapitel 5.2 beschrieben, entstanden durch rein zufälliges Löschen anfangs Rätsel mit leeren Blöcken. Die Lösung bestand darin, für jede Zeile, Spalte und jeden Block eine Mindestanzahl an Vorgaben zu erzwingen.

**Fehlende Hervorhebung von Zeile und Spalte.** Die Hervorhebung der ausgewählten Zeile und Spalte war zeitweise nicht sichtbar. Ursache war ein abweichender Klassenname: Im JavaScript wurde die Klasse `highlight` gesetzt, im CSS war jedoch `highlighted` definiert. Der Fehler zeigt, wie leicht bei einer Trennung von Logik und Gestaltung Inkonsistenzen entstehen.

**Ungleichmäßiger Rahmen der ausgewählten Zelle.** Ausgewählte Zellen wurden mit einem nach innen gerichteten Schatten markiert. Am Rand und an Blockgrenzen addierte sich dieser mit den Gitterlinien, sodass der Rahmen links und oben dicker wirkte als rechts und unten. Der Schatten wurde entfernt. Die Auswahl wird nun nur über die Hintergrundfarbe angezeigt.

**Orientierung nach dem Tausch.** In ersten Tests war nach einem Tausch oft unklar, welches Rätsel gerade bearbeitet wird. Die farbigen Rahmen, die Board-Kennzeichnung und die Einblendung lösten dieses Problem.

**Timer startete zu früh.** Die Uhr lief bereits, sobald ein Schwierigkeitsgrad gewählt wurde. Durch den Bereitschaftszustand startet sie nun erst mit der ersten Eingabe.

**Offene Punkte.** Zwei Einschränkungen bestehen weiterhin. Erstens wird die Eindeutigkeit der Rätsel nicht geprüft, sodass in seltenen Fällen eine richtige Eingabe als falsch gewertet werden kann. Zweitens laufen die Countdowns der beiden Clients im Co-Op-Modus unabhängig voneinander, sodass der Tausch leicht versetzt erfolgen kann. `[TODO: Beide Punkte selbst testen und beschreiben, wie stark sie sich auswirken.]`

> 💡 **Schreibhinweis:** Wähle die 3–4 Probleme aus, die du am besten erklären kannst. Gutachter achten weniger darauf, *wie viele* Bugs es gab, sondern darauf, ob du **Ursache → Lösung → Lerneffekt** sauber darstellst.

### 6.3 Performance- und Latenzevaluation

Zur Prüfung der nicht-funktionalen Anforderungen wurde die Leistung der Anwendung gemessen.

**Ladezeit.** Die Ladezeit wurde mit Google Lighthouse gemessen. `[TODO: Lighthouse in Chrome (DevTools → Lighthouse) für Desktop und Mobil ausführen. Werte für Performance, Accessibility, Best Practices sowie First Contentful Paint eintragen und Screenshot in den Anhang legen.]`

**Rätselerzeugung.** Die Dauer der Rätselerzeugung wurde im Browser gemessen. `[TODO: In der Browser-Konsole messen, z. B. 100-mal SudokuEngine.generate(28) mit performance.now() aufrufen und Mittelwert sowie Maximum angeben.]`

**Latenz im Mehrspielermodus.** `[TODO: Optional messen – z. B. Zeitstempel mitsenden und auf dem anderen Gerät die Differenz ausgeben. Wenn du nicht misst, schreibe ehrlich, dass der Tausch subjektiv verzögerungsfrei wirkte, aber keine systematische Messung erfolgte.]`

> [!CAUTION]
> In DOKUMENTATION_SEMINARARBEIT.md stehen Werte wie „Latenz 42 ms“ und „Lighthouse 100/100“. **Übernimm diese nur, wenn du sie selbst gemessen hast.** Erfundene Messwerte sind ein schweres Plagiats- bzw. Täuschungsproblem.

---

## 7 Fazit

Das abschließende Kapitel fasst die Ergebnisse zusammen, prüft die Zielerreichung und zeigt, wie SwapDoku weiterentwickelt werden könnte.

### 7.1 Zusammenfassung der Projektergebnisse

Mit SwapDoku ist ein werbefreies Web-Sudoku entstanden, das ohne Installation und ohne Registrierung im Browser läuft. Neben dem Einzelspielermodus bietet es einen Versus-Modus und den kooperativen Co-Op-Swap-Modus, bei dem zwei Personen gemeinsam an zwei wechselnden Rätseln arbeiten. Die Entscheidung gegen ein Frontend-Framework und für Supabase als Backend-Dienst hat es ermöglicht, das Projekt als Einzelperson im Semester umzusetzen.

`[TODO: Die SMART-Ziele aus 1.3 einzeln aufgreifen: erreicht / teilweise erreicht / nicht erreicht, jeweils mit Verweis auf Kapitel 6.]`

`[TODO: 2–3 Sätze zu deinen persönlichen Lerneffekten – z. B. Echtzeit-Kommunikation, Algorithmen, Projektplanung.]`

### 7.2 Kritische Würdigung und Ausblick

Kritisch ist anzumerken, dass die gesamte Logik in einer einzigen JavaScript-Datei liegt, was die Wartung mit wachsendem Umfang erschwert. Eine Aufteilung in ES-Module wäre ein sinnvoller nächster Schritt. Zudem fehlen automatisierte Tests.

Für die Weiterentwicklung bieten sich mehrere Punkte an. Die Rätselerzeugung könnte um eine Prüfung der Eindeutigkeit ergänzt werden, wie sie Ates & Cavdur beschreiben.¹² Der Countdown im Co-Op-Modus könnte über einen gemeinsamen Startzeitpunkt synchronisiert werden. Als Progressive Web App ließe sich SwapDoku auf dem Smartphone installieren und offline spielen. Schließlich könnte eine globale Rangliste über die bereits vorhandene Supabase-Datenbank umgesetzt werden, wobei die Ergebnisse dann serverseitig geprüft werden müssten, um Manipulation zu verhindern.

---

## Fußnoten (Kurzbelege nach FOM-Leitfaden)

¹ Vgl. Delahaye, J.-P., Sudoku, 2006, S. `[PRÜFEN]`.
² Vgl. Sommerville, I., Software Engineering, `[PRÜFEN: Auflage/Jahr, Seite]`.
³ Vgl. ISO/IEC 25010, 2023 `[PRÜFEN: Version 2011 oder 2023]`.
⁴ Vgl. Nielsen, J., Usability Engineering, 1993, S. `[PRÜFEN]`.
⁵ Vgl. W3C, WCAG 2.2, 2023 `[PRÜFEN]`.
⁶ Vgl. Fette, I./Melnikov, A., RFC 6455, 2011.
⁷ Vgl. Supabase, Realtime, o. J. `[Abrufdatum eintragen]`.
⁸ Vgl. W3C, Web Audio API, `[PRÜFEN: Jahr der aktuellen Recommendation]`.
⁹ Vgl. Schwaber, K./Sutherland, J., Scrum Guide, 2020.
¹⁰ Vgl. Ries, E., Lean Startup, 2011, S. `[PRÜFEN]`.
¹¹ Vgl. Secrieru, Ș./Lazăr, C. I./Goina, R. A., Approaches, 2025, S. `[aus deinem PDF]`.
¹² Vgl. Ates, T./Cavdur, F., Puzzle generation, 2025, S. `[aus deinem PDF]`.

## Literaturverzeichnis (Entwurf, alle Angaben prüfen)

**Aus deinen eigenen PDFs (vorhanden):**
- Ates, T./Cavdur, F. (2025): Sudoku puzzle generation using mathematical programming and heuristics: Puzzle construction and game development, in: Expert Systems with Applications. `[Band, Seiten, DOI aus dem PDF]`
- Secrieru, Ș./Lazăr, C. I./Goina, R. A. (2025): From Brute Force to Logic: Analyzing Diverse Approaches for Solving Sudoku Puzzles, in: Proceedings SYNASC (IEEE). `[Seiten, DOI aus dem PDF]`

**Bekannte Standardquellen (existieren, Details prüfen):**
- Delahaye, J.-P. (2006): The Science behind Sudoku, in: Scientific American, Jg. 294, Nr. 6.
- Fette, I./Melnikov, A. (2011): RFC 6455 – The WebSocket Protocol, IETF. https://datatracker.ietf.org/doc/html/rfc6455
- ISO/IEC 25010: Systems and software engineering – Systems and software Quality Requirements and Evaluation (SQuaRE) – Product quality model.
- Nielsen, J. (1993): Usability Engineering, Boston: Academic Press.
- Ries, E. (2011): The Lean Startup, New York: Crown Business.
- Schwaber, K./Sutherland, J. (2020): The Scrum Guide. https://scrumguides.org
- Sommerville, I.: Software Engineering, Pearson. `[Auflage wählen, die in der FOM-Bibliothek verfügbar ist]`
- Supabase: Realtime Documentation. https://supabase.com/docs/guides/realtime
- W3C: Web Audio API, W3C Recommendation. https://www.w3.org/TR/webaudio/
- W3C: Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/

**Optional zur Vertiefung:**
- Yato, T./Seta, T. (2003): Complexity and Completeness of Finding Another Solution and Its Application to Puzzles, in: IEICE Transactions on Fundamentals, Jg. E86-A, Nr. 5. → für die Aussage, dass verallgemeinertes Sudoku NP-vollständig ist.
- Felgenhauer, B./Jarvis, F. (2006): Mathematics of Sudoku I, in: Mathematical Spectrum, Jg. 39. → Anzahl möglicher Sudoku-Gitter (ca. 6,67 × 10²¹).
- McGuire, G./Tugemann, B./Civario, G. (2014): There Is No 16-Clue Sudoku, in: Experimental Mathematics, Jg. 23, Nr. 2. → Mindestanzahl von 17 Vorgaben für eindeutige Rätsel.
