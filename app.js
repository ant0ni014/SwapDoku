/**
 * SwapDoku: Kernlogik, Realtime-Synchronisation, Bot-Engine, Gamification, Rangliste & Lofi Audio
 */

const SUPABASE_CONFIG = {
  url: window.__SUPABASE_URL__ || 'https://fmiqvjqajqzmxabmokbr.supabase.co',
  anonKey: window.__SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtaXF2anFhanF6bXhhYm1va2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNjAzMDQsImV4cCI6MjEwODkzNjMwNH0.PG1lVKeI0i9EyrRT_W_7sftK3tvvpy7M3T5UQairlzM'
};

const THEMES = [
  { 
    id: 'nordic-light', 
    name: 'Nordic Light', 
    cost: 0, 
    colors: ['#f8fafc', '#ffffff', '#2563eb'],
    descDe: 'Klassisches Weiß & Schiefergrau',
    descEn: 'Classic crisp white & slate'
  },
  { 
    id: 'dark-slate', 
    name: 'Dark Slate', 
    cost: 0, 
    colors: ['#090d16', '#111827', '#38bdf8'],
    descDe: 'Elegantes Mitternachtsschwarz',
    descEn: 'Sleek midnight dark mode'
  },
  { 
    id: 'matcha-paper', 
    name: 'Matcha Green', 
    cost: 0, 
    colors: ['#e3ede5', '#f2f7f3', '#1e7046'],
    descDe: 'Beruhigendes Salbei & Waldgrün',
    descEn: 'Soothing sage & forest green'
  },
  { 
    id: 'nordic-frost', 
    name: 'Ocean Frost', 
    cost: 0, 
    colors: ['#dbeafe', '#eff6ff', '#0284c7'],
    descDe: 'Kühles Arktik- & Ozeanblau',
    descEn: 'Crisp glacier & ocean blue'
  },
  { 
    id: 'warm-sunset', 
    name: 'Sunset Amber', 
    cost: 0, 
    colors: ['#fbe6db', '#fff5ef', '#c2410c'],
    descDe: 'Warme Pfirsich- & Terracotta-Töne',
    descEn: 'Warm apricot & terracotta glow'
  },
  { 
    id: 'lavender-dream', 
    name: 'Lavender Dream', 
    cost: 0, 
    colors: ['#ede7f6', '#f8f5fc', '#7c3aed'],
    descDe: 'Elegantes Pastell-Lavendel & Violett',
    descEn: 'Dreamy pastel lavender & violet'
  }
];

// =============================================================================
// I18N SPRACHPAKETE (DEUTSCH & ENGLISCH)
// =============================================================================
const I18N = {
  de: {
    // Header & Toggles
    langTitle: 'Sprache wechseln (DE / EN)',
    audioTitle: 'Lofi Ambient-Musik an/aus',
    themeToggleTitle: 'Dark/Light Modus umschalten',
    accountTitle: 'Account & Profil',
    themesBtn: 'Themes',
    
    // HUD
    heartsTitle: 'Verbleibende Versuche',
    timerTitle: 'Spielzeit',
    playTitle: 'Starten (P)',
    pauseTitle: 'Pausieren (P)',
    resumeTitle: 'Fortsetzen (P)',
    playerLabel: 'Du',
    opponentLabel: 'Gegner',
    botLabel: 'Bot',
    swapIn: 'Swap in',
    swapWithBotIn: 'Swap mit Bot in',
    
    // Modi & Schwierigkeitsgrade
    modeZen: 'Einzelspieler',
    modeVersus: 'Versus',
    modeSwap: 'Co-Op Swap',
    modeHelpTitle: 'Spielregeln & Modus-Info',
    
    zenEasy: 'Einfach',
    zenMedium: 'Mittel',
    zenHard: 'Schwer',
    
    versusDiffLabel: 'Rätsel:',
    versusEasy: 'Einfach',
    versusMedium: 'Mittel',
    versusHard: 'Schwer',
    
    botSpeedLabel: 'Bot-Stufe:',
    partnerSpeedLabel: 'Partner-Stufe:',
    diffEasy: 'Leicht',
    diffMedium: 'Mittel',
    diffHard: 'Schwer',
    partnerEasy: 'Entspannt',
    partnerMedium: 'Verlässlich',
    partnerHard: 'Profi',
    btnStartBotGame: 'Spiel gegen Bot starten',
    
    // Lobby
    btnPlayOnline: 'Online-Raum',
    btnPlayBot: 'Mit Bot spielen',
    createRoomBtn: 'Raum erstellen',
    joinRoomBtn: 'Beitreten',
    roomInputPlaceholder: 'Code eingeben',
    roomCodeLabel: 'Raum-Code:',
    leaveRoom: 'Verlassen',
    statusConnecting: 'Verbinde...',
    statusConnected: 'Verbunden',
    statusDisconnected: 'Nicht verbunden',
    statusPlayers: 'Spieler',
    
    // Controls & Tipps
    btnNotes: 'Notizen',
    notesOff: 'Notizen: Aus',
    notesOn: 'Notizen: An',
    btnHint: 'Tipp',
    erase: 'Löschen',
    newGame: 'Neu',
    
    // Board Result Overlay
    resTitleWin: 'Hervorragend gelöst!',
    resDescWin: 'Sudoku fehlerfrei gemeistert.',
    resTitleGameOver: 'Keine Leben mehr',
    resDescGameOver: 'Alle 3 Leben aufgebraucht.',
    resBtnNewGame: 'Neues Spiel',
    resBtnSolution: 'Lösung anzeigen',
    resBtnInspect: 'Feld ansehen',
    resBtnReopen: 'Ergebnis & Stats',
    toastInspectHint: 'Tippe oben auf „Ergebnis & Stats“, um zurückzukehren',
    resStatTime: 'Zeit:',
    resStatDiff: 'Modus:',
    
    // Pause Overlay
    pauseOverlayTitle: 'Spiel pausiert',
    pauseOverlayDesc: 'Die Zeit ist angehalten.',
    resumeBtn: 'Fortsetzen',
    
    // Footer
    imprintLink: 'Impressum',
    privacyLink: 'Datenschutz',
    
    // Modals
    themeModalTitle: 'Themes & Farben',
    themeFree: 'Kostenlos',
    themeActive: 'Aktiv',
    themeSelect: 'Aktivieren',
    
    leadModalTitle: 'Rangliste',
    leadTabEasy: 'Einfach',
    leadTabMedium: 'Mittel',
    leadTabHard: 'Schwer',
    myRankLabel: 'Deine Bestzeit:',
    thRank: 'Rang',
    thPlayer: 'Spieler',
    thBestTime: 'Beste Zeit',
    
    accountModalTitle: 'Account & Profil',
    usernameLabel: 'Spielername:',
    usernamePlaceholder: 'Dein Spielername',
    saveBtn: 'Speichern',
    bestTimeLabel: 'Bestzeit (Mittel)',
    activeThemeLabel: 'Aktives Theme',
    statusLabel: 'Status',
    statusGuest: 'Gast',
    statusLoggedIn: 'Angemeldet',
    loggedInAs: 'Angemeldet als',
    logoutBtn: 'Abmelden',
    tabLogin: 'Anmelden',
    tabRegister: 'Registrieren',
    emailLabel: 'E-Mail',
    passwordLabel: 'Passwort',
    passwordPlaceholder: 'Mindestens 6 Zeichen',
    btnSubmitLogin: 'Anmelden',
    btnSubmitRegister: 'Konto registrieren',
    
    // Rules Modal
    rulesModalTitleZen: 'Einzelspieler — Regeln',
    rulesModalZen: `
      <p><strong>Ziel:</strong> Fülle das gesamte 9x9-Gitter so aus, dass in jeder Zeile, Spalte und jedem 3x3-Block jede Zahl von 1 bis 9 genau einmal vorkommt.</p>
      <ul>
        <li><strong>Einfach:</strong> 3 Versuche (✦). Viele Startzahlen.</li>
        <li><strong>Mittel:</strong> 3 Versuche (✦). Ausgeglichene Herausforderung.</li>
        <li><strong>Schwer:</strong> 3 Versuche (✦). Anspruchsvolles Rätsel.</li>
      </ul>
      <p>Starte durch Antippen eines Feldes, einer Zahl oder des Play-Buttons.</p>
    `,
    rulesModalTitleVersus: 'Versus-Modus — Regeln',
    rulesModalVersus: `
      <p><strong>Ziel:</strong> Du und dein Gegner (online per 4-stelligem Raumcode oder ein lokaler Bot) lösen zeitgleich <strong>dasselbe Rätsel</strong>.</p>
      <ul>
        <li>Der Fortschrittsbalken oben zeigt live, wer wie weit ist.</li>
        <li>Wähle die Rätselschwierigkeit (Einfach, Mittel, Schwer) und die Bot-Geschwindigkeit.</li>
        <li>Wer zuerst alle Felder korrekt ausgefüllt hat, gewinnt die Partie.</li>
      </ul>
    `,
    rulesModalTitleSwap: 'Co-Op Swap — Regeln',
    rulesModalSwap: `
      <p><strong>Die kooperative Herausforderung:</strong></p>
      <ul>
        <li>Zwei Boards im Spiel: <strong>Board A (Blau)</strong> und <strong>Board B (Rot)</strong>.</li>
        <li>Ein <strong>10-Sekunden-Timer</strong> läuft ab.</li>
        <li>Sobald der Timer 0 erreicht, tauscht ihr die Boards!</li>
        <li>Du übernimmst direkt das andere Board an der Stelle, wo dein Partner aufgehört hat.</li>
        <li>Löst gemeinsam beide Rätsel unter Zeitdruck.</li>
      </ul>
    `,
    
    // Toasts
    toastGameStarted: 'Spiel gestartet! Viel Erfolg.',
    toastGamePaused: 'Spiel pausiert',
    toastGameResumed: 'Spiel fortgesetzt',
    toastMusicOn: 'Lofi Ambient-Musik an',
    toastMusicOff: 'Lofi Ambient-Musik aus',
    toastBoardSwapped: 'Board getauscht! Du spielst jetzt Board ',
    toastGameOver: 'Keine Versuche mehr übrig!',
    toastGameWon: 'Hervorragend gelöst in ',
    toastNewBestTime: 'Neue Bestzeit aufgestellt! ✦',
    toastHintUsed: 'Tipp eingesetzt!',
    toastNoHints: 'Keine Tipps mehr übrig!',
    toastEnterCode: '4-stelligen Code eingeben',
    toastSynced: 'Board synchronisiert',
    toastOpponentWon: 'Gegner war schneller',
    toastBotWon: 'Der Bot hat das Rätsel zuerst gelöst!',
    toastBotPartDone: 'Der Bot hat seinen Teil gelöst!',
    toastBotStarted: 'Spiel gegen Bot gestartet!',
    toastThemeApplied: 'Theme aktiviert'
  },
  
  en: {
    // Header & Toggles
    langTitle: 'Switch Language (DE / EN)',
    audioTitle: 'Lofi Ambient Music on/off',
    themeToggleTitle: 'Toggle Dark/Light Mode',
    accountTitle: 'Account & Profile',
    themesBtn: 'Themes',
    
    // HUD
    heartsTitle: 'Remaining attempts',
    timerTitle: 'Time elapsed',
    playTitle: 'Start (P)',
    pauseTitle: 'Pause (P)',
    resumeTitle: 'Resume (P)',
    playerLabel: 'You',
    opponentLabel: 'Opponent',
    botLabel: 'Bot',
    swapIn: 'Swap in',
    swapWithBotIn: 'Swap with Bot in',
    
    // Modes & Difficulties
    modeZen: 'Singleplayer',
    modeVersus: 'Versus',
    modeSwap: 'Co-Op Swap',
    modeHelpTitle: 'Game Rules & Info',
    
    zenEasy: 'Easy',
    zenMedium: 'Medium',
    zenHard: 'Hard',
    
    versusDiffLabel: 'Puzzle:',
    versusEasy: 'Easy',
    versusMedium: 'Medium',
    versusHard: 'Hard',
    
    botSpeedLabel: 'Bot Speed:',
    partnerSpeedLabel: 'Partner Level:',
    diffEasy: 'Easy',
    diffMedium: 'Medium',
    diffHard: 'Hard',
    partnerEasy: 'Relaxed',
    partnerMedium: 'Reliable',
    partnerHard: 'Expert',
    btnStartBotGame: 'Start match vs Bot',
    
    // Lobby
    btnPlayOnline: 'Online Room',
    btnPlayBot: 'Play vs Bot',
    createRoomBtn: 'Create Room',
    joinRoomBtn: 'Join',
    roomInputPlaceholder: 'Enter code',
    roomCodeLabel: 'Room Code:',
    leaveRoom: 'Leave',
    statusConnecting: 'Connecting...',
    statusConnected: 'Connected',
    statusDisconnected: 'Not connected',
    statusPlayers: 'Players',
    
    // Controls & Hints
    btnNotes: 'Notes',
    notesOff: 'Notes: Off',
    notesOn: 'Notes: On',
    btnHint: 'Hint',
    erase: 'Erase',
    newGame: 'New',
    
    // Board Result Overlay
    resTitleWin: 'Solved Successfully!',
    resDescWin: 'Sudoku completed with flying colors.',
    resTitleGameOver: 'Game Over',
    resDescGameOver: 'All 3 attempts used up.',
    resBtnNewGame: 'New Game',
    resBtnSolution: 'Show Solution',
    resBtnInspect: 'View Board',
    resBtnReopen: 'Results & Stats',
    toastInspectHint: 'Tap „Results & Stats“ above to return',
    resStatTime: 'Time:',
    resStatDiff: 'Mode:',
    
    // Pause Overlay
    pauseOverlayTitle: 'Game Paused',
    pauseOverlayDesc: 'Time is stopped.',
    resumeBtn: 'Resume',
    
    // Footer
    imprintLink: 'Imprint',
    privacyLink: 'Privacy Policy',
    
    // Modals
    themeModalTitle: 'Themes & Colors',
    themeFree: 'Free',
    themeActive: 'Active',
    themeSelect: 'Select',
    
    leadModalTitle: 'Leaderboard',
    leadTabEasy: 'Easy',
    leadTabMedium: 'Medium',
    leadTabHard: 'Hard',
    myRankLabel: 'Your Best Time:',
    thRank: 'Rank',
    thPlayer: 'Player',
    thBestTime: 'Best Time',
    
    accountModalTitle: 'Account & Profile',
    usernameLabel: 'Player Name:',
    usernamePlaceholder: 'Your player name',
    saveBtn: 'Save',
    bestTimeLabel: 'Best Time (Medium)',
    activeThemeLabel: 'Active Theme',
    statusLabel: 'Status',
    statusGuest: 'Guest',
    statusLoggedIn: 'Signed In',
    loggedInAs: 'Signed in as',
    logoutBtn: 'Log Out',
    tabLogin: 'Sign In',
    tabRegister: 'Register',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    btnSubmitLogin: 'Sign In',
    btnSubmitRegister: 'Register Account',
    
    // Rules Modal
    rulesModalTitleZen: 'Singleplayer — Rules',
    rulesModalZen: `
      <p><strong>Goal:</strong> Fill the 9x9 grid so every row, column, and 3x3 box contains digits 1 to 9 exactly once.</p>
      <ul>
        <li><strong>Easy:</strong> 3 attempts (✦). Generous starting clues.</li>
        <li><strong>Medium:</strong> 3 attempts (✦). Balanced challenge.</li>
        <li><strong>Hard:</strong> 3 attempts (✦). Demanding challenge.</li>
      </ul>
      <p>Start simply by tapping any cell, number, or the Play button.</p>
    `,
    rulesModalTitleVersus: 'Versus Mode — Rules',
    rulesModalVersus: `
      <p><strong>Goal:</strong> Compete live against another player or a bot on the <strong>exact same puzzle</strong>.</p>
      <ul>
        <li>Live progress bars at the top track who is leading.</li>
        <li>Choose puzzle difficulty (Easy, Medium, Hard) and bot speed.</li>
        <li>First player to solve the entire board wins!</li>
      </ul>
    `,
    rulesModalTitleSwap: 'Co-Op Swap — Rules',
    rulesModalSwap: `
      <p><strong>Cooperative Challenge:</strong></p>
      <ul>
        <li>Two boards in play: <strong>Board A (Blue)</strong> and <strong>Board B (Red)</strong>.</li>
        <li>A <strong>10-second countdown</strong> ticks down.</li>
        <li>When it hits 0, the boards swap instantly!</li>
        <li>You take over your partner's board exactly where they left off.</li>
        <li>Work together to complete both puzzles under pressure.</li>
      </ul>
    `,
    
    // Toasts
    toastGameStarted: 'Game started! Good luck.',
    toastGamePaused: 'Game paused',
    toastGameResumed: 'Game resumed',
    toastMusicOn: 'Lofi Ambient music on',
    toastMusicOff: 'Lofi Ambient music off',
    toastBoardSwapped: 'Board swapped! You are now playing Board ',
    toastGameOver: 'No attempts left!',
    toastGameWon: 'Solved successfully in ',
    toastNewBestTime: 'New personal best time! ✦',
    toastEnterCode: 'Enter 4-character code',
    toastSynced: 'Board synchronized',
    toastOpponentWon: 'Opponent was faster',
    toastBotWon: 'Bot solved the puzzle first!',
    toastBotPartDone: 'Bot finished their board!',
    toastBotStarted: 'Match vs Bot started!',
    toastThemeApplied: 'Theme applied'
  }
};

