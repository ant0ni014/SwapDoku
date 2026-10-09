/**
 * ==============================================================================
 * SwapDoku / SyncDoku: Hauptanwendungs-Logik
 * Modul: Web Technologie (FOM-Seminararbeit)
 * 
 * Funktionen:
 * 1. Sudoku Engine: Deterministische Puzzle-Generierung, Solver & Validierung
 * 2. Supabase Integration: Anonyme Authentifizierung, PostgreSQL Sync & RPC
 * 3. Realtime Channels: WebSockets via Supabase (Broadcast & Presence)
 * 4. Versus & Co-Op Board-Swap: Synchrone 10s-Timer & Grid-Austausch
 * 5. Gamification & Theme-Engine: Dynamic CSS Variables & Shop
 * 6. Latenz-Evaluation: RTT Broadcast Messung für empirische Analyse
 * ==============================================================================
 */

// 1. KONFIGURATION & FALLBACK (Vercel / Local Setup)
// HINWEIS: Ersetze diese Werte durch deine Supabase-Projekt-Credentials aus dem Dashboard.
// Sollten Platzhalter aktiv sein, schaltet die App automatisch in einen sicheren Offline-Demo-Modus.
const SUPABASE_CONFIG = {
  url: window.__SUPABASE_URL__ || 'https://xyzcompany.supabase.co',
  anonKey: window.__SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key'
};

// 2. THEME DEFINITIONEN
const AVAILABLE_THEMES = [
  { id: 'nordic-light', name: 'Nordic Light', cost: 0, colors: ['#f8fafc', '#ffffff', '#2563eb'] },
  { id: 'dark-slate', name: 'Dark Slate', cost: 100, colors: ['#0f172a', '#1e293b', '#10b981'] },
  { id: 'matcha-paper', name: 'Matcha Paper', cost: 200, colors: ['#f4f5f0', '#283618', '#588157'] },
  { id: 'nordic-frost', name: 'Nordic Frost', cost: 300, colors: ['#f0f7ff', '#0c4a6e', '#0284c7'] }
];

// 3. ANWENDUNGS-ZUSTAND (Application State)
const state = {
  // Supabase Client & User
  supabase: null,
  user: null,
  isOfflineMode: false,
  profile: {
    sync_points: 0,
    active_theme: 'nordic-light',
    unlocked_themes: ['nordic-light']
  },

  // Game Mode: 'zen' | 'versus' | 'swap'
  mode: 'zen',
  
  // Sudoku Board Data (9x9 Arrays)
  solution: Array(81).fill(0),
  initialBoard: Array(81).fill(0),
  currentBoard: Array(81).fill(0),
  notes: Array.from({ length: 81 }, () => new Set()),
  
  // UI Selection
  selectedCellIndex: null,
  notesMode: false,

  // Realtime & Multiplayer
  channel: null,
  roomCode: null,
  isHost: false,
  peersCount: 0,
  opponentProgress: 0,
  
  // Board-Swap Co-Op Timer
  swapIntervalId: null,
  swapSecondsLeft: 10,

  // Evaluations-Metriken (Seminararbeit)
  lastBroadcastTimestamp: 0,
  rttMs: null
};

// 4. SUDOKU GENERATOR & VALIDATOR ENGINE
class SudokuEngine {
  /**
   * Erzeugt ein standardkonformes Sudoku.
   * Basierend auf Backtracking zur garantierten Lösbarkeit.
   */
  static generatePuzzle(cluesCount = 36) {
    const board = Array(81).fill(0);
    this.fillDiagonalBoxes(board);
    this.solveBoard(board);
    const solution = [...board];

    // Zufällig Zellen entfernen bis Ziel-Clues erreicht sind
    const puzzle = [...solution];
    let toRemove = 81 - cluesCount;
    const indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);

    for (const index of indices) {
      if (toRemove <= 0) break;
      puzzle[index] = 0;
      toRemove--;
    }

