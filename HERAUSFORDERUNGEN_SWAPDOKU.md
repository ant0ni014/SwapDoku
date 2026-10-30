# SwapDoku: Herausforderungen & Technische Problemlösungen (Bug-Log)

Dieses Dokument dient als zentrale Wissensbasis für die wissenschaftliche Seminararbeit (insbesondere **Kapitel 5: Projektevaluation, Herausforderungen und Debugging**). Jeder Eintrag dokumentiert ein konkretes Problem, die technische Ursache und die implementierte Lösung.

---

### Herausforderung 1: Unfaire / unlösbare Puzzle-Generierung (Leere 3×3-Blöcke)
- **Problem:** Frühe Versionen der Sudoku-Generierung entfernten Zahlen rein stochastisch über ein gemischtes Index-Array. Dies führte regelmäßig dazu, dass ganze 3×3-Blöcke oder ganze Spalten komplett leer geräumt wurden. Solche Puzzles waren für Menschen extrem frustrierend oder logisch mehrdeutig.
- **Ursache:** Fehlende Constraint-Prüfung bei der sukzessiven Ziffern-Reduktion ausgehend vom voll gelösten Gitter.
- **Lösung:** Einführung von drei Histogramm-Arrays (`rowCounts[9]`, `colCounts[9]`, `boxCounts[9]`). Eine Startzahl an Index `idx` wird nur noch dann gelöscht, wenn gilt:
  ```javascript
  if (rowCounts[r] > minClues && colCounts[c] > minClues && boxCounts[b] > minClues) {
      board[idx] = 0;
      rowCounts[r]--; colCounts[c]--; boxCounts[b]--;
  }
  ```
  Dadurch ist mathematisch garantiert, dass in jedem 3×3-Block mindestens 2–3 Startzahlen erhalten bleiben.

---

### Herausforderung 2: Orientierungsverlust beim kooperativen Board-Swap
- **Problem:** Wenn nach 10 Sekunden das Spielfeld getauscht wurde, erkannten Spieler nicht sofort, ob der Tausch stattgefunden hatte und welches Board sie gerade bearbeiten. Die Spielfelder sahen sich zu ähnlich.
- **Ursache:** Reiner Austausch der Ziffern-Arrays im Hintergrund ohne adäquate visuelle Rückmeldung im DOM.
- **Lösung:**
  1. **Visuelle Transition:** Auslösen der CSS-Animationsklasse `.swapping` für 320 ms (kurzes, weiches Herunterskalieren und Einblenden).
  2. **Zwei-Farben-System:**
     - **Board A:** Umrandung `3px solid #0284c7` (Blau) mit blauem Badge `Board A`.
     - **Board B:** Umrandung `3px solid #ef4444` (Rot) mit rotem Badge `Board B`.
  3. **Toast-Benachrichtigung:** Kurzer Signalhinweis bei Vollzug des Swaps.

---

### Herausforderung 3: Unbeabsichtigter Timer-Start vor eigentlichem Spielbeginn
- **Problem:** Sobald eine neue Runde geladen wurde, lief die Stoppuhr sofort los. Spieler, die sich erst orientieren oder den Modus auswählen wollten, verloren wertvolle Zeit.
- **Ursache:** Die Initialisierungsfunktion `startNewGame()` startete direkt `startStopwatch()`.
- **Lösung:** Einführung eines expliziten **Ready-States** (`state.gameStarted = false`).
  - Der Timer verharrt sichtbar auf `00:00` und das Pause-Icon zeigt das Play-Symbol `▶`.
  - Erst bei der ersten echten Nutzerinteraktion (Klick auf Zelle, Tastatureingabe oder Druck auf Play) wird `ensureGameStarted()` getriggert, wodurch Stoppuhr, Bot-Takt und Swap-Countdown synchron starten.

---

### Herausforderung 4: Asymmetrische & unruhige Zell-Umrandung (Box-Shadow-Bug)
- **Problem:** Bei der Auswahl einer Zelle wirkten die Ränder unruhig oder verschoben benachbarte Zellen um 1 Pixel. Dicke Außengrenzen der 3×3-Blöcke wurden unschön überdeckt.
- **Ursache:** Nutzung von `border: 2px solid` oder aggressiven `box-shadow`-Inset-Stilen auf den einzelnen Zellen, die mit den Trennlinien des CSS-Grids kollidierten.
- **Lösung:** Selektierte Zellen erhalten eine dezente, exakt eingepasste Hintergrundfarbe (`--selected-cell-bg`) und eine dezente Innenmarkierung ohne Pixelversatz (`box-shadow: inset 0 0 0 2px var(--accent)`). Die stabilen 3×3-Blockrahmen bleiben unberührt.

---

### Herausforderung 5: Fehlende Fadenkreuz-Hervorhebung (CSS-Selektor-Divergenz)
- **Problem:** Die visuelle Orientierungshilfe (Graue Markierung aller Zellen in derselben Zeile und Spalte der ausgewählten Zelle) funktionierte nach einem CSS-Refactoring plötzlich nicht mehr.
- **Ursache:** In `style.css` und `app.js` gab es eine Namensabweichung zwischen der CSS-Klasse `.crosshair` und `.highlighted-axis`.
- **Lösung:** Konsolidierung auf die einheitliche CSS-Klasse `.crosshair` in JavaScript und CSS. Beim Anklicken einer Zelle berechnet das Rendering effizient alle Zellen mit identischem Zeilen- oder Spaltenindex und weist die Klasse zu.

---