const state = {
  currentLang: localStorage.getItem('swapdoku_lang') || 'de',
  supabase: null,
  user: null,
  isOffline: false,
  profile: {
    username: 'Spieler',
    sync_points: 0,
    active_theme: 'nordic-light',
    unlocked_themes: ['nordic-light', 'dark-slate', 'matcha-paper', 'nordic-frost', 'warm-sunset', 'lavender-dream']
  },

  mode: 'zen', // 'zen' | 'versus' | 'swap'
  zenDifficulty: 'easy', // 'easy' (Standard), 'medium', 'hard'
  versusDifficulty: 'medium', // 'easy', 'medium', 'hard'
  opponentType: 'online', // 'online' | 'bot'
  botDifficulty: 'medium', // 'easy' | 'medium' | 'hard'
  botRunning: false,
  
  // Start- & Pauselogik (Spiel wartet auf erste Aktion)
  gameStarted: false,
  isPaused: false,
  gameSeconds: 0,
  gameTimerInterval: null,

  // Sterne / Fehlerbegrenzung
  maxHearts: 3,
  currentHearts: 3,
  isGameOver: false,

  // Co-Op Swap Farbmarkierung
  activeBoard: 'A', // 'A' (Blau) | 'B' (Rot)

  // Ranglisten Filter
  leadDifficulty: 'medium', // 'easy' | 'medium' | 'hard'
  leadMode: 'zen', // 'zen' | 'versus' | 'swap'

  // Auth & Benutzerkonto
  authMode: 'login', // 'login' | 'register'
  authEmail: null,

  // Audio & Soundtrack (KI Tracks & Web Audio Synth)
  audioPlaying: false,
  audioContext: null,
  audioMasterGain: null,
  ambientChordTimer: null,
  ambientChordIndex: 0,
  activeVoices: [],
  currentAudioTrack: 'synth', // 'zen' | 'lofi' | 'synth'
  audioVolume: 0.6,
  audioElement: null,

  // Sudoku Board Arrays (Länge 81)
  solution: Array(81).fill(0),
  initialBoard: Array(81).fill(0),
  currentBoard: Array(81).fill(0),
  notes: Array.from({ length: 81 }, () => new Set()),
  savedNotes: Array.from({ length: 81 }, () => new Set()),
  wrongNotes: Array.from({ length: 81 }, () => new Set()),
  
  selectedIndex: null,
  notesActive: false,
  hintsRemaining: 3,
  autoLockCompleted: false, // Erlaubt Weiterklicken auch wenn 9 Ziffern platziert sind

  // Realtime
  channel: null,
  roomCode: null,
  isHost: false,
  peersCount: 0,
  
  // Swap Timer
  swapTimerId: null,
  swapSecondsLeft: 10,

  // Bot State
  botIntervalId: null,
  botBoard: Array(81).fill(0),
  botInitial: Array(81).fill(0),
  botSolution: Array(81).fill(0)
};

// =============================================================================
// SUDOKU GENERATOR (STRIKTE EINDEUTIGKEITS-GARANTIE, KEINE DEADLY PATTERNS)
// =============================================================================
class SudokuEngine {
  static countSolutions(board, limit = 2) {
    let count = 0;
    function solveRec(b) {
      if (count >= limit) return;
      let minCandidates = 10;
      let bestIdx = -1;
      let bestCandidates = null;

      for (let i = 0; i < 81; i++) {
        if (b[i] === 0) {
          const r = Math.floor(i / 9);
          const c = i % 9;
          const candidates = [];
          for (let n = 1; n <= 9; n++) {
            if (SudokuEngine.isValid(b, r, c, n)) {
              candidates.push(n);
            }
          }
          if (candidates.length === 0) return; // Widerspruch
          if (candidates.length < minCandidates) {
            minCandidates = candidates.length;
            bestCandidates = candidates;
            bestIdx = i;
            if (minCandidates === 1) break; // MRV Optimum
          }
        }
      }

      if (bestIdx === -1) {
        count++;
        return;
      }

      for (const num of bestCandidates) {
        b[bestIdx] = num;
        solveRec(b);
        b[bestIdx] = 0;
        if (count >= limit) return;
      }
    }

    solveRec([...board]);
    return count;
  }

  static generate(clues = 34) {
    const board = Array(81).fill(0);
    this.fillBoxes(board);
    this.solve(board);
    const solution = [...board];

    const puzzle = [...solution];
    let toRemove = 81 - clues;

    const rowCounts = Array(9).fill(9);
    const colCounts = Array(9).fill(9);
    const boxCounts = Array(9).fill(9);

    const minPerUnit = clues >= 38 ? 3 : 2;
    const indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);

    for (const idx of indices) {
      if (toRemove <= 0) break;
      const r = Math.floor(idx / 9);
      const c = idx % 9;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      if (rowCounts[r] > minPerUnit && colCounts[c] > minPerUnit && boxCounts[b] > minPerUnit) {
        const prev = puzzle[idx];
        puzzle[idx] = 0;
        // Strikte Eindeutigkeit: Rätsel darf NIEMALS 2 Lösungen haben
        if (this.countSolutions(puzzle, 2) === 1) {
          rowCounts[r]--;
          colCounts[c]--;
          boxCounts[b]--;
          toRemove--;
        } else {
          puzzle[idx] = prev;
        }
      }
    }

    if (toRemove > 0) {
      for (const idx of indices) {
        if (toRemove <= 0) break;
        if (puzzle[idx] === 0) continue;
        const r = Math.floor(idx / 9);
        const c = idx % 9;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);

        if (boxCounts[b] > 2 && rowCounts[r] > 1 && colCounts[c] > 1) {
          const prev = puzzle[idx];
          puzzle[idx] = 0;
          if (this.countSolutions(puzzle, 2) === 1) {
            rowCounts[r]--;
            colCounts[c]--;
            boxCounts[b]--;
            toRemove--;
          } else {
            puzzle[idx] = prev;
          }
        }
      }
    }

    return { solution, initialBoard: puzzle };
  }

  static fillBoxes(b) {
    for (let box = 0; box < 9; box += 3) {
      const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
      let i = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          b[(box + r) * 9 + (box + c)] = nums[i++];
        }
      }
    }
  }

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
            b[i] = 0;
          }
        }
        return false;
      }
    }
    return true;
  }

  static getProgress(current, initial, solution) {
    let emptyCount = 0;
    let correctlyFilled = 0;

    for (let i = 0; i < 81; i++) {
      if (initial[i] === 0) {
        emptyCount++;
        if (current[i] !== 0 && current[i] === solution[i]) {
          correctlyFilled++;
        }
      }
    }

    if (emptyCount === 0) return 100;
    return Math.round((correctlyFilled / emptyCount) * 100);
  }

  static isComplete(current, solution) {
    for (let i = 0; i < 81; i++) {
      if (current[i] === 0 || current[i] !== solution[i]) return false;
    }
    return true;
  }

  static getCompletedDigits(current, solution) {
    const counts = {};
    for (let d = 1; d <= 9; d++) counts[d] = 0;

    for (let i = 0; i < 81; i++) {
      if (current[i] !== 0 && current[i] === solution[i]) {
        counts[current[i]]++;
      }
    }

    const completed = new Set();
    for (let d = 1; d <= 9; d++) {
      if (counts[d] === 9) completed.add(d);
    }
    return completed;
  }
}