    return { solution, initialBoard: puzzle };
  }

  static fillDiagonalBoxes(board) {
    for (let box = 0; box < 9; box += 3) {
      this.fillBox(board, box, box);
    }
  }

  static fillBox(board, startRow, startCol) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cellIndex = (startRow + r) * 9 + (startCol + c);
        board[cellIndex] = nums[idx++];
      }
    }
  }

  static isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row * 9 + i] === num) return false;
      if (board[i * 9 + col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[(startRow + r) * 9 + (startCol + c)] === num) return false;
      }
    }
    return true;
  }

  static solveBoard(board) {
    for (let i = 0; i < 81; i++) {
      if (board[i] === 0) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (const num of nums) {
          if (this.isValid(board, row, col, num)) {
            board[i] = num;
            if (this.solveBoard(board)) return true;
            board[i] = 0;
          }
        }
        return false;
      }
    }
    return true;
  }

  /**
   * Prüft, ob das aktuelle Board vollständig und konfliktfrei gefüllt ist.
   */
  static isCompleteAndValid(currentBoard, solution) {
    for (let i = 0; i < 81; i++) {
      if (currentBoard[i] === 0) return false;
      if (currentBoard[i] !== solution[i]) return false;
    }
    return true;
  }

  static countSolvedCells(currentBoard, solution) {
    let count = 0;
    for (let i = 0; i < 81; i++) {
      if (currentBoard[i] !== 0 && currentBoard[i] === solution[i]) {
        count++;
      }
    }
    return count;
  }
}

// 5. DOM-ELEMENTE
const dom = {
  themeHtml: document.documentElement,
  userPoints: document.getElementById('userPoints'),
  pointsBadge: document.getElementById('pointsBadge'),
  openShopBtn: document.getElementById('openShopBtn'),
  closeShopBtn: document.getElementById('closeShopBtn'),
  themeModal: document.getElementById('themeModal'),
  themesContainer: document.getElementById('themesContainer'),
  tabZen: document.getElementById('tabZen'),
  tabVersus: document.getElementById('tabVersus'),
  tabSwap: document.getElementById('tabSwap'),
  multiplayerLobby: document.getElementById('multiplayerLobby'),
  createRoomBtn: document.getElementById('createRoomBtn'),
  joinRoomBtn: document.getElementById('joinRoomBtn'),
  roomCodeInput: document.getElementById('roomCodeInput'),
  roomCodeDisplay: document.getElementById('roomCodeDisplay'),
  currentRoomCode: document.getElementById('currentRoomCode'),
  connDot: document.getElementById('connDot'),
  connText: document.getElementById('connText'),
  gameHud: document.getElementById('gameHud'),
  versusBars: document.getElementById('versusBars'),
  playerProgressBar: document.getElementById('playerProgressBar'),
  opponentProgressBar: document.getElementById('opponentProgressBar'),
  playerProgressLabel: document.getElementById('playerProgressLabel'),
  opponentProgressLabel: document.getElementById('opponentProgressLabel'),
  swapTimerBox: document.getElementById('swapTimerBox'),
  swapTimer: document.getElementById('swapTimer'),
  latencyDisplay: document.getElementById('latencyDisplay'),
  rttValue: document.getElementById('rttValue'),
  sudokuGrid: document.getElementById('sudokuGrid'),
  btnErase: document.getElementById('btnErase'),
  btnNotes: document.getElementById('btnNotes'),
  notesStatus: document.getElementById('notesStatus'),
  btnNewGame: document.getElementById('btnNewGame'),
  numpad: document.getElementById('numpad'),
  toast: document.getElementById('toast')
};

// 6. INITIALISIERUNG
async function initApp() {
  initSudokuDOM();
  setupEventListeners();
  await initSupabaseAuth();
  startNewGame();
}

/**
 * Erzeugt die 81 Zellen des Sudoku-Gitters
 */
function initSudokuDOM() {
  dom.sudokuGrid.innerHTML = '';
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    
    // Notizen Subgrid
    const notesGrid = document.createElement('div');
    notesGrid.className = 'notes-grid';
    for (let n = 1; n <= 9; n++) {
      const noteItem = document.createElement('span');
      noteItem.className = 'note-item';
      noteItem.dataset.note = n;
      notesGrid.appendChild(noteItem);
    }
    cell.appendChild(notesGrid);

    // Klick auf Zelle
    cell.addEventListener('click', () => selectCell(i));
    dom.sudokuGrid.appendChild(cell);
  }
}

/**
 * Anbindung an Supabase Auth (Anonym) & Realtime Client
 */