### Herausforderung 6: Mobile Zoom-Störungen & Layout-Fitting
- **Problem:** Auf Smartphones und Tablets führte schnelles Tippen auf das Numpad oder Wischgesten zu unerwünschtem Hereinzoomen des Browsers (Double-Tap-Zoom) und vertikalem Hin- und Herspringen der Seite.
- **Ursache:** Fehlendes `touch-action: manipulation` im CSS und Standard-Viewport-Zoomverhalten des mobilen WebKit/Blink-Browsers.
- **Lösung:** 
  - Ergänzung von `touch-action: manipulation` auf allen interaktiven Buttons und Numpad-Tasten.
  - Viewport-Meta-Tag mit stabiler Skalierung (`viewport-fit=cover`).
  - Vertikales 1-Spalten-Flexbox-Layout auf Displays $< 768\text{px}$, während Desktops ein 2-Spalten-Grid nutzen.

---

### Herausforderung 7: Dark-Mode-Kontrast und Linien-Auswaschung
- **Problem:** Bei Aktivierung des Dunkelmodus (`dark-slate`) verschwammen die inneren Gitterlinien mit dem Hintergrund, sodass die 3×3-Blockstrukturen kaum noch erkennbar waren.
- **Ursache:** Hardcodierte Border-Farben, die für helle Hintergründe optimiert waren.
- **Lösung:** Vollständige Kapselung aller Farbwerte in CSS Custom Properties (`--cell-border`, `--block-border`). Im Dark Mode werden diese Werte gezielt auf kontrastreiche Slate-Töne (`#334155` und `#475569`) angepasst, sodass das Gitter bei jedem Umgebungslicht gestochen scharf bleibt.

---

### Herausforderung 8: Visuelle Unruhe durch Emoji-Symbole
- **Problem:** Die Verwendung von bunten Betriebssystem-Emojis (z. B. 🎨, ⏱️, 👤) wirkte unprofessionell und auf verschiedenen Geräten (iOS vs. Android vs. Windows) optisch inkonsistent.
- **Ursache:** Native Schriftart-Emojis variieren je nach Plattform stark in Farbe, Form und Größe.
- **Lösung:** Vollständiger Austausch aller Emojis gegen standardisierte, monochrome Inline-SVG-Vektorgrafiken (`stroke="currentColor"`). Dadurch passen sich die Icons automatisch der Textfarbe und dem gewählten Theme an.

---

### Herausforderung 9: Asynchroner Spielstart im Multiplayer
- **Problem:** Traten zwei Spieler über den 4-stelligen Raumcode gegeneinander an, begann der Spieler, der zuerst im Raum war, früher zu rätseln als der beigetretene Partner.
- **Ursache:** Fehlende Vorstart-Synchronisation. Der Raum-Host startete seinen Timer sofort, anstatt auf die Empfangsbestätigung des Clients zu warten.
- **Lösung:** Einführung eines gemeinsamen **3-2-1 Countdown-Overlays**. Sobald der zweite Spieler den Raum betritt (`presence:sync`), sendet der Host ein `COUNTDOWN_START`-Signal über Supabase Realtime Broadcast. Beide Clients zählen visuell synchron von 3 auf 0 herunter, bevor die Eingabe freigeschaltet wird.

---

### Herausforderung 10: Blockieren des Sieges-Modals bei Netzwerkfehlern
- **Problem:** Hatte ein Spieler das letzte Feld gelöst, erschien in manchen Testläufen das Sieges-Overlay nicht, wenn der asynchrone Highscore-Upload zu Supabase fehlschlug oder verzögert war.
- **Ursache:** Der Aufruf von `showResultOverlay()` erfolgte erst am Ende einer asynchronen Kette nach `saveScoreToDB()`. Trat dort eine unbehandelte Exception auf, brach die Ausführung ab.
- **Lösung:** Umkehrung der Priorität: Das UI-Ergebnis (`showResultOverlay()`) wird sofort synchron aufgerufen. Alle nachgelagerten Datenbank- und Toast-Aufrufe wurden in `try-catch`-Blöcke gekapselt, sodass das visuelle Spielerlebnis auch bei Verbindungsabbrüchen zu 100 % garantiert ist.

---

### Herausforderung 11: Ungerechtes Spielende bei Verbindungsabbruch (Ghost-Räume)
- **Problem:** Schloss ein Spieler im Versus- oder Co-Op-Modus einfach den Browser-Tab, blieb der verbleibende Spieler in einem eingefrorenen Raum zurück.
- **Ursache:** Fehlende Behandlung des Supabase-Presence-Leaves.
- **Lösung:** Implementierung eines Event-Listeners auf `channel.on('presence', { event: 'leave' })`. Verlässt der Gegner das Match vorzeitig, wertet das System dies als Forfeit (Aufgabe) und erklärt den verbliebenen Spieler automatisch zum Sieger.

---

### Herausforderung 12: Fehler-Exploit bei Ziffernüberschreibung
- **Problem:** Ein Spieler verlor nur dann ein Leben, wenn er eine falsche Zahl in eine *leere* Zelle eintrug. Überschrieb er eine bereits falsch gesetzte Zelle mit einer weiteren falschen Zelle, wurde kein Leben abgezogen.
- **Ursache:** Die Validierungsprüfung enthielt eine Bedingung `if (prevVal === 0)`, die bereits belegte Zellen von der Fehlerstrafe ausschloss.
- **Lösung:** Vereinheitlichung der Validierungslogik: Jede eingegebene Zahl wird gegen `state.solution[idx]` geprüft. Stimmt der Wert nicht mit der mathematischen Lösung überein, wird ausnahmslos ein Leben abgezogen (`deductLife()`), unabhängig vom vorherigen Inhalt der Zelle.