// =============================================================================
// DOM REFERENZEN
// =============================================================================
const dom = {
  root: document.documentElement,
  langToggleBtn: document.getElementById('langToggleBtn'),
  langLabel: document.getElementById('langLabel'),
  audioToggleBtn: document.getElementById('audioToggleBtn'),
  audioToggleIcon: document.getElementById('audioToggleIcon'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeToggleIcon: document.getElementById('themeToggleIcon'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  openAccountBtn: document.getElementById('openAccountBtn'),
  openShop: document.getElementById('openShopBtn'),
  themeBtnText: document.getElementById('themeBtnText'),
  closeShop: document.getElementById('closeShopBtn'),
  shopModal: document.getElementById('themeModal'),
  themesList: document.getElementById('themesContainer'),
  
  // Leaderboard Modal
  leaderboardModal: document.getElementById('leaderboardModal'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  leadModalTitle: document.getElementById('leadModalTitle'),
  leadModeTabs: document.getElementById('leadModeTabs'),
  leadModeZen: document.getElementById('leadModeZen'),
  leadModeVersus: document.getElementById('leadModeVersus'),
  leadModeSwap: document.getElementById('leadModeSwap'),
  leadTabEasy: document.getElementById('leadTabEasy'),
  leadTabMedium: document.getElementById('leadTabMedium'),
  leadTabHard: document.getElementById('leadTabHard'),
  myRankInfo: document.getElementById('myRankInfo'),
  myRankLabel: document.getElementById('myRankLabel'),
  myRankTime: document.getElementById('myRankTime'),
  thRank: document.getElementById('thRank'),
  thPlayer: document.getElementById('thPlayer'),
  thBestTime: document.getElementById('thBestTime'),
  leaderboardBody: document.getElementById('leaderboardBody'),
  
  // Account Modal
  accountModal: document.getElementById('accountModal'),
  closeAccountBtn: document.getElementById('closeAccountBtn'),
  accountModalTitle: document.getElementById('accountModalTitle'),
  usernameLabel: document.getElementById('usernameLabel'),
  usernameInput: document.getElementById('usernameInput'),
  btnSaveUsername: document.getElementById('btnSaveUsername'),
  accountBestTimeLabel: document.getElementById('accountBestTimeLabel'),
  accountBestTimeVal: document.getElementById('accountBestTimeVal'),
  accountThemeLabel: document.getElementById('accountThemeLabel'),
  accountThemeVal: document.getElementById('accountThemeVal'),
  accountStatusLabel: document.getElementById('accountStatusLabel'),
  accountAuthStatus: document.getElementById('accountAuthStatus'),
  authLoggedInSection: document.getElementById('authLoggedInSection'),
  authLoggedInEmail: document.getElementById('authLoggedInEmail'),
  btnLogout: document.getElementById('btnLogout'),
  authGuestSection: document.getElementById('authGuestSection'),
  tabAuthLogin: document.getElementById('tabAuthLogin'),
  tabAuthRegister: document.getElementById('tabAuthRegister'),
  authForm: document.getElementById('authForm'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  btnAuthSubmit: document.getElementById('btnAuthSubmit'),
  authStatusMsg: document.getElementById('authStatusMsg'),

  // Regeln & Legal Modals
  rulesModal: document.getElementById('rulesModal'),
  closeRulesBtn: document.getElementById('closeRulesBtn'),
  rulesModalTitle: document.getElementById('rulesModalTitle'),
  rulesModalText: document.getElementById('rulesModalText'),
  helpModeBtn: document.getElementById('helpModeBtn'),
  impressumModal: document.getElementById('impressumModal'),
  closeImpressumBtn: document.getElementById('closeImpressumBtn'),
  openImpressumLink: document.getElementById('openImpressumLink'),
  datenschutzModal: document.getElementById('datenschutzModal'),
  closeDatenschutzBtn: document.getElementById('closeDatenschutzBtn'),
  openDatenschutzLink: document.getElementById('openDatenschutzLink'),

  // Modi & Schwierigkeitsgrade
  tabZen: document.getElementById('tabZen'),
  tabVersus: document.getElementById('tabVersus'),
  tabSwap: document.getElementById('tabSwap'),
  zenDifficultyBar: document.getElementById('zenDifficultyBar'),
  zenDiffEasy: document.getElementById('zenDiffEasy'),
  zenDiffMedium: document.getElementById('zenDiffMedium'),
  zenDiffHard: document.getElementById('zenDiffHard'),
  
  // Versus Rätsel & Bot
  versusDiffLabel: document.getElementById('versusDiffLabel'),
  versusDiffEasy: document.getElementById('versusDiffEasy'),
  versusDiffMedium: document.getElementById('versusDiffMedium'),
  versusDiffHard: document.getElementById('versusDiffHard'),
  botSpeedLabel: document.getElementById('botSpeedLabel'),
  diffEasy: document.getElementById('diffEasy'),
  diffMedium: document.getElementById('diffMedium'),
  diffHard: document.getElementById('diffHard'),
  btnStartBotGame: document.getElementById('btnStartBotGame'),

  // Lobby
  lobby: document.getElementById('multiplayerLobby'),
  btnPlayOnline: document.getElementById('btnPlayOnline'),
  btnPlayBot: document.getElementById('btnPlayBot'),
  onlineSection: document.getElementById('onlineSection'),
  botSection: document.getElementById('botSection'),
  createRoom: document.getElementById('createRoomBtn'),
  joinRoom: document.getElementById('joinRoomBtn'),
  roomInput: document.getElementById('roomCodeInput'),
  roomDisplay: document.getElementById('roomCodeDisplay'),
  currentRoom: document.getElementById('currentRoomCode'),
  connDot: document.getElementById('connDot'),
  connText: document.getElementById('connText'),

  // HUD & Grid
  gameHud: document.getElementById('gameHud'),
  heartsWrap: document.getElementById('heartsWrap'),
  heartsDisplay: document.getElementById('heartsDisplay'),
  gameTimerWrap: document.getElementById('gameTimerWrap'),
  gameTimerDisplay: document.getElementById('gameTimerDisplay'),
  btnPauseGame: document.getElementById('btnPauseGame'),
  pauseBtnIcon: document.getElementById('pauseBtnIcon'),
  versusBars: document.getElementById('versusBars'),
  playerLabelText: document.getElementById('playerLabelText'),
  playerBar: document.getElementById('playerProgressBar'),
  opponentBar: document.getElementById('opponentProgressBar'),
  playerLabel: document.getElementById('playerProgressLabel'),
  opponentLabel: document.getElementById('opponentProgressLabel'),
  opponentLabelText: document.getElementById('opponentLabelText'),
  swapBox: document.getElementById('swapTimerBox'),
  swapBoardBadge: document.getElementById('swapBoardBadge'),
  swapTimer: document.getElementById('swapTimer'),
  swapPartnerLabel: document.getElementById('swapPartnerLabel'),
  grid: document.getElementById('sudokuGrid'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  pauseOverlayTitle: document.getElementById('pauseOverlayTitle'),
  pauseOverlayDesc: document.getElementById('pauseOverlayDesc'),
  btnResumeGame: document.getElementById('btnResumeGame'),

  // Board Result Overlay
  boardResultOverlay: document.getElementById('boardResultOverlay'),
  boardResultCard: document.getElementById('boardResultCard'),
  resultBadge: document.getElementById('resultBadge'),
  resultTitle: document.getElementById('resultTitle'),
  resultDesc: document.getElementById('resultDesc'),
  resStatTimeLbl: document.getElementById('resStatTimeLbl'),
  resStatTimeVal: document.getElementById('resStatTimeVal'),
  resStatDiffLbl: document.getElementById('resStatDiffLbl'),
  resStatDiffVal: document.getElementById('resStatDiffVal'),
  btnResultNewGame: document.getElementById('btnResultNewGame'),
  btnResultSolution: document.getElementById('btnResultSolution'),
  btnResultInspect: document.getElementById('btnResultInspect'),

  // HUD Result Bar (Wiederaufrufen nach Feld-Inspektion)
  hudResultBar: document.getElementById('hudResultBar'),
  btnHudReopen: document.getElementById('btnHudReopen'),
  hudReopenIcon: document.getElementById('hudReopenIcon'),
  hudReopenText: document.getElementById('hudReopenText'),
  btnHudSolution: document.getElementById('btnHudSolution'),
  hudSolutionText: document.getElementById('hudSolutionText'),

  // Steuerung & Ziffern
  btnNotes: document.getElementById('btnNotes'),
  btnHint: document.getElementById('btnHint'),
  hintCount: document.getElementById('hintCount'),
  btnErase: document.getElementById('btnErase'),
  btnNewGame: document.getElementById('btnNewGame'),
  numpad: document.getElementById('numpad'),
  toast: document.getElementById('toast'),

  // Audio Modal
  audioModal: document.getElementById('audioModal'),
  closeAudioBtn: document.getElementById('closeAudioBtn'),
  btnAudioTogglePlay: document.getElementById('btnAudioTogglePlay'),
  audioStatusText: document.getElementById('audioStatusText'),
  audioTrackList: document.getElementById('audioTrackList'),
  audioVolumeSlider: document.getElementById('audioVolumeSlider'),
  volValue: document.getElementById('volValue')
};

// =============================================================================
// I18N HELPER & LOGIK
// =============================================================================
function t(key) {
  const dict = I18N[state.currentLang] || I18N.de;
  return dict[key] || key;
}

function toggleLanguage() {
  const next = state.currentLang === 'de' ? 'en' : 'de';
  setLanguage(next);
}

function setLanguage(lang) {
  state.currentLang = lang;
  localStorage.setItem('swapdoku_lang', lang);
  if (dom.langLabel) dom.langLabel.textContent = lang.toUpperCase();
  applyLanguageToDOM();
}

function applyLanguageToDOM() {
  const lang = state.currentLang;
  const d = I18N[lang] || I18N.de;

  // Header
  if (dom.langToggleBtn) dom.langToggleBtn.setAttribute('title', d.langTitle);
  if (dom.audioToggleBtn) dom.audioToggleBtn.setAttribute('title', d.audioTitle);
  if (dom.themeToggleBtn) dom.themeToggleBtn.setAttribute('title', d.themeToggleTitle);
  if (dom.openAccountBtn) dom.openAccountBtn.setAttribute('title', d.accountTitle);
  if (dom.themeBtnText) dom.themeBtnText.textContent = d.themesBtn;

  // HUD Tooltips & Labels
  if (dom.heartsWrap) dom.heartsWrap.setAttribute('title', d.heartsTitle);
  if (dom.gameTimerWrap) dom.gameTimerWrap.setAttribute('title', d.timerTitle);
  updatePauseBtnTitle();
  if (dom.playerLabelText) dom.playerLabelText.textContent = d.playerLabel;
  updateOpponentLabels();

  // Modi Tabs
  if (dom.tabZen) dom.tabZen.textContent = d.modeZen;
  if (dom.tabVersus) dom.tabVersus.textContent = d.modeVersus;
  if (dom.tabSwap) dom.tabSwap.textContent = d.modeSwap;
  if (dom.helpModeBtn) dom.helpModeBtn.setAttribute('title', d.modeHelpTitle);

  // Zen Schwierigkeiten
  if (dom.zenDiffEasy) dom.zenDiffEasy.textContent = d.zenEasy;
  if (dom.zenDiffMedium) dom.zenDiffMedium.textContent = d.zenMedium;
  if (dom.zenDiffHard) dom.zenDiffHard.textContent = d.zenHard;

  // Versus Rätsel & Bot
  if (dom.versusDiffLabel) dom.versusDiffLabel.textContent = d.versusDiffLabel;
  if (dom.versusDiffEasy) dom.versusDiffEasy.textContent = d.versusEasy;
  if (dom.versusDiffMedium) dom.versusDiffMedium.textContent = d.versusMedium;
  if (dom.versusDiffHard) dom.versusDiffHard.textContent = d.versusHard;

  if (dom.botSpeedLabel) dom.botSpeedLabel.textContent = d.botSpeedLabel;
  if (dom.diffEasy) dom.diffEasy.textContent = d.diffEasy;
  if (dom.diffMedium) dom.diffMedium.textContent = d.diffMedium;
  if (dom.diffHard) dom.diffHard.textContent = d.diffHard;
  if (dom.btnStartBotGame) dom.btnStartBotGame.textContent = d.btnStartBotGame;

  // Lobby
  if (dom.btnPlayOnline) dom.btnPlayOnline.textContent = d.btnPlayOnline;
  if (dom.btnPlayBot) dom.btnPlayBot.textContent = d.btnPlayBot;
  if (dom.createRoom) dom.createRoom.textContent = d.createRoomBtn;
  if (dom.joinRoom) dom.joinRoom.textContent = d.joinRoomBtn;
  if (dom.roomInput) dom.roomInput.setAttribute('placeholder', d.roomInputPlaceholder);

  // Steuerung
  if (dom.btnNotes) dom.btnNotes.textContent = state.notesActive ? d.notesOn : d.notesOff;
  if (dom.btnHint) {
    dom.btnHint.innerHTML = `${d.btnHint} (<span id="hintCount">${state.hintsRemaining}</span>)`;
    dom.hintCount = document.getElementById('hintCount');
  }
  if (dom.btnErase) dom.btnErase.textContent = d.erase;
  if (dom.btnNewGame) dom.btnNewGame.setAttribute('title', d.newGameTitle || `${d.newGame} (↻)`);

  // Bot vs Partner Labels
  updateBotPartnerDifficultyLabels();

  // Pause Overlay
  if (dom.pauseOverlayTitle) dom.pauseOverlayTitle.textContent = d.pauseOverlayTitle;
  if (dom.pauseOverlayDesc) dom.pauseOverlayDesc.textContent = d.pauseOverlayDesc;
  if (dom.btnResumeGame) dom.btnResumeGame.textContent = d.resumeBtn;

  // Result Overlay
  if (dom.resStatTimeLbl) dom.resStatTimeLbl.textContent = d.resStatTime;
  if (dom.resStatDiffLbl) dom.resStatDiffLbl.textContent = d.resStatDiff;
  if (dom.btnResultNewGame) dom.btnResultNewGame.textContent = d.resBtnNewGame;
  if (dom.btnResultSolution) dom.btnResultSolution.textContent = d.resBtnSolution;
  if (dom.btnResultInspect) dom.btnResultInspect.textContent = d.resBtnInspect;
  if (dom.hudReopenText) dom.hudReopenText.textContent = d.resBtnReopen || 'Ergebnis & Stats';
  if (dom.hudSolutionText) dom.hudSolutionText.textContent = d.resBtnSolution || 'Lösung anzeigen';

  // Leaderboard Modal
  if (dom.leadModalTitle) dom.leadModalTitle.textContent = d.leadModalTitle;
  if (dom.leadTabEasy) dom.leadTabEasy.textContent = d.leadTabEasy;
  if (dom.leadTabMedium) dom.leadTabMedium.textContent = d.leadTabMedium;
  if (dom.leadTabHard) dom.leadTabHard.textContent = d.leadTabHard;
  if (dom.myRankLabel) dom.myRankLabel.textContent = d.myRankLabel;
  if (dom.thRank) dom.thRank.textContent = d.thRank;
  if (dom.thPlayer) dom.thPlayer.textContent = d.thPlayer;
  if (dom.thBestTime) dom.thBestTime.textContent = d.thBestTime;

  // Account Modal
  if (dom.accountModalTitle) dom.accountModalTitle.textContent = d.accountModalTitle;
  if (dom.usernameLabel) dom.usernameLabel.textContent = d.usernameLabel;
  if (dom.usernameInput) dom.usernameInput.setAttribute('placeholder', d.usernamePlaceholder);
  if (dom.btnSaveUsername) dom.btnSaveUsername.textContent = d.saveBtn;
  if (dom.accountBestTimeLabel) dom.accountBestTimeLabel.textContent = d.bestTimeLabel;
  if (dom.accountThemeLabel) dom.accountThemeLabel.textContent = d.activeThemeLabel;
  if (dom.accountStatusLabel) dom.accountStatusLabel.textContent = d.statusLabel;
  if (dom.btnLogout) dom.btnLogout.textContent = d.logoutBtn;
  if (dom.tabAuthLogin) dom.tabAuthLogin.textContent = d.tabLogin;
  if (dom.tabAuthRegister) dom.tabAuthRegister.textContent = d.tabRegister;
  if (dom.authPassword) dom.authPassword.setAttribute('placeholder', d.passwordPlaceholder);
  if (dom.btnAuthSubmit) dom.btnAuthSubmit.textContent = state.authMode === 'login' ? d.btnSubmitLogin : d.btnSubmitRegister;

  // Footer Links
  if (dom.openImpressumLink) dom.openImpressumLink.textContent = d.imprintLink;
  if (dom.openDatenschutzLink) dom.openDatenschutzLink.textContent = d.privacyLink;

  renderHearts();
  renderThemeShop();
  updateAccountUI();
}

function updatePauseBtnTitle() {
  if (!dom.btnPauseGame) return;
  const d = I18N[state.currentLang] || I18N.de;
  if (!state.gameStarted) {
    dom.btnPauseGame.setAttribute('title', d.playTitle);
  } else if (state.isPaused) {
    dom.btnPauseGame.setAttribute('title', d.resumeTitle);
  } else {
    dom.btnPauseGame.setAttribute('title', d.pauseTitle);
  }
}

function updateBotPartnerDifficultyLabels() {
  const d = I18N[state.currentLang] || I18N.de;
  if (state.mode === 'swap') {
    if (dom.botSpeedLabel) dom.botSpeedLabel.textContent = d.partnerSpeedLabel || 'Partner-Stufe:';
    if (dom.diffEasy) dom.diffEasy.textContent = d.partnerEasy || 'Entspannt';
    if (dom.diffMedium) dom.diffMedium.textContent = d.partnerMedium || 'Verlässlich';
    if (dom.diffHard) dom.diffHard.textContent = d.partnerHard || 'Profi';
  } else {
    if (dom.botSpeedLabel) dom.botSpeedLabel.textContent = d.botSpeedLabel || 'Bot-Stufe:';
    if (dom.diffEasy) dom.diffEasy.textContent = d.diffEasy || 'Leicht';
    if (dom.diffMedium) dom.diffMedium.textContent = d.diffMedium || 'Mittel';
    if (dom.diffHard) dom.diffHard.textContent = d.diffHard || 'Schwer';
  }
}

// =============================================================================
// INITIALISIERUNG
// =============================================================================
async function init() {
  buildGrid();
  loadLocalState();
  bindEvents();
  setLanguage(state.currentLang);
  startNewGame(); // Sofortiges Erzeugen & Rendern des Rätsels ohne Wartezeit
  initAuth();     // Läuft im Hintergrund ohne Blockieren des Spielfelds
}

function buildGrid() {
  dom.grid.innerHTML = '';
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;

    const valSpan = document.createElement('span');
    valSpan.className = 'val';
    cell.appendChild(valSpan);

    const notesDiv = document.createElement('div');
    notesDiv.className = 'notes';
    for (let n = 1; n <= 9; n++) {
      const noteSpan = document.createElement('span');
      notesDiv.appendChild(noteSpan);
    }
    cell.appendChild(notesDiv);

    cell.addEventListener('click', () => selectCell(i));
    dom.grid.appendChild(cell);
  }
}

// =============================================================================
// AUTHENTIFIZIERUNG & LOKALER SPEICHER
// =============================================================================
async function initAuth() {
  try {
    const savedLocalEmail = localStorage.getItem('swapdoku_auth_email');
    if (savedLocalEmail) {
      state.authEmail = savedLocalEmail;
    }

    if (window.supabase && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes('xyzcompany')) {
      state.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      const { data: { session } } = await state.supabase.auth.getSession();
      if (session) {
        state.user = session.user;
        state.authEmail = session.user.email || null;
        await syncProfileFromDB();
      }
    } else {
      state.isOffline = true;
    }
  } catch (e) {
    state.isOffline = true;
  }
  updateAccountUI();
}

async function syncProfileFromDB() {
  if (!state.supabase || !state.user) return;
  try {
    const { data } = await state.supabase.from('profiles').select('username, active_theme').eq('id', state.user.id).single();
    if (data) {
      state.profile.username = data.username || 'Spieler';
      state.profile.active_theme = data.active_theme || 'nordic-light';
    }
    setTheme(state.profile.active_theme);
    updateAccountUI();
  } catch (_) {}
}

function loadLocalState() {
  const savedEmail = localStorage.getItem('swapdoku_auth_email');
  if (savedEmail) {
    state.authEmail = savedEmail;
    const accounts = JSON.parse(localStorage.getItem('swapdoku_saved_profiles') || '{}');
    if (accounts[savedEmail]) {
      state.profile = { ...state.profile, ...accounts[savedEmail] };
    }
  } else {
    const saved = localStorage.getItem('swapdoku_state');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        state.profile = { ...state.profile, ...parsed };
      } catch (_) {}
    }
  }
  setTheme(state.profile.active_theme);
}

function saveLocalState() {
  localStorage.setItem('swapdoku_state', JSON.stringify(state.profile));
  if (state.authEmail) {
    const accounts = JSON.parse(localStorage.getItem('swapdoku_saved_profiles') || '{}');
    accounts[state.authEmail] = {
      username: state.profile.username,
      active_theme: state.profile.active_theme
    };
    localStorage.setItem('swapdoku_saved_profiles', JSON.stringify(accounts));
  }
}

// =============================================================================
// TIMER, READY-STATE & PAUSE ENGINE
// =============================================================================
function ensureGameStarted() {
  if (state.gameStarted || state.isGameOver) return;
  state.gameStarted = true;
  startStopwatch(false);
  dom.pauseBtnIcon.textContent = '⏸';
  updatePauseBtnTitle();

  if (state.mode === 'versus' && state.opponentType === 'bot' && !state.botRunning) {
    startBotMatch();
  } else if (state.mode === 'swap') {
    startSwapCountdown();
  }
}

function startStopwatch(reset = true) {
  stopStopwatch();
  if (reset) {
    state.gameSeconds = 0;
  }
  updateStopwatchDisplay();

  state.gameTimerInterval = setInterval(() => {
    state.gameSeconds++;
    updateStopwatchDisplay();
  }, 1000);
}

function pauseStopwatch() {
  if (state.gameTimerInterval) {
    clearInterval(state.gameTimerInterval);
    state.gameTimerInterval = null;
  }
}

function resumeStopwatch() {
  if (!state.gameTimerInterval) {
    state.gameTimerInterval = setInterval(() => {
      state.gameSeconds++;
      updateStopwatchDisplay();
    }, 1000);
  }
}

function stopStopwatch() {
  if (state.gameTimerInterval) {
    clearInterval(state.gameTimerInterval);
    state.gameTimerInterval = null;
  }
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
  dom.gameTimerDisplay.textContent = formatTime(state.gameSeconds);
}

function togglePause() {
  if (state.isGameOver) return;
  if (!state.gameStarted) {
    ensureGameStarted();
    return;
  }
  if (state.isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

function pauseGame() {
  if (state.isPaused || state.isGameOver || !state.gameStarted) return;
  state.isPaused = true;
  pauseStopwatch();
  if (dom.grid) dom.grid.classList.add('paused');
  if (dom.pauseOverlay) dom.pauseOverlay.classList.remove('hidden');
  if (dom.pauseBtnIcon) dom.pauseBtnIcon.textContent = '▶';
  updatePauseBtnTitle();
  state.selectedIndex = null;
  render();
  toast(t('toastGamePaused'));
}

function resumeGame() {
  if (!state.isPaused) return;
  state.isPaused = false;
  resumeStopwatch();
  if (dom.grid) dom.grid.classList.remove('paused');
  if (dom.pauseOverlay) dom.pauseOverlay.classList.add('hidden');
  if (dom.pauseBtnIcon) dom.pauseBtnIcon.textContent = '⏸';
  updatePauseBtnTitle();
  toast(t('toastGameResumed'));
}

// =============================================================================
// AUDIO ENGINE: KI-TRACKS (GOOGLE AI STUDIO) & PROZEDURALER SYNTHESIZER
// =============================================================================
function openAudioModal() {
  if (dom.audioModal) dom.audioModal.classList.remove('hidden');
  updateAudioModalUI();
}

function closeAudioModal() {
  if (dom.audioModal) dom.audioModal.classList.add('hidden');
}

function updateAudioModalUI() {
  const d = I18N[state.currentLang] || I18N.de;
  if (dom.btnAudioTogglePlay) {
    dom.btnAudioTogglePlay.textContent = state.audioPlaying ? (d.audioPause || 'Musik pausieren') : (d.audioPlay || 'Musik starten');
  }
  if (dom.audioStatusText) {
    dom.audioStatusText.textContent = state.audioPlaying ? (d.audioStatusPlaying || 'Wiedergabe: Aktiv') : (d.audioStatusPaused || 'Wiedergabe: Inaktiv');
  }
  if (dom.audioTrackList) {
    const trackBtns = dom.audioTrackList.querySelectorAll('.track-item');
    trackBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.track === state.currentAudioTrack);
    });
  }
  if (dom.audioVolumeSlider) {
    dom.audioVolumeSlider.value = Math.round(state.audioVolume * 100);
  }
  if (dom.volValue) {
    dom.volValue.textContent = `${Math.round(state.audioVolume * 100)}%`;
  }
}

function setAudioTrack(trackId) {
  state.currentAudioTrack = trackId;
  updateAudioModalUI();
  if (state.audioPlaying) {
    stopAmbientSound();
    startAmbientSound();
  }
}

function setAudioVolume(vol) {
  state.audioVolume = Math.max(0, Math.min(1, vol));
  if (dom.volValue) dom.volValue.textContent = `${Math.round(state.audioVolume * 100)}%`;
  if (state.audioMasterGain && state.audioContext) {
    state.audioMasterGain.gain.setValueAtTime(0.06 * state.audioVolume, state.audioContext.currentTime);
  }
  if (state.audioElement) {
    state.audioElement.volume = state.audioVolume;
  }
}

function toggleAmbientSound() {
  if (state.audioPlaying) {
    stopAmbientSound();
  } else {
    startAmbientSound();
  }
}

function startAmbientSound() {
  // Wenn ein KI-Track gewählt ist, versuchen wir die MP3-Audiodatei abzuspielen
  if (state.currentAudioTrack === 'zen' || state.currentAudioTrack === 'lofi') {
    try {
      if (!state.audioElement) {
        state.audioElement = new Audio();
        state.audioElement.loop = true;
      }
      const trackSrc = state.currentAudioTrack === 'zen' ? 'audio/ai_zen_garden.mp3' : 'audio/midnight_lofi.mp3';
      state.audioElement.src = trackSrc;
      state.audioElement.volume = state.audioVolume;
      const playPromise = state.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          state.audioPlaying = true;
          dom.audioToggleBtn.classList.add('active');
          updateAudioModalUI();
          toast(t('toastMusicOn'));
        }).catch(() => {
          // Fallback zum prozeduralen Web Audio Synthesizer, falls MP3 nicht vorhanden ist
          startProceduralSynth();
        });
        return;
      }
    } catch (_) {
      startProceduralSynth();
      return;
    }
  }

  startProceduralSynth();
}