async function initSupabaseAuth() {
  try {
    if (!window.supabase || SUPABASE_CONFIG.url.includes('xyzcompany')) {
      console.warn('[SwapDoku] Supabase Credentials nicht konfiguriert. Verwende Offline/Demo-Modus.');
      state.isOfflineMode = true;
      loadLocalProfile();
      updateUIProfile();
      return;
    }

    state.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      realtime: { params: { eventsPerSecond: 10 } }
    });

    // Anonyme Session anfragen/wiederherstellen
    const { data: sessionData, error: sessionErr } = await state.supabase.auth.getSession();
    let currentSession = sessionData?.session;

    if (!currentSession || sessionErr) {
      const { data: authData, error: authErr } = await state.supabase.auth.signInAnonymously();
      if (authErr) throw authErr;
      currentSession = authData.session;
    }

    state.user = currentSession.user;
    console.log('[SwapDoku] Authentifiziert als anonymer User:', state.user.id);

    // Profil und freigeschaltete Themes aus PostgreSQL laden
    await fetchProfileFromSupabase();
  } catch (err) {
    console.warn('[SwapDoku] Supabase Fehler, Fallback auf Offline:', err.message);
    state.isOfflineMode = true;
    loadLocalProfile();
    updateUIProfile();
  }
}

async function fetchProfileFromSupabase() {
  if (state.isOfflineMode || !state.supabase || !state.user) return;
  try {
    const { data: profile, error } = await state.supabase
      .from('profiles')
      .select('sync_points, active_theme')
      .eq('id', state.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[SwapDoku] Profil-Ladefehler:', error);
      return;
    }

    if (profile) {
      state.profile.sync_points = profile.sync_points;
      state.profile.active_theme = profile.active_theme;
    }

    // Freigeschaltete Themes
    const { data: unlocked } = await state.supabase
      .from('unlocked_themes')
      .select('theme_id')
      .eq('user_id', state.user.id);

    if (unlocked && unlocked.length > 0) {
      state.profile.unlocked_themes = unlocked.map(u => u.theme_id);
    }

    applyTheme(state.profile.active_theme);
    updateUIProfile();
  } catch (e) {
    console.error('[SwapDoku] Fehler beim Laden des Profils:', e);
  }
}

function loadLocalProfile() {
  const saved = localStorage.getItem('swapdoku_profile');
  if (saved) {
    try {
      state.profile = JSON.parse(saved);
    } catch (_) {}
  }
  applyTheme(state.profile.active_theme);
}

function saveLocalProfile() {
  localStorage.setItem('swapdoku_profile', JSON.stringify(state.profile));
}

function updateUIProfile() {
  dom.userPoints.textContent = state.profile.sync_points;
}

// 7. SPIELSTART & LOGIK
function startNewGame(sharedBoard = null, sharedSolution = null) {
  stopSwapTimer();

  if (sharedBoard && sharedSolution) {
    state.initialBoard = [...sharedBoard];
    state.currentBoard = [...sharedBoard];
    state.solution = [...sharedSolution];
  } else {
    const { solution, initialBoard } = SudokuEngine.generatePuzzle(36);
    state.solution = solution;
    state.initialBoard = [...initialBoard];
    state.currentBoard = [...initialBoard];
  }

  // Notizen zurücksetzen
  state.notes = Array.from({ length: 81 }, () => new Set());
  state.selectedCellIndex = null;
  state.opponentProgress = 0;
  updateOpponentProgress(0);
  updateLocalProgress();

  renderBoard();

  if (state.mode === 'swap') {
    startSwapTimer();
  }
}

function renderBoard() {
  const cells = dom.sudokuGrid.children;
  for (let i = 0; i < 81; i++) {
    const cell = cells[i];
    const val = state.currentBoard[i];
    const isGiven = state.initialBoard[i] !== 0;

    // Klassen zurücksetzen
    cell.className = 'cell';
    if (isGiven) cell.classList.add('given');
    if (state.selectedCellIndex === i) cell.classList.add('selected');

    // Zell-Inhalt vs Notizen
    const notesGrid = cell.querySelector('.notes-grid');
    if (val !== 0) {
      cell.childNodes[0].nodeValue = val;
      notesGrid.style.display = 'none';
    } else {
      cell.childNodes[0].nodeValue = '';
      notesGrid.style.display = 'grid';
      const noteItems = notesGrid.children;
      for (let n = 1; n <= 9; n++) {
        noteItems[n - 1].textContent = state.notes[i].has(n) ? n : '';
      }
    }
  }
}

