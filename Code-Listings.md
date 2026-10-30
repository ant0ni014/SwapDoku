# Code-Ausschnitte für die Seminararbeit

Alle Ausschnitte stammen **1:1 aus deinem Code** (Zeilennummern Stand 29.10.2026). Kürzungen sind mit `// ...` markiert.

> 💡 **Faustregel:** Im Fließtext nur kurze Listings (ca. 5–20 Zeilen), die du direkt danach erklärst. Längere Ausschnitte kommen in den Anhang und werden im Text referenziert („siehe Listing A.1 im Anhang“). Code zählt in der Regel nicht zur Wortzahl, das solltest du aber mit dem Leitfaden abgleichen.

## LaTeX-Vorbereitung (einmalig in die Präambel)

```latex
\usepackage{listings}
\usepackage{xcolor}
\lstdefinelanguage{JavaScript}{
  keywords={const,let,for,if,else,return,static,class,function,new,true,false,of,switch,case,default,break,continue,async,await},
  sensitive=true, comment=[l]{//}, morecomment=[s]{/*}{*/},
  morestring=[b]', morestring=[b]", morestring=[b]`
}
\lstset{
  basicstyle=\ttfamily\footnotesize, numbers=left, numberstyle=\tiny,
  keywordstyle=\color{blue!70!black}\bfseries, commentstyle=\color{gray}\itshape,
  stringstyle=\color{green!50!black}, frame=single, breaklines=true,
  captionpos=b, showstringspaces=false, literate={ä}{{\"a}}1 {ö}{{\"o}}1 {ü}{{\"u}}1 {ß}{{\ss}}1
}
\renewcommand{\lstlistingname}{Listing}
\renewcommand{\lstlistlistingname}{Listingverzeichnis}
```

Das Verzeichnis erzeugst du mit `\lstlistoflistings`, z. B. nach dem Abbildungsverzeichnis.

---

## Listing 1 – Gültigkeitsprüfung (Kapitel 5.2) ⭐ sehr empfehlenswert

**Quelle:** [app.js, Z. 519–531](file:///d:/Projekt/SwapDoku/app.js#L519-L531)
**Warum gut:** Kurz, verständlich und zeigt die Sudoku-Regel direkt im Code.

```latex
\begin{lstlisting}[language=JavaScript, caption={Prüfung einer Zahl auf Zeile, Spalte und 3$\times$3-Block}, label={lst:isvalid}]
static isValid(b, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (b[row * 9 + i] === num || b[i * 9 + col] === num) return false;
  }
  const startR = Math.floor(row / 3) * 3;
  const startC = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (b[(startR + r) * 9 + (startC + c)] === num) return false;
    }
  }
  return true;
}
\end{lstlisting}
```

**Was du dazu erklären kannst:** Das Spielfeld ist ein eindimensionales Array mit 81 Feldern. Die Zelle in Zeile `r` und Spalte `c` liegt am Index `r * 9 + c`. Die erste Schleife prüft Zeile und Spalte gleichzeitig. Über `Math.floor(row / 3) * 3` wird die linke obere Ecke des zugehörigen 3×3-Blocks berechnet.

---

## Listing 2 – Backtracking (Kapitel 5.2) ⭐ Herzstück

**Quelle:** [app.js, Z. 533–550](file:///d:/Projekt/SwapDoku/app.js#L533-L550)

```latex
\begin{lstlisting}[language=JavaScript, caption={Rekursiver Backtracking-Algorithmus zum Füllen des Gitters}, label={lst:solve}]
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
          b[i] = 0;          // Sackgasse: Wert zurücknehmen
        }
      }
      return false;
    }
  }
  return true;
}
\end{lstlisting}
```

**Was du dazu erklären kannst:** Die Funktion sucht die erste leere Zelle und probiert die Zahlen 1–9 in zufälliger Reihenfolge. Passt eine Zahl, ruft sie sich selbst auf (Rekursion). Kommt sie später nicht weiter, wird die Zahl in Zeile 11 wieder auf 0 gesetzt. Das ist das eigentliche „Backtracking“. Durch die zufällige Reihenfolge entsteht bei jedem Aufruf ein anderes Gitter. Den Vergleich mit anderen Verfahren kannst du mit Secrieru et al. (2025) belegen.

> ⚠️ **Kritischer Hinweis für 6.2:** `.sort(() => Math.random() - 0.5)` ist ein verbreiteter, aber statistisch **nicht gleichverteilter** Mischtrick. Für ein Spiel ist das unkritisch. Wenn du es erwähnst, nenne den Fisher-Yates-Shuffle als saubere Alternative. Das zeigt, dass du deinen Code kritisch reflektierst.

---

## Listing 3 – Clue-Balancing (Kapitel 5.2 oder 6.2) ⭐ deine eigene Problemlösung

**Quelle:** [app.js, Z. 461–483](file:///d:/Projekt/SwapDoku/app.js#L461-L483)
**Warum gut:** Damit belegst du ein echtes Problem, das du selbst gelöst hast. Das schätzen Gutachter sehr.

```latex
\begin{lstlisting}[language=JavaScript, caption={Ausgewogenes Entfernen von Zahlen (Clue-Balancing)}, label={lst:balancing}]
const rowCounts = Array(9).fill(9);
const colCounts = Array(9).fill(9);
const boxCounts = Array(9).fill(9);
const minPerUnit = clues >= 38 ? 3 : 2;