function startProceduralSynth() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!state.audioContext) {
      state.audioContext = new AudioContextClass();
    }
    
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    state.audioMasterGain = state.audioContext.createGain();
    state.audioMasterGain.gain.setValueAtTime(0.06 * state.audioVolume, state.audioContext.currentTime);
    state.audioMasterGain.connect(state.audioContext.destination);

    // Warm Rhodes / Lofi Akkordprogression (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    const CHORDS = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7
    ];

    state.ambientChordIndex = 0;
    playLofiChord(CHORDS[state.ambientChordIndex]);

    state.ambientChordTimer = setInterval(() => {
      if (!state.audioPlaying) return;
      state.ambientChordIndex = (state.ambientChordIndex + 1) % CHORDS.length;
      playLofiChord(CHORDS[state.ambientChordIndex]);
    }, 4800);

    state.audioPlaying = true;
    dom.audioToggleBtn.classList.add('active');
    updateAudioModalUI();
    toast(t('toastMusicOn'));
  } catch (err) {
    console.warn('Lofi-Audio Init:', err);
  }
}

function playLofiChord(notes) {
  if (!state.audioContext || !state.audioPlaying) return;

  const now = state.audioContext.currentTime;
  const duration = 4.7;

  // Lofi Filter
  const filter = state.audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(420, now);
  filter.Q.setValueAtTime(0.7, now);
  filter.connect(state.audioMasterGain);

  notes.forEach((freq, idx) => {
    const osc = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();

    osc.type = (idx % 2 === 0) ? 'triangle' : 'sine';
    // Subtiles Detune für warmen Tape/Vinyl Schwebungseffekt
    const detune = (Math.random() - 0.5) * 8;
    osc.frequency.setValueAtTime(freq + detune * 0.05, now);

    // Sanfte Lofi Hüllkurve (weicher Attack, langes Ausklingen)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + duration);
    state.activeVoices.push(osc);
  });
}

function stopAmbientSound() {
  if (state.audioElement) {
    try {
      state.audioElement.pause();
      state.audioElement.currentTime = 0;
    } catch (_) {}
  }
  if (state.ambientChordTimer) {
    clearInterval(state.ambientChordTimer);
    state.ambientChordTimer = null;
  }
  if (state.activeVoices) {
    state.activeVoices.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (_) {}
    });
    state.activeVoices = [];
  }
  state.audioPlaying = false;
  dom.audioToggleBtn.classList.remove('active');
  updateAudioModalUI();
  toast(t('toastMusicOff'));
}

// =============================================================================
// STERNE & LEBENSZEICHEN (✦ AKTIV, ✧ VERLOREN)
// =============================================================================
function setupHeartsForDifficulty() {
  state.maxHearts = 3;
  state.currentHearts = state.maxHearts;
  state.isGameOver = false;
  renderHearts();
}

function renderHearts() {
  let str = '';
  for (let i = 0; i < state.maxHearts; i++) {
    str += (i < state.currentHearts) ? '✦' : '✧';
  }
  dom.heartsDisplay.textContent = str;
}

function deductHeart() {
  if (state.currentHearts > 0) {
    state.currentHearts--;
    renderHearts();
  }

  if (state.currentHearts <= 0) {
    handleGameOver();
  }
}