function selectCell(index) {
  state.selectedCellIndex = index;
  highlightRelatedCells(index);
  renderBoard();
}

function highlightRelatedCells(index) {
  const cells = dom.sudokuGrid.children;
  const row = Math.floor(index / 9);
  const col = index % 9;
  const selectedValue = state.currentBoard[index];

  for (let i = 0; i < 81; i++) {
    const r = Math.floor(i / 9);
    const c = i % 9;
    const sameBox = Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3);

    cells[i].classList.remove('highlighted');
    if (i !== index && (r === row || c === col || sameBox || (selectedValue !== 0 && state.currentBoard[i] === selectedValue))) {
      cells[i].classList.add('highlighted');
    }
  }
}

function handleInput(digit) {
  const idx = state.selectedCellIndex;
  if (idx === null) return;
  if (state.initialBoard[idx] !== 0) return; // Vorgegebene Zahlen sind gesperrt

  if (state.notesMode) {
    // Notiz toggeln
    if (state.notes[idx].has(digit)) {
      state.notes[idx].delete(digit);
    } else {
      state.notes[idx].add(digit);
    }
    state.currentBoard[idx] = 0;
  } else {
    // Feste Zahl eintragen
    state.currentBoard[idx] = digit;
    state.notes[idx].clear();

    // Validierung auf Fehler prüfen
    const cellEl = dom.sudokuGrid.children[idx];
    if (digit !== state.solution[idx]) {
      cellEl.classList.add('error');
    } else {
      cellEl.classList.remove('error');
    }

    // Fortschritt & Siegprüfung
    checkGameProgress();
  }

  renderBoard();
}

function eraseCell() {
  const idx = state.selectedCellIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  state.currentBoard[idx] = 0;
  state.notes[idx].clear();
  const cellEl = dom.sudokuGrid.children[idx];
  cellEl.classList.remove('error');

  updateLocalProgress();
  renderBoard();
}

// 8. FORTSCHRITT & GAMIFICATION BELOHNUNG
async function checkGameProgress() {
  updateLocalProgress();

  // Im Versus-Modus: Füllstand via Broadcast übertragen
  if (state.mode === 'versus' && state.channel) {
    const solved = SudokuEngine.countSolvedCells(state.currentBoard, state.solution);
    broadcastMessage('PROGRESS', {
      solvedCount: solved,
      totalCount: 81,
      timestamp: Date.now()
    });
  }

  // Siegprüfung
  if (SudokuEngine.isCompleteAndValid(state.currentBoard, state.solution)) {
    handleVictory();
  }
}

function updateLocalProgress() {
  const solved = SudokuEngine.countSolvedCells(state.currentBoard, state.solution);
  const percentage = Math.round((solved / 81) * 100);
  dom.playerProgressBar.style.width = `${percentage}%`;
  dom.playerProgressLabel.textContent = `${percentage}%`;
}

function updateOpponentProgress(percentage) {
  dom.opponentProgressBar.style.width = `${percentage}%`;
  dom.opponentProgressLabel.textContent = `${percentage}%`;
}

async function handleVictory() {
  let earnedPoints = 50;
  if (state.mode === 'versus') earnedPoints = 100;
  if (state.mode === 'swap') earnedPoints = 75;

  showToast(`Glückwunsch! Rätsel gelöst (+${earnedPoints} Pts)`);

  if (state.mode === 'versus' && state.channel) {
    broadcastMessage('GAME_OVER', { winnerId: state.user?.id || 'local' });
  }

  // Punkte gutschreiben
  await awardSyncPoints(earnedPoints);
}

async function awardSyncPoints(points) {
  if (state.isOfflineMode || !state.supabase) {
    state.profile.sync_points += points;
    saveLocalProfile();
    updateUIProfile();
    return;
  }

  try {
    const { data: newPoints, error } = await state.supabase.rpc('add_sync_points', {
      points_to_add: points
    });

    if (error) throw error;
    state.profile.sync_points = newPoints;
    updateUIProfile();
  } catch (err) {
    console.error('[SwapDoku] Punkte-Update-Fehler:', err);
    // Optimistisches Fallback
    state.profile.sync_points += points;
    updateUIProfile();
  }
}