for (const idx of indices) {
  if (toRemove <= 0) break;
  const r = Math.floor(idx / 9);
  const c = idx % 9;
  const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);

  if (rowCounts[r] > minPerUnit && colCounts[c] > minPerUnit
      && boxCounts[b] > minPerUnit) {
    puzzle[idx] = 0;
    rowCounts[r]--; colCounts[c]--; boxCounts[b]--;
    toRemove--;
  }
}
\end{lstlisting}
```

**Was du dazu erklären kannst:** Drei Zähler-Arrays merken sich, wie viele Zahlen pro Zeile, Spalte und Block noch stehen. Eine Zelle wird nur geleert, wenn danach überall noch mehr als `minPerUnit` (2 bzw. 3) Zahlen übrig bleiben. Zeile 10 berechnet die Blocknummer (0–8) aus Zeile und Spalte.

---

## Listing 4 – Supabase-Realtime-Kanal (Kapitel 5.3) ⭐ zeigt die Echtzeit-Kommunikation

**Quelle:** [app.js, Z. 1629–1670](file:///d:/Projekt/SwapDoku/app.js#L1629-L1670), gekürzt

```latex
\begin{lstlisting}[language=JavaScript, caption={Aufbau des Echtzeit-Kanals und Verarbeitung eingehender Nachrichten (gekürzt)}, label={lst:channel}]
state.channel = state.supabase.channel(`room:${state.roomCode}`, {
  config: { broadcast: { self: false } }
});

state.channel
  .on('broadcast', { event: 'SYNC_BOARD' }, ({ payload }) => {
    startNewGame(payload.initialBoard, payload.solution);
  })
  .on('broadcast', { event: 'PROGRESS' }, ({ payload }) => {
    dom.opponentBar.style.width = `${payload.progressPct}%`;
  })
  .on('broadcast', { event: 'SWAP' }, ({ payload }) => {
    applyIncomingSwap(payload);
  });
  // ...