function handleGameOver() {
  state.isGameOver = true;
  stopBot();
  stopSwapCountdown();
  stopStopwatch();
  showResultOverlay(false);
}

// =============================================================================
// SPIELABLAUF & RENDERING
// =============================================================================
function getCluesForZenDifficulty() {
  switch (state.zenDifficulty) {
    case 'easy': return 42;   // Sehr großzügig: 42 Zahlen sofort sichtbar & entspannt
    case 'hard': return 28;   // Anspruchsvoll
    case 'medium':
    default: return 34;
  }
}

function getCluesForVersusDifficulty() {
  switch (state.versusDifficulty) {
    case 'easy': return 40;
    case 'hard': return 28;
    case 'medium':
    default: return 34;
  }
}

function startNewGame(customBoard = null, customSol = null) {
  if (state.isPaused) resumeGame();
  stopSwapCountdown();
  stopBot();
  stopStopwatch();
  
  state.gameStarted = false;
  state.isGameOver = false;
  state.gameSeconds = 0;
  updateStopwatchDisplay();
  dom.pauseBtnIcon.textContent = '▶';
  updatePauseBtnTitle();

  setupHeartsForDifficulty();

  // Co-Op Swap Board A (Blau) als Startboard setzen
  if (state.mode === 'swap') {
    state.activeBoard = 'A';
    dom.grid.classList.add('board-theme-a');
    dom.grid.classList.remove('board-theme-b');
    dom.swapBoardBadge.textContent = 'Board A';
    dom.swapBoardBadge.className = 'board-badge badge-blue';
  } else {
    dom.grid.classList.remove('board-theme-a', 'board-theme-b');
  }

  if (customBoard && customSol) {
    state.initialBoard = [...customBoard];
    state.currentBoard = [...customBoard];
    state.solution = [...customSol];
  } else {
    let clues = 34;
    if (state.mode === 'zen') {
      clues = getCluesForZenDifficulty();
    } else if (state.mode === 'versus') {
      clues = getCluesForVersusDifficulty();
    }
    const { solution, initialBoard } = SudokuEngine.generate(clues);
    state.solution = solution;
    state.initialBoard = [...initialBoard];
    state.currentBoard = [...initialBoard];
  }

  state.notes = Array.from({ length: 81 }, () => new Set());
  state.savedNotes = Array.from({ length: 81 }, () => new Set());
  state.wrongNotes = Array.from({ length: 81 }, () => new Set());
  state.hintsRemaining = 3;
  if (dom.hintCount) dom.hintCount.textContent = '3';
  if (dom.boardResultOverlay) dom.boardResultOverlay.classList.add('hidden');
  if (dom.hudResultBar) dom.hudResultBar.classList.add('hidden');
  state.selectedIndex = null;

  updateProgressBars(0, 0);
  render();
  updateNumpadCompletedState();
}

function render() {
  const cells = dom.grid.children;
  for (let i = 0; i < 81; i++) {
    const cell = cells[i];
    const val = state.currentBoard[i];
    const isGiven = state.initialBoard[i] !== 0;

    cell.className = 'cell';
    if (isGiven) cell.classList.add('given');
    if (state.selectedIndex === i) cell.classList.add('selected');

    const valSpan = cell.querySelector('.val');
    const notesDiv = cell.querySelector('.notes');

    if (val !== 0) {
      valSpan.textContent = val;
      valSpan.style.display = 'block';
      notesDiv.style.display = 'none';

      if (!isGiven && val !== state.solution[i]) {
        cell.classList.add('error');
      }
    } else {
      valSpan.textContent = '';
      valSpan.style.display = 'none';

      const cellNotes = state.notes[i];
      if (cellNotes && cellNotes.size > 0) {
        notesDiv.style.display = 'grid';
        for (let n = 1; n <= 9; n++) {
          const noteSpan = notesDiv.children[n - 1];
          const hasNote = cellNotes.has(n);
          noteSpan.textContent = hasNote ? n : '';
          if (hasNote && state.wrongNotes[i] && state.wrongNotes[i].has(n)) {
            noteSpan.classList.add('note-wrong');
          } else {
            noteSpan.classList.remove('note-wrong');
          }
        }
      } else {
        notesDiv.style.display = 'none';
      }
    }

    // Zeilen-, Spalten- und Block-Highlight (Horizontale & vertikale graue Streifen)
    if (state.selectedIndex !== null && state.selectedIndex !== i) {
      const selR = Math.floor(state.selectedIndex / 9);
      const selC = state.selectedIndex % 9;
      const selB = Math.floor(selR / 3) * 3 + Math.floor(selC / 3);

      const r = Math.floor(i / 9);
      const c = i % 9;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      // Horizontale und vertikale graue Streifen + 3x3 Block
      if (selR === r || selC === c || selB === b) {
        cell.classList.add('highlight');
      }

      // Gleiche Ziffer auf dem gesamten Spielfeld hervorheben
      const selVal = state.currentBoard[state.selectedIndex];
      if (selVal !== 0 && val === selVal) {
        cell.classList.add('same-num');
      }
    }
  }
}

function updateNumpadCompletedState() {
  const completedDigits = SudokuEngine.getCompletedDigits(state.currentBoard, state.solution);
  const numButtons = dom.numpad.querySelectorAll('.num');
  numButtons.forEach(btn => {
    const digit = parseInt(btn.dataset.num, 10);
    const isCompleted = completedDigits.has(digit);
    btn.classList.toggle('completed', isCompleted);
    // Sperrung mit pointer-events nur wenn autoLockCompleted explizit gewünscht ist
    btn.classList.toggle('locked', isCompleted && state.autoLockCompleted);
  });
}

function selectCell(idx) {
  if (state.isPaused || state.isGameOver) return;
  ensureGameStarted();
  state.selectedIndex = idx;
  render();
}

function cleanPeerNotes(idx, num) {
  const r = Math.floor(idx / 9);
  const c = idx % 9;
  const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);

  for (let i = 0; i < 81; i++) {
    if (i === idx) continue;
    const ir = Math.floor(i / 9);
    const ic = i % 9;
    const ib = Math.floor(ir / 3) * 3 + Math.floor(ic / 3);

    if (ir === r || ic === c || ib === b) {
      if (state.notes[i]) state.notes[i].delete(num);
      if (state.savedNotes[i]) state.savedNotes[i].delete(num);
    }
  }
}

function handleNumberInput(num) {
  if (state.isPaused || state.isGameOver) return;
  ensureGameStarted();
  const idx = state.selectedIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  if (state.notesActive) {
    if (state.notes[idx].has(num)) {
      state.notes[idx].delete(num);
    } else {
      state.notes[idx].add(num);
    }
    state.savedNotes[idx] = new Set(state.notes[idx]);
    state.currentBoard[idx] = 0;
  } else {
    const previousNum = state.currentBoard[idx];
    const isCorrect = (num === state.solution[idx]);

    // Wenn genau die gleiche Zahl nochmals eingetippt wird, keine Aktion
    if (previousNum === num) return;

    // Bisherige Notizen sichern, falls die Zahl fehlerhaft ist
    if (state.notes[idx].size > 0) {
      state.savedNotes[idx] = new Set(state.notes[idx]);
    }

    state.currentBoard[idx] = num;

    if (isCorrect) {
      // Richtige Zahl: Notizen dieser Zelle löschen & aus Peers entfernen
      state.notes[idx].clear();
      state.savedNotes[idx].clear();
      state.wrongNotes[idx].clear();
      cleanPeerNotes(idx, num);
    } else {
      // Falsche Zahl: Fehler im Notiz-Gedächtnis merken & Leben abziehen (bei jeder falschen Zahleneingabe)
      state.wrongNotes[idx].add(num);
      deductHeart();
    }

    checkProgress();
    updateNumpadCompletedState();
  }

  render();
}

function clearCell() {
  if (state.isPaused || state.isGameOver) return;
  ensureGameStarted();
  const idx = state.selectedIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  if (state.currentBoard[idx] !== 0) {
    // Wenn eine Zahl gelöscht wird, die Notizen wiederherstellen!
    if (state.savedNotes[idx] && state.savedNotes[idx].size > 0) {
      state.notes[idx] = new Set(state.savedNotes[idx]);
    }
    state.currentBoard[idx] = 0;
  } else {
    // Zelle war schon leer: Notizen löschen
    state.notes[idx].clear();
    state.savedNotes[idx].clear();
    state.wrongNotes[idx].clear();
  }

  checkProgress();
  updateNumpadCompletedState();
  render();
}

function useHint() {
  if (state.isPaused || state.isGameOver) return;
  ensureGameStarted();

  if (state.hintsRemaining <= 0) {
    toast(t('toastNoHints'));
    return;
  }

  // Zielzelle ermitteln: bevorzugt aktuell gewählte Zelle, sonst erste leere/falsche Zelle
  let targetIdx = state.selectedIndex;
  const isGiven = targetIdx !== null && state.initialBoard[targetIdx] !== 0;
  const isAlreadyCorrect = targetIdx !== null && state.currentBoard[targetIdx] === state.solution[targetIdx];

  if (targetIdx === null || isGiven || isAlreadyCorrect) {
    const candidates = [];
    for (let i = 0; i < 81; i++) {
      if (state.initialBoard[i] === 0 && state.currentBoard[i] !== state.solution[i]) {
        candidates.push(i);
      }
    }
    if (candidates.length === 0) return;
    targetIdx = candidates[Math.floor(Math.random() * candidates.length)];
  }

  const correctNum = state.solution[targetIdx];
  state.currentBoard[targetIdx] = correctNum;
  state.notes[targetIdx].clear();
  state.savedNotes[targetIdx].clear();
  state.wrongNotes[targetIdx].clear();
  cleanPeerNotes(targetIdx, correctNum);

  state.hintsRemaining--;
  if (dom.hintCount) dom.hintCount.textContent = state.hintsRemaining;
  state.selectedIndex = targetIdx;

  render();
  updateNumpadCompletedState();

  // Pulsierende Hervorhebung auf dem Spielfeld
  const cell = dom.grid.children[targetIdx];
  if (cell) {
    cell.classList.add('cell-hint');
    setTimeout(() => cell.classList.remove('cell-hint'), 750);
  }

  toast(t('toastHintUsed'));
  checkProgress();
}

function showResultOverlay(isWin) {
  if (!dom.boardResultOverlay) return;
  const d = I18N[state.currentLang] || I18N.de;
  const formattedTime = dom.gameTimerDisplay ? dom.gameTimerDisplay.textContent : '00:00';

  if (isWin) {
    if (dom.resultBadge) {
      dom.resultBadge.style.display = 'block';
      dom.resultBadge.textContent = '✦';
      dom.resultBadge.style.color = 'var(--user-val)';
    }
    if (dom.resultTitle) dom.resultTitle.textContent = d.resTitleWin || 'Hervorragend gelöst!';
    if (dom.resultDesc) dom.resultDesc.textContent = d.resDescWin || 'Sudoku fehlerfrei gemeistert.';
    if (dom.btnResultSolution) dom.btnResultSolution.style.display = 'none';
  } else {
    if (dom.resultBadge) {
      dom.resultBadge.style.display = 'none';
      dom.resultBadge.textContent = '';
    }
    if (dom.resultTitle) dom.resultTitle.textContent = d.resTitleGameOver || 'Keine Leben mehr';
    if (dom.resultDesc) dom.resultDesc.textContent = d.resDescGameOver || 'Alle 3 Leben aufgebraucht.';
    if (dom.btnResultSolution) dom.btnResultSolution.style.display = '';
  }

  if (dom.resStatTimeVal) dom.resStatTimeVal.textContent = formattedTime;
  if (dom.resStatDiffVal) {
    let modeText = d.modeZen || 'Einzelspieler';
    if (state.mode === 'versus') modeText = d.modeVersus || 'Versus';
    if (state.mode === 'swap') modeText = d.modeSwap || 'Co-Op Swap';
    dom.resStatDiffVal.textContent = modeText;
  }

  if (dom.hudResultBar) dom.hudResultBar.classList.add('hidden');
  dom.boardResultOverlay.classList.remove('hidden');
}

function showFullSolution() {
  state.currentBoard = [...state.solution];
  state.notes = Array.from({ length: 81 }, () => new Set());
  state.savedNotes = Array.from({ length: 81 }, () => new Set());
  state.wrongNotes = Array.from({ length: 81 }, () => new Set());
  state.selectedIndex = null;
  render();
  updateNumpadCompletedState();
  if (dom.boardResultOverlay) dom.boardResultOverlay.classList.add('hidden');
  if (dom.hudResultBar) {
    dom.hudResultBar.classList.remove('hidden');
    if (dom.btnHudSolution) dom.btnHudSolution.classList.add('hidden');
  }
  toast(state.currentLang === 'de' ? 'Lösung aufgedeckt' : 'Solution revealed');
}

function hideResultOverlayForInspection() {
  if (dom.boardResultOverlay) dom.boardResultOverlay.classList.add('hidden');
  if (dom.hudResultBar) {
    dom.hudResultBar.classList.remove('hidden');
    const isWin = SudokuEngine.isComplete(state.currentBoard, state.solution);
    if (dom.hudReopenIcon) dom.hudReopenIcon.textContent = isWin ? '✦' : '✧';
    if (dom.btnHudSolution) {
      if (isWin) {
        dom.btnHudSolution.classList.add('hidden');
      } else {
        dom.btnHudSolution.classList.remove('hidden');
      }
    }
  }
  const d = I18N[state.currentLang] || I18N.de;
  toast(d.toastInspectHint || 'Tippe oben auf „Ergebnis & Stats“, um zurückzukehren');
}

function restoreResultOverlay() {
  if (dom.boardResultOverlay) dom.boardResultOverlay.classList.remove('hidden');
  if (dom.hudResultBar) dom.hudResultBar.classList.add('hidden');
}