// 9. REALTIME BROADCAST & MULTIPLAYER LOBBY
function switchMode(newMode) {
  state.mode = newMode;
  [dom.tabZen, dom.tabVersus, dom.tabSwap].forEach(tab => tab.classList.remove('active'));

  if (newMode === 'zen') {
    dom.tabZen.classList.add('active');
    dom.multiplayerLobby.classList.add('hidden');
    dom.versusBars.classList.add('hidden');
    dom.swapTimerBox.classList.add('hidden');
    leaveCurrentRoom();
  } else if (newMode === 'versus') {
    dom.tabVersus.classList.add('active');
    dom.multiplayerLobby.classList.remove('hidden');
    dom.versusBars.classList.remove('hidden');
    dom.swapTimerBox.classList.add('hidden');
  } else if (newMode === 'swap') {
    dom.tabSwap.classList.add('active');
    dom.multiplayerLobby.classList.remove('hidden');
    dom.versusBars.classList.add('hidden');
    dom.swapTimerBox.classList.remove('hidden');
  }

  startNewGame();
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

async function createRoom() {
  const code = generateRoomCode();
  state.isHost = true;
  await joinRoom(code);
}

async function joinRoom(code) {
  if (!code || code.length !== 4) {
    showToast('Bitte einen 4-stelligen Raum-Code eingeben.');
    return;
  }

  leaveCurrentRoom();
  state.roomCode = code.toUpperCase();
  dom.currentRoomCode.textContent = state.roomCode;
  dom.roomCodeDisplay.classList.remove('hidden');
  setConnectionStatus('connecting', 'Verbinde...');

  if (state.isOfflineMode || !state.supabase) {
    showToast('Multiplayer benötigt gültige Supabase-Konfiguration.');
    setConnectionStatus('connected', `Demo-Raum ${state.roomCode}`);
    return;
  }

  const channelName = `swapdoku-room:${state.roomCode}`;
  state.channel = state.supabase.channel(channelName, {
    config: {
      broadcast: { self: false },
      presence: { key: state.user?.id || 'anon-' + Math.random().toString(36).substring(2, 7) }
    }
  });

  // 1. Presence: Spielerzählung
  state.channel.on('presence', { event: 'sync' }, () => {
    const presenceState = state.channel.presenceState();
    state.peersCount = Object.keys(presenceState).length;
    setConnectionStatus('connected', `${state.peersCount} Spieler im Raum`);

    // Wenn Host und zweiter Spieler beigetreten ist: Spiel synchron starten
    if (state.isHost && state.peersCount === 2) {
      if (state.mode === 'versus') {
        broadcastMessage('INIT_VERSUS', {
          initialBoard: state.initialBoard,
          solution: state.solution
        });
      }
    }
  });

  // 2. Broadcast Events
  state.channel
    .on('broadcast', { event: 'INIT_VERSUS' }, ({ payload }) => {
      showToast('Versus gestartet! Gleiches Board synchronisiert.');
      startNewGame(payload.initialBoard, payload.solution);
    })
    .on('broadcast', { event: 'PROGRESS' }, ({ payload }) => {
      // Evaluations-Metrik: Round Trip Time (RTT) Latenzberechnung
      if (payload.timestamp) {
        state.rttMs = Date.now() - payload.timestamp;
        dom.rttValue.textContent = state.rttMs;
      }
      const oppPercent = Math.round((payload.solvedCount / payload.totalCount) * 100);
      updateOpponentProgress(oppPercent);
    })
    .on('broadcast', { event: 'SWAP_BOARDS' }, ({ payload }) => {
      handleIncomingBoardSwap(payload);
    })
    .on('broadcast', { event: 'GAME_OVER' }, () => {
      showToast('Der Gegner hat das Rätsel zuerst gelöst!');
    });

  // Channel abonnieren
  state.channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      setConnectionStatus('connected', 'Verbunden');
      await state.channel.track({
        joinedAt: new Date().toISOString(),
        mode: state.mode
      });
      showToast(`Raum ${state.roomCode} beigetreten.`);
    }
  });
}

function broadcastMessage(event, payload) {
  if (!state.channel) return;
  state.lastBroadcastTimestamp = Date.now();
  state.channel.send({
    type: 'broadcast',
    event,
    payload: { ...payload, timestamp: Date.now() }
  });
}

function leaveCurrentRoom() {
  if (state.channel) {
    state.channel.unsubscribe();
    state.channel = null;
  }
  state.roomCode = null;
  state.isHost = false;
  dom.roomCodeDisplay.classList.add('hidden');
  setConnectionStatus('disconnected', 'Nicht verbunden');
}