state.channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await state.channel.track({ user: state.user?.id });
  }
});
\end{lstlisting}
```

**Was du dazu erklären kannst:** Der Kanalname wird aus dem Raum-Code gebildet, sodass nur Personen mit demselben Code dieselben Nachrichten erhalten. `self: false` verhindert, dass ein Client seine eigenen Nachrichten zurückbekommt. Für jeden Nachrichtentyp wird ein eigener Handler registriert (ereignisgesteuerte Architektur). `track()` meldet die Person beim Presence-Dienst an, damit beide Seiten wissen, wer im Raum ist.

> Hinweis: Im Original enthält der PROGRESS-Handler noch eine Rückfallberechnung und das Setzen eines Labels. Wenn du gekürzt zitierst, schreib „gekürzt“ in die Caption (ist schon drin).

---

## Listing 5 – Board-Swap (Kapitel 5.3)

**Quelle:** [app.js, Z. 1722–1757](file:///d:/Projekt/SwapDoku/app.js#L1722-L1757), gekürzt

```latex
\begin{lstlisting}[language=JavaScript, caption={Auslösen des Spielfeldtauschs im Co-Op-Modus (gekürzt)}, label={lst:swap}]
function doBoardSwap() {
  dom.grid.classList.add('swapping');
  setTimeout(() => dom.grid.classList.remove('swapping'), 320);

  state.activeBoard = state.activeBoard === 'A' ? 'B' : 'A';
  // ... Rahmenfarbe und Board-Badge aktualisieren

  if (state.opponentType === 'bot') {
    const tempBoard = [...state.currentBoard];
    state.currentBoard = [...state.botBoard];
    state.botBoard = tempBoard;
    // ... analog für initialBoard und solution
    render();
  } else if (state.channel) {
    broadcast('SWAP', {
      currentBoard: state.currentBoard,
      initialBoard: state.initialBoard,
      solution: state.solution,
      activeBoard: state.activeBoard
    });
  }
}
\end{lstlisting}
```

**Was du dazu erklären kannst:** Gegen den Bot werden die Arrays lokal über eine temporäre Variable getauscht. Online sendet der Client seinen kompletten Spielstand an den Partner. Der Spread-Operator `[...array]` erzeugt dabei Kopien, damit beide Variablen nicht auf dasselbe Array zeigen.

---

## Listing 6 – Bot-Gegner (Kapitel 5.4)

**Quelle:** [app.js, Z. 1499–1519](file:///d:/Projekt/SwapDoku/app.js#L1499-L1519), gekürzt

```latex
\begin{lstlisting}[language=JavaScript, caption={Ein Spielzug des Computergegners (gekürzt)}, label={lst:bot}]
function botStep() {
  if (state.isPaused || !state.gameStarted) return;
  const emptyIndices = [];
  for (let i = 0; i < 81; i++) {
    if (state.botBoard[i] === 0 || state.botBoard[i] !== state.botSolution[i]) {
      emptyIndices.push(i);
    }
  }
  if (emptyIndices.length === 0) { stopBot(); return; }

  const randIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  state.botBoard[randIdx] = state.botSolution[randIdx];
  // ... Fortschritt aktualisieren
}
\end{lstlisting}
```

**Was du dazu erklären kannst:** Das Listing zeigt gut, dass der Bot regelbasiert ist und nicht logisch löst. Er liest die richtige Zahl aus der Lösung ab. Die Schwierigkeit entsteht nur über das Intervall (`setInterval` mit 3.800/2.400/1.400 ms).

---

## Listing 7 – Theme-System mit CSS-Variablen (Kapitel 5.1)

**Quelle:** [style.css, Z. 5–33](file:///d:/Projekt/SwapDoku/style.css#L5-L33), stark gekürzt

```latex
\begin{lstlisting}[caption={Farbthemen über CSS Custom Properties (gekürzt)}, label={lst:themes}]
:root {
  --bg: #f8fafc;
  --border: #e2e8f0;
  --highlight: #f1f5f9;
  /* ... */
}

[data-theme="dark-slate"] {
  --bg: #090d16;
  --border: #374151;
  --highlight: #1e293b;
  /* ... */
}
\end{lstlisting}
```

**Was du dazu erklären kannst:** Alle Komponenten verwenden nur die Variablen (z. B. `background: var(--bg)`). Für einen Themenwechsel wird lediglich das Attribut `data-theme` am Wurzelelement geändert.

> ⚠️ **Korrektur zu Seminararbeit.md, Kapitel 5.1:** Dort steht, dass „eine Klasse am Wurzelelement getauscht“ wird. Laut Code ist es das **Attribut `data-theme`**. Bitte entsprechend anpassen.

---

## Für den Anhang

- **Lofi-Synthesizer:** Liegt bereits in [DOKUMENTATION_SEMINARARBEIT.md, Anhang B](file:///d:/Projekt/SwapDoku/DOKUMENTATION_SEMINARARBEIT.md#L394-L424). Vorher mit dem echten Code in `app.js` abgleichen.
- **RLS-Policies aus schema.sql:** Nur aufnehmen, wenn Accounts tatsächlich produktiv laufen.

## Empfehlung: Welche Listings wohin?

| Kapitel | Listing | Ort |
|---|---|---|
| 5.1 | 7 (Themes) | Fließtext |
| 5.2 | 1 (isValid), 2 (solve), 3 (Balancing) | Fließtext, ggf. Listing 1 in den Anhang |
| 5.3 | 4 (Kanal), 5 (Swap) | Fließtext |
| 5.4 | 6 (Bot) | Fließtext oder Anhang |
| Anhang | Synthesizer | Anhang |