function checkProgress() {
  const pct = SudokuEngine.getProgress(state.currentBoard, state.initialBoard, state.solution);
  dom.playerBar.style.width = `${pct}%`;
  dom.playerLabel.textContent = `${pct}%`;

  if (state.mode === 'versus' && state.channel && state.opponentType === 'online') {
    broadcast('PROGRESS', { progressPct: pct });
  }

  if (SudokuEngine.isComplete(state.currentBoard, state.solution)) {
    gameWon();
  }
}

function updateProgressBars(playerPct, oppPct) {
  dom.playerBar.style.width = `${playerPct}%`;
  dom.playerLabel.textContent = `${playerPct}%`;
  dom.opponentBar.style.width = `${oppPct}%`;
  dom.opponentLabel.textContent = `${oppPct}%`;
}

async function gameWon() {
  stopBot();
  stopStopwatch();

  const formattedTime = dom.gameTimerDisplay.textContent;
  const currentDiff = state.mode === 'zen' ? state.zenDifficulty : (state.mode === 'versus' ? state.versusDifficulty : 'medium');

  // Zeit in Bestenliste aufnehmen
  const isBest = recordBestTime(currentDiff, state.gameSeconds);

  if (isBest) {
    toast(`${t('toastGameWon')}${formattedTime}! ${t('toastNewBestTime')}`);
  } else {
    toast(`${t('toastGameWon')}${formattedTime}!`);
  }

  showResultOverlay(true);

  if (state.mode === 'versus' && state.channel && state.opponentType === 'online') {
    broadcast('GAME_OVER', { winner: state.user?.id || 'player' });
  }

  updateAccountUI();
}

// =============================================================================
// BOT ENGINE
// =============================================================================
function getBotIntervalMs() {
  switch (state.botDifficulty) {
    case 'easy': return 3800;   // ~3.8s
    case 'hard': return 1400;   // ~1.4s
    case 'medium':
    default: return 2400;       // ~2.4s
  }
}

function startBotMatch() {
  stopBot();
  state.botRunning = true;
  toast(t('toastBotStarted'));

  if (state.mode === 'versus') {
    state.botInitial = [...state.initialBoard];
    state.botBoard = [...state.initialBoard];
    state.botSolution = [...state.solution];
  } else if (state.mode === 'swap') {
    const botPuzzle = SudokuEngine.generate(34);
    state.botInitial = [...botPuzzle.initialBoard];
    state.botBoard = [...botPuzzle.initialBoard];
    state.botSolution = [...botPuzzle.solution];
    startSwapCountdown();
  }

  const initialBotPct = SudokuEngine.getProgress(state.botBoard, state.botInitial, state.botSolution);
  dom.opponentBar.style.width = `${initialBotPct}%`;
  dom.opponentLabel.textContent = `${initialBotPct}%`;

  state.botIntervalId = setInterval(() => {
    botStep();
  }, getBotIntervalMs());
}

function stopBot() {
  if (state.botIntervalId) {
    clearInterval(state.botIntervalId);
    state.botIntervalId = null;
  }
  state.botRunning = false;
}

function botStep() {
  if (state.isPaused || !state.gameStarted) return;
  const emptyIndices = [];
  for (let i = 0; i < 81; i++) {
    if (state.botBoard[i] === 0 || state.botBoard[i] !== state.botSolution[i]) {
      emptyIndices.push(i);
    }
  }

  if (emptyIndices.length === 0) {
    stopBot();
    if (state.mode === 'versus') {
      toast(t('toastBotWon'));
    } else if (state.mode === 'swap') {
      toast(t('toastBotPartDone'));
    }
    return;
  }

  const randIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  state.botBoard[randIdx] = state.botSolution[randIdx];

  const botPct = SudokuEngine.getProgress(state.botBoard, state.botInitial, state.botSolution);

  if (state.mode === 'versus') {
    dom.opponentBar.style.width = `${botPct}%`;
    dom.opponentLabel.textContent = `${botPct}%`;
  }
}

function setBotDifficulty(diff) {
  state.botDifficulty = diff;
  [dom.diffEasy, dom.diffMedium, dom.diffHard].forEach(b => {
    b.classList.toggle('active', b.dataset.diff === diff);
  });

  if (state.botRunning) {
    stopBot();
    startBotMatch();
  }
}

function setVersusDifficulty(diff) {
  state.versusDifficulty = diff;
  [dom.versusDiffEasy, dom.versusDiffMedium, dom.versusDiffHard].forEach(b => {
    b.classList.toggle('active', b.dataset.diff === diff);
  });
  startNewGame();
}

// =============================================================================
// MODI & MULTIPLAYER LOBBY
// =============================================================================
function setMode(mode) {
  state.mode = mode;
  state.leadMode = mode; // Rangliste passt sich automatisch an den aktuellen Modus an!
  [dom.tabZen, dom.tabVersus, dom.tabSwap].forEach(b => b.classList.remove('active'));

  dom.zenDifficultyBar.classList.toggle('hidden', mode !== 'zen');
  dom.lobby.classList.toggle('hidden', mode === 'zen');
  dom.versusBars.classList.toggle('hidden', mode !== 'versus');
  dom.swapBox.classList.toggle('hidden', mode !== 'swap');

  if (mode === 'zen') {
    dom.tabZen.classList.add('active');
    leaveRoom();
    stopBot();
  } else if (mode === 'versus') {
    dom.tabVersus.classList.add('active');
  } else {
    dom.tabSwap.classList.add('active');
  }

  updateBotPartnerDifficultyLabels();
  updateOpponentLabels();
  startNewGame();
}

function setZenDifficulty(diff) {
  state.zenDifficulty = diff;
  [dom.zenDiffEasy, dom.zenDiffMedium, dom.zenDiffHard].forEach(b => {
    b.classList.toggle('active', b.dataset.diff === diff);
  });
  startNewGame();
}

function setOpponentType(type) {
  state.opponentType = type;
  dom.btnPlayOnline.classList.toggle('active', type === 'online');
  dom.btnPlayBot.classList.toggle('active', type === 'bot');

  dom.onlineSection.classList.toggle('hidden', type !== 'online');
  dom.botSection.classList.toggle('hidden', type !== 'bot');

  if (type === 'bot') {
    leaveRoom();
  }

  updateOpponentLabels();
  startNewGame();
}

function updateOpponentLabels() {
  const isBot = state.opponentType === 'bot';
  const d = I18N[state.currentLang] || I18N.de;
  if (dom.opponentLabelText) dom.opponentLabelText.textContent = isBot ? d.botLabel : d.opponentLabel;
  if (dom.swapPartnerLabel) dom.swapPartnerLabel.textContent = isBot ? d.swapWithBotIn : d.swapIn;
}

function createRoom() {
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  state.isHost = true;
  joinRoom(code);
}

async function joinRoom(code) {
  if (!code || code.length !== 4) {
    toast(t('toastEnterCode'));
    return;
  }

  leaveRoom();
  state.roomCode = code.toUpperCase();
  dom.currentRoom.textContent = state.roomCode;
  dom.roomDisplay.classList.remove('hidden');
  setConnectionStatus('connecting', t('statusConnecting'));

  if (state.isOffline || !state.supabase) {
    setConnectionStatus('connected', `Demo ${state.roomCode}`);
    return;
  }

  state.channel = state.supabase.channel(`room:${state.roomCode}`, {
    config: { broadcast: { self: false } }
  });

  state.channel.on('presence', { event: 'sync' }, () => {
    const pres = state.channel.presenceState();
    state.peersCount = Object.keys(pres).length;
    setConnectionStatus('connected', `${state.peersCount} ${t('statusPlayers')}`);

    if (state.isHost && state.peersCount === 2 && state.mode === 'versus') {
      broadcast('SYNC_BOARD', {
        initialBoard: state.initialBoard,
        solution: state.solution
      });
    }
  });

  state.channel
    .on('broadcast', { event: 'SYNC_BOARD' }, ({ payload }) => {
      toast(t('toastSynced'));
      startNewGame(payload.initialBoard, payload.solution);
    })
    .on('broadcast', { event: 'PROGRESS' }, ({ payload }) => {
      const pct = payload.progressPct !== undefined 
        ? payload.progressPct 
        : Math.round((payload.solved / payload.total) * 100);
      dom.opponentBar.style.width = `${pct}%`;
      dom.opponentLabel.textContent = `${pct}%`;
    })
    .on('broadcast', { event: 'SWAP' }, ({ payload }) => {
      applyIncomingSwap(payload);
    })
    .on('broadcast', { event: 'GAME_OVER' }, () => {
      toast(t('toastOpponentWon'));
    });

  state.channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      setConnectionStatus('connected', t('statusConnected'));
      await state.channel.track({ user: state.user?.id });
    }
  });
}

function broadcast(event, payload) {
  if (state.channel) {
    state.channel.send({ type: 'broadcast', event, payload });
  }
}

function leaveRoom() {
  if (state.channel) {
    state.channel.unsubscribe();
    state.channel = null;
  }
  state.roomCode = null;
  state.isHost = false;
  dom.roomDisplay.classList.add('hidden');
  setConnectionStatus('disconnected', t('statusDisconnected'));
}

function setConnectionStatus(status, text) {
  dom.connDot.className = 'dot ' + (status === 'connected' ? 'connected' : status === 'connecting' ? 'connecting' : '');
  dom.connText.textContent = text;
}

// =============================================================================
// CO-OP SWAP COUNTDOWN & FARBIGE BOARDS
// =============================================================================
function startSwapCountdown() {
  stopSwapCountdown();
  state.swapSecondsLeft = 10;
  dom.swapTimer.textContent = `${state.swapSecondsLeft}s`;

  state.swapTimerId = setInterval(() => {
    if (state.isPaused || !state.gameStarted) return;
    state.swapSecondsLeft--;
    dom.swapTimer.textContent = `${state.swapSecondsLeft}s`;

    if (state.swapSecondsLeft <= 0) {
      state.swapSecondsLeft = 10;
      doBoardSwap();
    }
  }, 1000);
}

function stopSwapCountdown() {
  if (state.swapTimerId) {
    clearInterval(state.swapTimerId);
    state.swapTimerId = null;
  }
}

function doBoardSwap() {
  dom.grid.classList.add('swapping');
  setTimeout(() => dom.grid.classList.remove('swapping'), 320);

  // Board Farbe umschalten (A <-> B)
  state.activeBoard = state.activeBoard === 'A' ? 'B' : 'A';
  dom.grid.classList.toggle('board-theme-a', state.activeBoard === 'A');
  dom.grid.classList.toggle('board-theme-b', state.activeBoard === 'B');
  dom.swapBoardBadge.textContent = `Board ${state.activeBoard}`;
  dom.swapBoardBadge.className = `board-badge ${state.activeBoard === 'A' ? 'badge-blue' : 'badge-red'}`;

  if (state.opponentType === 'bot') {
    const tempBoard = [...state.currentBoard];
    const tempInitial = [...state.initialBoard];
    const tempSol = [...state.solution];

    state.currentBoard = [...state.botBoard];
    state.initialBoard = [...state.botInitial];
    state.solution = [...state.botSolution];

    state.botBoard = tempBoard;
    state.botInitial = tempInitial;
    state.botSolution = tempSol;

    state.selectedIndex = null;
    render();
    checkProgress();
    updateNumpadCompletedState();
    toast(`${t('toastBoardSwapped')}${state.activeBoard}`);
  } else if (state.channel) {
    broadcast('SWAP', {
      currentBoard: state.currentBoard,
      initialBoard: state.initialBoard,
      solution: state.solution,
      activeBoard: state.activeBoard
    });
  } else {
    const next = SudokuEngine.generate(34);
    state.solution = next.solution;
    state.initialBoard = next.initialBoard;
    state.currentBoard = [...next.initialBoard];
    render();
    toast(`${t('toastBoardSwapped')}${state.activeBoard}`);
  }
}

function applyIncomingSwap(payload) {
  dom.grid.classList.add('swapping');
  setTimeout(() => dom.grid.classList.remove('swapping'), 320);

  state.activeBoard = payload.activeBoard || (state.activeBoard === 'A' ? 'B' : 'A');
  dom.grid.classList.toggle('board-theme-a', state.activeBoard === 'A');
  dom.grid.classList.toggle('board-theme-b', state.activeBoard === 'B');
  dom.swapBoardBadge.textContent = `Board ${state.activeBoard}`;
  dom.swapBoardBadge.className = `board-badge ${state.activeBoard === 'A' ? 'badge-blue' : 'badge-red'}`;

  state.currentBoard = [...payload.currentBoard];
  state.initialBoard = [...payload.initialBoard];
  state.solution = [...payload.solution];
  state.selectedIndex = null;

  render();
  checkProgress();
  updateNumpadCompletedState();
  toast(`${t('toastBoardSwapped')}${state.activeBoard}`);
}

// =============================================================================
// SPIELREGELN ERKLÄRUNGS-MODAL
// =============================================================================
function showModeRules() {
  const d = I18N[state.currentLang] || I18N.de;
  if (state.mode === 'zen') {
    dom.rulesModalTitle.textContent = d.rulesModalTitleZen;
    dom.rulesModalText.innerHTML = d.rulesModalZen;
  } else if (state.mode === 'versus') {
    dom.rulesModalTitle.textContent = d.rulesModalTitleVersus;
    dom.rulesModalText.innerHTML = d.rulesModalVersus;
  } else if (state.mode === 'swap') {
    dom.rulesModalTitle.textContent = d.rulesModalTitleSwap;
    dom.rulesModalText.innerHTML = d.rulesModalSwap;
  }
  dom.rulesModal.classList.remove('hidden');
}