function setConnectionStatus(status, text) {
  dom.connDot.className = 'dot ' + (status === 'connected' ? 'connected' : status === 'connecting' ? 'connecting' : '');
  dom.connText.textContent = text;
}

// 10. CO-OP BOARD-SWAP TIMER & MECHANIK
function startSwapTimer() {
  stopSwapTimer();
  state.swapSecondsLeft = 10;
  dom.swapTimer.textContent = `${state.swapSecondsLeft}s`;

  state.swapIntervalId = setInterval(() => {
    state.swapSecondsLeft--;
    dom.swapTimer.textContent = `${state.swapSecondsLeft}s`;

    if (state.swapSecondsLeft <= 0) {
      state.swapSecondsLeft = 10;
      triggerBoardSwap();
    }
  }, 1000);
}

function stopSwapTimer() {
  if (state.swapIntervalId) {
    clearInterval(state.swapIntervalId);
    state.swapIntervalId = null;
  }
}

/**
 * Löst das SWAP_BOARDS Event aus: Eigene Boards werden verpackt und übers Netzwerk geschickt.
 */
function triggerBoardSwap() {
  // Visuelle 3D-Flip Animation
  dom.sudokuGrid.classList.add('swapping');
  setTimeout(() => dom.sudokuGrid.classList.remove('swapping'), 600);

  if (state.channel) {
    broadcastMessage('SWAP_BOARDS', {
      currentBoard: state.currentBoard,
      initialBoard: state.initialBoard,
      solution: state.solution,
      senderId: state.user?.id || 'player'
    });
  } else {
    // Im lokalen Co-Op Demo Modus: Board einfach mit einem alternativen Puzzle austauschen
    const { solution, initialBoard } = SudokuEngine.generatePuzzle(34);
    state.solution = solution;
    state.initialBoard = initialBoard;
    state.currentBoard = [...initialBoard];
    renderBoard();
    showToast('SWAP! Lokales Board ausgetauscht.');
  }
}

function handleIncomingBoardSwap(payload) {
  dom.sudokuGrid.classList.add('swapping');
  setTimeout(() => dom.sudokuGrid.classList.remove('swapping'), 600);

  // Neues Board des Partners übernehmen
  state.currentBoard = [...payload.currentBoard];
  state.initialBoard = [...payload.initialBoard];
  state.solution = [...payload.solution];
  state.selectedCellIndex = null;

  renderBoard();
  updateLocalProgress();
  showToast('SWAP! Du spielst jetzt am Board deines Partners!');
}

// 11. THEME-ENGINE & GAMIFICATION SHOP
function applyTheme(themeId) {
  dom.themeHtml.setAttribute('data-theme', themeId);
}

function openThemeShop() {
  renderThemeShop();
  dom.themeModal.classList.remove('hidden');
}

function closeThemeShop() {
  dom.themeModal.classList.add('hidden');
}

function renderThemeShop() {
  dom.themesContainer.innerHTML = '';

  AVAILABLE_THEMES.forEach(theme => {
    const isUnlocked = state.profile.unlocked_themes.includes(theme.id);
    const isActive = state.profile.active_theme === theme.id;
    const canAfford = state.profile.sync_points >= theme.cost;

    const card = document.createElement('div');
    card.className = 'theme-card';

    const info = document.createElement('div');
    info.className = 'theme-info';
    info.innerHTML = `
      <div class="theme-title">${theme.name} ${isActive ? '(Aktiv)' : ''}</div>
      <div class="theme-cost">${theme.cost === 0 ? 'Kostenlos' : theme.cost + ' Pts'}</div>
      <div class="theme-swatches">
        ${theme.colors.map(c => `<span class="swatch" style="background:${c}"></span>`).join('')}
      </div>
    `;

    const actionBtn = document.createElement('button');
    actionBtn.className = 'btn btn-secondary';

    if (isActive) {
      actionBtn.textContent = 'Aktiv';
      actionBtn.disabled = true;
    } else if (isUnlocked) {
      actionBtn.textContent = 'Aktivieren';
      actionBtn.onclick = () => activateTheme(theme.id);
    } else {
      actionBtn.textContent = `Freischalten (${theme.cost} Pts)`;
      actionBtn.disabled = !canAfford;
      actionBtn.onclick = () => buyTheme(theme.id, theme.cost);
    }

    card.appendChild(info);
    card.appendChild(actionBtn);
    dom.themesContainer.appendChild(card);
  });
}