// =============================================================================
// RANGLISTE (PRO MODUS & SCHWIERIGKEITSGRAD)
// =============================================================================
function getLeaderboardSeed(mode, diff) {
  const seeds = {
    zen: {
      easy: [
        { id: 'bot-1', username: 'ZenMaster', time: 108 },
        { id: 'bot-2', username: 'NordicSolver', time: 132 },
        { id: 'bot-3', username: 'ChillBrain', time: 165 },
        { id: 'bot-4', username: 'GridSeeker', time: 195 },
        { id: 'bot-5', username: 'CalmThinker', time: 230 }
      ],
      medium: [
        { id: 'bot-1', username: 'ZenMaster', time: 185 },
        { id: 'bot-2', username: 'NordicSolver', time: 220 },
        { id: 'bot-3', username: 'LogicPioneer', time: 265 },
        { id: 'bot-4', username: 'QuietFocus', time: 310 },
        { id: 'bot-5', username: 'GridMaster', time: 360 }
      ],
      hard: [
        { id: 'bot-1', username: 'ZenMaster', time: 320 },
        { id: 'bot-2', username: 'NordicSolver', time: 395 },
        { id: 'bot-3', username: 'DeepFocus', time: 470 },
        { id: 'bot-4', username: 'LogicKing', time: 535 },
        { id: 'bot-5', username: 'MindFlow', time: 610 }
      ]
    },
    versus: {
      easy: [
        { id: 'bot-v1', username: 'SpeedDemon', time: 88 },
        { id: 'bot-v2', username: 'FastFingers', time: 104 },
        { id: 'bot-v3', username: 'RivalX', time: 125 },
        { id: 'bot-v4', username: 'QuickSolve', time: 145 },
        { id: 'bot-v5', username: 'TurboLogic', time: 180 }
      ],
      medium: [
        { id: 'bot-v1', username: 'SpeedDemon', time: 145 },
        { id: 'bot-v2', username: 'RivalX', time: 178 },
        { id: 'bot-v3', username: 'VersusPro', time: 215 },
        { id: 'bot-v4', username: 'FastFingers', time: 260 },
        { id: 'bot-v5', username: 'GridRacer', time: 310 }
      ],
      hard: [
        { id: 'bot-v1', username: 'VersusPro', time: 280 },
        { id: 'bot-v2', username: 'SpeedDemon', time: 330 },
        { id: 'bot-v3', username: 'HardcoreDuel', time: 390 },
        { id: 'bot-v4', username: 'RivalX', time: 450 },
        { id: 'bot-v5', username: 'TitanSolver', time: 520 }
      ]
    },
    swap: {
      easy: [
        { id: 'bot-s1', username: 'Team Alpha', time: 110 },
        { id: 'bot-s2', username: 'SwapTwin 1', time: 128 },
        { id: 'bot-s3', username: 'TeamNordic', time: 150 },
        { id: 'bot-s4', username: 'SyncSquad', time: 175 },
        { id: 'bot-s5', username: 'GridPartners', time: 205 }
      ],
      medium: [
        { id: 'bot-s1', username: 'Team Alpha', time: 175 },
        { id: 'bot-s2', username: 'TeamNordic', time: 210 },
        { id: 'bot-s3', username: 'SyncSquad', time: 250 },
        { id: 'bot-s4', username: 'SwapTwin 1', time: 295 },
        { id: 'bot-s5', username: 'PartnerFlow', time: 340 }
      ],
      hard: [
        { id: 'bot-s1', username: 'Team Alpha', time: 295 },
        { id: 'bot-s2', username: 'TeamNordic', time: 360 },
        { id: 'bot-s3', username: 'MasterSwappers', time: 430 },
        { id: 'bot-s4', username: 'SyncSquad', time: 510 },
        { id: 'bot-s5', username: 'TwoMinds', time: 590 }
      ]
    }
  };

  const m = mode || 'zen';
  const d = diff || 'medium';
  return (seeds[m] && seeds[m][d]) ? seeds[m][d] : seeds.zen[d] || seeds.zen.medium;
}

function loadSavedLeaderboards() {
  const saved = localStorage.getItem('swapdoku_leaderboards_v3');
  if (saved) {
    try { return JSON.parse(saved); } catch (_) {}
  }
  return {};
}

function saveLeaderboards(data) {
  localStorage.setItem('swapdoku_leaderboards_v3', JSON.stringify(data));
}

function recordBestTime(diff, seconds) {
  const mode = state.mode || 'zen';
  const key = `${mode}_${diff}`;
  const boards = loadSavedLeaderboards();
  const currentDiffList = boards[key] || getLeaderboardSeed(mode, diff);
  const myName = state.profile.username || 'Spieler';

  let existing = currentDiffList.find(e => e.id === 'player-me' || e.username === myName);
  let isNewBest = false;

  if (existing) {
    if (seconds < existing.time) {
      existing.time = seconds;
      existing.username = myName;
      isNewBest = true;
    }
  } else {
    currentDiffList.push({
      id: 'player-me',
      username: myName,
      time: seconds
    });
    isNewBest = true;
  }

  currentDiffList.sort((a, b) => a.time - b.time);
  boards[key] = currentDiffList;
  saveLeaderboards(boards);

  // Supabase Backend Sync (RPC submit_score)
  if (state.supabase) {
    state.supabase.rpc('submit_score', {
      p_mode: mode,
      p_difficulty: diff,
      p_time_seconds: seconds,
      p_remaining_lives: Math.max(1, Math.min(3, state.currentHearts || 3))
    }).catch(err => {
      console.warn('Backend sync submit_score skipped/failed:', err.message);
    });
  }

  return isNewBest;
}

function getMyBestTimeForDiff(diff) {
  const mode = state.mode || 'zen';
  const key = `${mode}_${diff}`;
  const boards = loadSavedLeaderboards();
  const list = boards[key] || getLeaderboardSeed(mode, diff);
  const myName = state.profile.username || 'Spieler';
  const entry = list.find(e => e.id === 'player-me' || e.username === myName);
  return entry ? formatTime(entry.time) : '--:--';
}

function openLeaderboard() {
  state.leadMode = state.mode; // Rangliste passt sich automatisch dem aktuellen Spielmodus an!
  syncLeaderboardModeTabs();
  dom.leaderboardModal.classList.remove('hidden');
  renderLeaderboard();
}

function closeLeaderboard() {
  dom.leaderboardModal.classList.add('hidden');
}

function switchLeaderboardMode(mode) {
  state.leadMode = mode;
  syncLeaderboardModeTabs();
  renderLeaderboard();
}

function syncLeaderboardModeTabs() {
  if (!dom.leadModeTabs) return;
  const btns = dom.leadModeTabs.querySelectorAll('.lead-mode-btn');
  btns.forEach(b => {
    b.classList.toggle('active', b.dataset.mode === state.leadMode);
  });
}

function switchLeaderboardTab(diff) {
  state.leadDifficulty = diff;
  [dom.leadTabEasy, dom.leadTabMedium, dom.leadTabHard].forEach(b => {
    if (b) b.classList.toggle('active', b.dataset.diff === diff);
  });
  renderLeaderboard();
}

function renderLeaderboard() {
  const mode = state.leadMode || state.mode || 'zen';
  const diff = state.leadDifficulty || 'medium';
  const key = `${mode}_${diff}`;
  const boards = loadSavedLeaderboards();
  const list = (boards[key] || getLeaderboardSeed(mode, diff)).slice().sort((a, b) => a.time - b.time);

  const myName = state.profile.username || 'Spieler';
  let myTime = '--:--';

  dom.leaderboardBody.innerHTML = '';

  list.forEach((entry, idx) => {
    const isMe = entry.id === 'player-me' || entry.username === myName;
    const rank = idx + 1;
    if (isMe) {
      myTime = formatTime(entry.time);
    }

    const tr = document.createElement('tr');
    if (isMe) tr.className = 'my-row';
    tr.innerHTML = `
      <td>#${rank}</td>
      <td>${entry.username} ${isMe ? `(${t('playerLabel')})` : ''}</td>
      <td style="text-align: right; font-variant-numeric: tabular-nums;">${formatTime(entry.time)}</td>
    `;
    dom.leaderboardBody.appendChild(tr);
  });

  if (dom.myRankTime) dom.myRankTime.textContent = myTime;
}

// =============================================================================
// ACCOUNT & PROFIL MODAL
// =============================================================================
function openAccount() {
  updateAccountUI();
  clearAuthMsg();
  dom.accountModal.classList.remove('hidden');
}

function closeAccount() {
  dom.accountModal.classList.add('hidden');
}

function updateAccountUI() {
  const d = I18N[state.currentLang] || I18N.de;
  if (dom.usernameInput) dom.usernameInput.value = state.profile.username || '';
  
  const bestMed = getMyBestTimeForDiff('medium');
  if (dom.accountBestTimeVal) dom.accountBestTimeVal.textContent = bestMed;

  const activeObj = THEMES.find(t => t.id === state.profile.active_theme);
  if (dom.accountThemeVal) dom.accountThemeVal.textContent = activeObj ? activeObj.name : state.profile.active_theme;

  const currentEmail = state.authEmail || state.user?.email;
  if (currentEmail) {
    if (dom.authLoggedInSection) dom.authLoggedInSection.classList.remove('hidden');
    if (dom.authGuestSection) dom.authGuestSection.classList.add('hidden');
    if (dom.authLoggedInEmail) dom.authLoggedInEmail.textContent = currentEmail;
    if (dom.accountAuthStatus) dom.accountAuthStatus.textContent = d.statusLoggedIn;
  } else {
    if (dom.authLoggedInSection) dom.authLoggedInSection.classList.add('hidden');
    if (dom.authGuestSection) dom.authGuestSection.classList.remove('hidden');
    if (dom.accountAuthStatus) dom.accountAuthStatus.textContent = d.statusGuest;
  }
}

function switchAuthMode(mode) {
  state.authMode = mode;
  const d = I18N[state.currentLang] || I18N.de;
  if (mode === 'login') {
    dom.tabAuthLogin.classList.add('active');
    dom.tabAuthRegister.classList.remove('active');
    dom.btnAuthSubmit.textContent = d.btnSubmitLogin;
    dom.authPassword.setAttribute('autocomplete', 'current-password');
  } else {
    dom.tabAuthLogin.classList.remove('active');
    dom.tabAuthRegister.classList.add('active');
    dom.btnAuthSubmit.textContent = d.btnSubmitRegister;
    dom.authPassword.setAttribute('autocomplete', 'new-password');
  }
  clearAuthMsg();
}

function showAuthMsg(msg, type = 'error') {
  if (!dom.authStatusMsg) return;
  dom.authStatusMsg.textContent = msg;
  dom.authStatusMsg.className = `auth-msg ${type}`;
  dom.authStatusMsg.classList.remove('hidden');
}

function clearAuthMsg() {
  if (!dom.authStatusMsg) return;
  dom.authStatusMsg.classList.add('hidden');
  dom.authStatusMsg.textContent = '';
}

async function handleAuthSubmit() {
  const email = dom.authEmail.value.trim();
  const password = dom.authPassword.value;

  if (!email || !email.includes('@')) {
    showAuthMsg(state.currentLang === 'de' ? 'Bitte eine gültige E-Mail-Adresse angeben.' : 'Please enter a valid email address.');
    return;
  }
  if (!password || password.length < 6) {
    showAuthMsg(state.currentLang === 'de' ? 'Das Passwort muss mindestens 6 Zeichen lang sein.' : 'Password must be at least 6 characters.');
    return;
  }

  clearAuthMsg();
  dom.btnAuthSubmit.disabled = true;

  try {
    if (state.authMode === 'login') {
      await loginUser(email, password);
    } else {
      await registerUser(email, password);
    }
  } catch (err) {
    showAuthMsg(err.message || 'Authentifizierungsfehler');
  } finally {
    dom.btnAuthSubmit.disabled = false;
    const d = I18N[state.currentLang] || I18N.de;
    dom.btnAuthSubmit.textContent = state.authMode === 'login' ? d.btnSubmitLogin : d.btnSubmitRegister;
  }
}

async function loginUser(email, password) {
  if (!state.isOffline && state.supabase && !SUPABASE_CONFIG.url.includes('xyzcompany')) {
    const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showAuthMsg(error.message === 'Invalid login credentials' ? (state.currentLang === 'de' ? 'Ungültige Anmeldedaten.' : 'Invalid login credentials.') : error.message);
      return;
    }
    state.user = data.user;
    state.authEmail = data.user.email;
    await syncProfileFromDB();
    toast(state.currentLang === 'de' ? 'Erfolgreich angemeldet!' : 'Signed in successfully!');
    updateAccountUI();
    dom.authEmail.value = '';
    dom.authPassword.value = '';
  } else {
    // Lokale Simulation
    state.authEmail = email;
    localStorage.setItem('swapdoku_auth_email', email);
    const saved = JSON.parse(localStorage.getItem('swapdoku_saved_profiles') || '{}');
    if (!saved[email]) {
      saved[email] = {
        username: state.profile.username,
        active_theme: state.profile.active_theme
      };
      localStorage.setItem('swapdoku_saved_profiles', JSON.stringify(saved));
    } else {
      state.profile = { ...state.profile, ...saved[email] };
    }
    toast(state.currentLang === 'de' ? 'Erfolgreich angemeldet!' : 'Signed in successfully!');
    updateAccountUI();
    dom.authEmail.value = '';
    dom.authPassword.value = '';
  }
}

async function registerUser(email, password) {
  if (!state.isOffline && state.supabase && !SUPABASE_CONFIG.url.includes('xyzcompany')) {
    const { data, error } = await state.supabase.auth.signUp({ email, password });
    if (error) {
      showAuthMsg(error.message);
      return;
    }
    state.user = data.user;
    state.authEmail = data.user.email;
    toast(state.currentLang === 'de' ? 'Konto erfolgreich registriert!' : 'Account registered successfully!');
    updateAccountUI();
    dom.authEmail.value = '';
    dom.authPassword.value = '';
  } else {
    state.authEmail = email;
    localStorage.setItem('swapdoku_auth_email', email);
    const saved = JSON.parse(localStorage.getItem('swapdoku_saved_profiles') || '{}');
    saved[email] = {
      username: state.profile.username,
      active_theme: state.profile.active_theme
    };
    localStorage.setItem('swapdoku_saved_profiles', JSON.stringify(saved));
    toast(state.currentLang === 'de' ? 'Konto erfolgreich erstellt!' : 'Account created successfully!');
    updateAccountUI();
    dom.authEmail.value = '';
    dom.authPassword.value = '';
  }
}