async function activateTheme(themeId) {
  state.profile.active_theme = themeId;
  applyTheme(themeId);
  renderThemeShop();

  if (!state.isOfflineMode && state.supabase && state.user) {
    await state.supabase.from('profiles').update({ active_theme: themeId }).eq('id', state.user.id);
  } else {
    saveLocalProfile();
  }
}

async function buyTheme(themeId, cost) {
  if (state.profile.sync_points < cost) {
    showToast('Nicht genügend Sync-Points!');
    return;
  }

  if (state.isOfflineMode || !state.supabase) {
    state.profile.sync_points -= cost;
    state.profile.unlocked_themes.push(themeId);
    state.profile.active_theme = themeId;
    saveLocalProfile();
    applyTheme(themeId);
    updateUIProfile();
    renderThemeShop();
    showToast(`${themeId} erfolgreich freigeschaltet!`);
    return;
  }

  try {
    const { error } = await state.supabase.rpc('purchase_theme', {
      theme_name: themeId,
      cost: cost
    });

    if (error) throw error;

    state.profile.sync_points -= cost;
    state.profile.unlocked_themes.push(themeId);
    state.profile.active_theme = themeId;
    applyTheme(themeId);
    updateUIProfile();
    renderThemeShop();
    showToast(`${themeId} erfolgreich freigeschaltet!`);
  } catch (err) {
    showToast(`Fehler beim Kauf: ${err.message}`);
  }
}

// 12. EVENT LISTENERS & TASTATUR-STEUERUNG
function setupEventListeners() {
  // Modus-Umschaltung
  dom.tabZen.addEventListener('click', () => switchMode('zen'));
  dom.tabVersus.addEventListener('click', () => switchMode('versus'));
  dom.tabSwap.addEventListener('click', () => switchMode('swap'));

  // Raum-Lobby
  dom.createRoomBtn.addEventListener('click', createRoom);
  dom.joinRoomBtn.addEventListener('click', () => joinRoom(dom.roomCodeInput.value.trim()));
  dom.roomCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinRoom(dom.roomCodeInput.value.trim());
  });

  // Tools & Numpad
  dom.btnErase.addEventListener('click', eraseCell);
  dom.btnNewGame.addEventListener('click', () => startNewGame());
  dom.btnNotes.addEventListener('click', () => {
    state.notesMode = !state.notesMode;
    dom.btnNotes.classList.toggle('active', state.notesMode);
    dom.notesStatus.textContent = `Notizen: ${state.notesMode ? 'An' : 'Aus'}`;
  });

  dom.numpad.addEventListener('click', (e) => {
    const btn = e.target.closest('.num-key');
    if (!btn) return;
    const digit = parseInt(btn.dataset.digit, 10);
    handleInput(digit);
  });

  // Physische Tastatur-Eingaben
  window.addEventListener('keydown', (e) => {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
      handleInput(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      eraseCell();
    } else if (e.key === 'n' || e.key === 'N') {
      dom.btnNotes.click();
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      handleArrowNavigation(e.key);
    }
  });

  // Theme Shop
  dom.openShopBtn.addEventListener('click', openThemeShop);
  dom.closeShopBtn.addEventListener('click', closeThemeShop);
  dom.themeModal.addEventListener('click', (e) => {
    if (e.target === dom.themeModal) closeThemeShop();
  });
}

function handleArrowNavigation(key) {
  if (state.selectedCellIndex === null) {
    selectCell(0);
    return;
  }
  let row = Math.floor(state.selectedCellIndex / 9);
  let col = state.selectedCellIndex % 9;

  if (key === 'ArrowUp') row = (row - 1 + 9) % 9;
  if (key === 'ArrowDown') row = (row + 1) % 9;
  if (key === 'ArrowLeft') col = (col - 1 + 9) % 9;
  if (key === 'ArrowRight') col = (col + 1) % 9;

  selectCell(row * 9 + col);
}

function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.classList.remove('hidden');
  clearTimeout(dom.toast._timeout);
  dom.toast._timeout = setTimeout(() => {
    dom.toast.classList.add('hidden');
  }, 2800);
}

// 13. BOOTSTRAP BEIM LADEN
window.addEventListener('DOMContentLoaded', initApp);