async function logoutUser() {
  if (!state.isOffline && state.supabase && !SUPABASE_CONFIG.url.includes('xyzcompany')) {
    try { await state.supabase.auth.signOut(); } catch (_) {}
  }
  state.user = null;
  state.authEmail = null;
  localStorage.removeItem('swapdoku_auth_email');
  toast(state.currentLang === 'de' ? 'Erfolgreich abgemeldet' : 'Logged out successfully');
  updateAccountUI();
}

async function saveUsername() {
  const newName = dom.usernameInput.value.trim();
  if (!newName) {
    toast(state.currentLang === 'de' ? 'Name darf nicht leer sein' : 'Name cannot be empty');
    return;
  }

  state.profile.username = newName;
  saveLocalState();
  toast(state.currentLang === 'de' ? 'Spielername gespeichert' : 'Player name saved');

  if (!state.isOffline && state.supabase && state.user) {
    try {
      await state.supabase.from('profiles').update({ username: newName }).eq('id', state.user.id);
    } catch (_) {}
  }
  renderLeaderboard();
}

// =============================================================================
// THEMES & KOSTENLOSER THEME SHOP
// =============================================================================
function setTheme(id) {
  dom.root.setAttribute('data-theme', id);
  updateThemeToggleIcon(id);
  
  // Browser theme-color Meta-Tag synchronisieren
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }
  const themeObj = THEMES.find(t => t.id === id);
  if (themeObj && themeObj.colors) {
    metaTheme.content = themeObj.colors[0];
  }
}

function toggleDarkLight() {
  const current = dom.root.getAttribute('data-theme') || 'nordic-light';
  const newTheme = current === 'dark-slate' ? 'nordic-light' : 'dark-slate';
  activateTheme(newTheme);
}

function updateThemeToggleIcon(themeId) {
  if (dom.themeToggleIcon) {
    dom.themeToggleIcon.textContent = themeId === 'dark-slate' ? '☼' : '☾';
  }
}

function renderThemeShop() {
  const d = I18N[state.currentLang] || I18N.de;
  dom.themesList.innerHTML = '';

  THEMES.forEach(t => {
    const isActive = state.profile.active_theme === t.id;
    const desc = state.currentLang === 'de' ? t.descDe : t.descEn;

    const row = document.createElement('div');
    row.className = 'theme-row' + (isActive ? ' active-theme' : '');
    row.innerHTML = `
      <div class="theme-meta">
        <div class="theme-swatches" title="${t.name}">
          ${t.colors.map(c => `<span class="theme-swatch-circle" style="background:${c}"></span>`).join('')}
        </div>
        <div class="theme-text-wrap">
          <div class="theme-name">${t.name}</div>
          <div class="theme-desc">${desc}</div>
        </div>
      </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'btn' + (isActive ? ' btn-primary' : '');

    if (isActive) {
      btn.textContent = d.themeActive;
      btn.disabled = true;
    } else {
      btn.textContent = d.themeSelect;
      btn.onclick = () => activateTheme(t.id);
    }

    row.appendChild(btn);
    dom.themesList.appendChild(row);
  });
}

function activateTheme(id) {
  state.profile.active_theme = id;
  setTheme(id);
  saveLocalState();
  renderThemeShop();
  updateAccountUI();
  const themeObj = THEMES.find(t => t.id === id);
  const themeName = themeObj ? themeObj.name : id;
  toast(`${t('toastThemeApplied')}: ${themeName}`);

  if (!state.isOffline && state.supabase && state.user) {
    state.supabase.from('profiles').update({ active_theme: id }).eq('id', state.user.id);
  }
}

// =============================================================================
// UI & TASTATUR EVENTS
// =============================================================================
function bindEvents() {
  // Sprachwechsel DE / EN
  dom.langToggleBtn.addEventListener('click', toggleLanguage);

  // Audio Toggle & Modal
  dom.audioToggleBtn.addEventListener('click', () => {
    if (!state.audioPlaying) {
      startAmbientSound();
    }
    openAudioModal();
  });

  // Theme Toggle (Hell/Dunkel)
  dom.themeToggleBtn.addEventListener('click', toggleDarkLight);

  // Rangliste Modal
  dom.openLeaderboardBtn.addEventListener('click', openLeaderboard);
  dom.closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
  dom.leaderboardModal.addEventListener('click', e => {
    if (e.target === dom.leaderboardModal) closeLeaderboard();
  });
  if (dom.leadModeZen) dom.leadModeZen.addEventListener('click', () => switchLeaderboardMode('zen'));
  if (dom.leadModeVersus) dom.leadModeVersus.addEventListener('click', () => switchLeaderboardMode('versus'));
  if (dom.leadModeSwap) dom.leadModeSwap.addEventListener('click', () => switchLeaderboardMode('swap'));
  dom.leadTabEasy.addEventListener('click', () => switchLeaderboardTab('easy'));
  dom.leadTabMedium.addEventListener('click', () => switchLeaderboardTab('medium'));
  dom.leadTabHard.addEventListener('click', () => switchLeaderboardTab('hard'));

  // Pause & Play Steuerung
  if (dom.btnPauseGame) dom.btnPauseGame.addEventListener('click', togglePause);
  if (dom.btnResumeGame) dom.btnResumeGame.addEventListener('click', resumeGame);

  // Board Result Overlay
  if (dom.btnResultNewGame) dom.btnResultNewGame.addEventListener('click', () => startNewGame());
  if (dom.btnResultSolution) dom.btnResultSolution.addEventListener('click', showFullSolution);
  if (dom.btnResultInspect) dom.btnResultInspect.addEventListener('click', hideResultOverlayForInspection);
  if (dom.btnHudReopen) dom.btnHudReopen.addEventListener('click', restoreResultOverlay);
  if (dom.btnHudSolution) dom.btnHudSolution.addEventListener('click', showFullSolution);

  // Audio & Soundtrack Modal
  if (dom.closeAudioBtn) dom.closeAudioBtn.addEventListener('click', closeAudioModal);
  if (dom.audioModal) dom.audioModal.addEventListener('click', e => {
    if (e.target === dom.audioModal) closeAudioModal();
  });
  if (dom.btnAudioTogglePlay) dom.btnAudioTogglePlay.addEventListener('click', toggleAmbientSound);
  if (dom.audioVolumeSlider) dom.audioVolumeSlider.addEventListener('input', e => setAudioVolume(e.target.value / 100));
  if (dom.audioTrackList) {
    dom.audioTrackList.addEventListener('click', e => {
      const btn = e.target.closest('.track-item');
      if (btn && btn.dataset.track) setAudioTrack(btn.dataset.track);
    });
  }

  // Account & Authentifizierung
  dom.openAccountBtn.addEventListener('click', openAccount);
  dom.closeAccountBtn.addEventListener('click', closeAccount);
  dom.btnSaveUsername.addEventListener('click', saveUsername);
  dom.accountModal.addEventListener('click', e => {
    if (e.target === dom.accountModal) closeAccount();
  });
  if (dom.tabAuthLogin) dom.tabAuthLogin.addEventListener('click', () => switchAuthMode('login'));
  if (dom.tabAuthRegister) dom.tabAuthRegister.addEventListener('click', () => switchAuthMode('register'));
  if (dom.authForm) dom.authForm.addEventListener('submit', e => {
    e.preventDefault();
    handleAuthSubmit();
  });
  if (dom.btnLogout) dom.btnLogout.addEventListener('click', logoutUser);

  // Spielregeln Info Button
  dom.helpModeBtn.addEventListener('click', showModeRules);
  dom.closeRulesBtn.addEventListener('click', () => dom.rulesModal.classList.add('hidden'));
  dom.rulesModal.addEventListener('click', e => {
    if (e.target === dom.rulesModal) dom.rulesModal.classList.add('hidden');
  });

  // Impressum & Datenschutz
  dom.openImpressumLink.addEventListener('click', e => {
    e.preventDefault();
    dom.impressumModal.classList.remove('hidden');
  });
  dom.closeImpressumBtn.addEventListener('click', () => dom.impressumModal.classList.add('hidden'));
  dom.impressumModal.addEventListener('click', e => {
    if (e.target === dom.impressumModal) dom.impressumModal.classList.add('hidden');
  });

  dom.openDatenschutzLink.addEventListener('click', e => {
    e.preventDefault();
    dom.datenschutzModal.classList.remove('hidden');
  });
  dom.closeDatenschutzBtn.addEventListener('click', () => dom.datenschutzModal.classList.add('hidden'));
  dom.datenschutzModal.addEventListener('click', e => {
    if (e.target === dom.datenschutzModal) dom.datenschutzModal.classList.add('hidden');
  });

  // Modi-Tabs
  dom.tabZen.addEventListener('click', () => setMode('zen'));
  dom.tabVersus.addEventListener('click', () => setMode('versus'));
  dom.tabSwap.addEventListener('click', () => setMode('swap'));

  // Zen Schwierigkeitsgrade
  dom.zenDiffEasy.addEventListener('click', () => setZenDifficulty('easy'));
  dom.zenDiffMedium.addEventListener('click', () => setZenDifficulty('medium'));
  dom.zenDiffHard.addEventListener('click', () => setZenDifficulty('hard'));

  // Versus Rätsel-Schwierigkeit
  dom.versusDiffEasy.addEventListener('click', () => setVersusDifficulty('easy'));
  dom.versusDiffMedium.addEventListener('click', () => setVersusDifficulty('medium'));
  dom.versusDiffHard.addEventListener('click', () => setVersusDifficulty('hard'));

  // Online vs Bot Umschalter
  dom.btnPlayOnline.addEventListener('click', () => setOpponentType('online'));
  dom.btnPlayBot.addEventListener('click', () => setOpponentType('bot'));

  // Bot-Geschwindigkeit & Start Button
  dom.diffEasy.addEventListener('click', () => setBotDifficulty('easy'));
  dom.diffMedium.addEventListener('click', () => setBotDifficulty('medium'));
  dom.diffHard.addEventListener('click', () => setBotDifficulty('hard'));
  dom.btnStartBotGame.addEventListener('click', () => {
    ensureGameStarted();
    startBotMatch();
  });

  // Raum-Lobby
  dom.createRoom.addEventListener('click', createRoom);
  dom.joinRoom.addEventListener('click', () => joinRoom(dom.roomInput.value.trim()));
  dom.roomInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') joinRoom(dom.roomInput.value.trim());
  });

  // Spielsteuerung (Toolbar)
  dom.btnErase.addEventListener('click', clearCell);
  dom.btnNewGame.addEventListener('click', () => startNewGame());
  if (dom.btnHint) dom.btnHint.addEventListener('click', useHint);
  dom.btnNotes.addEventListener('click', () => {
    ensureGameStarted();
    state.notesActive = !state.notesActive;
    dom.btnNotes.classList.toggle('active', state.notesActive);
    const d = I18N[state.currentLang] || I18N.de;
    dom.btnNotes.textContent = state.notesActive ? d.notesOn : d.notesOff;
  });

  // Numpad Klicks
  dom.numpad.addEventListener('click', e => {
    const btn = e.target.closest('.num');
    if (!btn) return;
    // Wenn autoLockCompleted aktiv ist, wird das Anklicken vollendeter Zahlen gesperrt; sonst bleibt es frei!
    if (state.autoLockCompleted && btn.classList.contains('locked')) return;
    handleNumberInput(parseInt(btn.dataset.num, 10));
  });

  // Tastatursteuerung
  window.addEventListener('keydown', e => {
    if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return;

    if (state.isPaused) {
      if (e.key.toLowerCase() === 'p' || e.code === 'Space') {
        e.preventDefault();
        resumeGame();
      }
      return;
    }

    if (e.key.toLowerCase() === 'p') {
      e.preventDefault();
      togglePause();
      return;
    }

    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      clearCell();
    } else if (e.key.toLowerCase() === 'n') {
      dom.btnNotes.click();
    } else if (e.key.toLowerCase() === 'h') {
      useHint();
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      moveSelection(e.key);
    }
  });

  // Theme Modal
  dom.openShop.addEventListener('click', () => {
    renderThemeShop();
    dom.shopModal.classList.remove('hidden');
  });
  dom.closeShop.addEventListener('click', () => dom.shopModal.classList.add('hidden'));
  dom.shopModal.addEventListener('click', e => {
    if (e.target === dom.shopModal) dom.shopModal.classList.add('hidden');
  });

  // Verhindere Browser-Zoom (Strg + Mausrad, Strg + Plus / Minus)
  window.addEventListener('wheel', e => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });
}

function moveSelection(key) {
  if (state.selectedIndex === null) {
    selectCell(0);
    return;
  }
  let r = Math.floor(state.selectedIndex / 9);
  let c = state.selectedIndex % 9;

  if (key === 'ArrowUp') r = (r - 1 + 9) % 9;
  if (key === 'ArrowDown') r = (r + 1) % 9;
  if (key === 'ArrowLeft') c = (c - 1 + 9) % 9;
  if (key === 'ArrowRight') c = (c + 1) % 9;

  selectCell(r * 9 + c);
}

function toast(msg) {
  dom.toast.textContent = msg;
  dom.toast.classList.remove('hidden');
  clearTimeout(dom.toast._t);
  dom.toast._t = setTimeout(() => dom.toast.classList.add('hidden'), 2400);
}

window.addEventListener('DOMContentLoaded', init);
