/**
 * SwapDoku: Kernlogik, Realtime-Synchronisation, Bot-Engine, Gamification, Rangliste & Audio
 */

const SUPABASE_CONFIG = {
  url: window.__SUPABASE_URL__ || 'https://xyzcompany.supabase.co',
  anonKey: window.__SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key'
};

const THEMES = [
  { id: 'nordic-light', name: 'Nordic Light', cost: 0 },
  { id: 'dark-slate', name: 'Dark Slate', cost: 100 },
  { id: 'matcha-paper', name: 'Matcha Paper', cost: 200 },
  { id: 'nordic-frost', name: 'Nordic Frost', cost: 300 }
];

const state = {
  supabase: null,
  user: null,
  isOffline: false,
  profile: {
    username: 'Spieler',
    sync_points: 0,
    active_theme: 'nordic-light',
    unlocked_themes: ['nordic-light']
  },

  mode: 'zen', // 'zen' | 'versus' | 'swap'
  zenDifficulty: 'medium', // 'easy' (5 ★), 'medium' (3 ★), 'hard' (1 ★)
  opponentType: 'online', // 'online' | 'bot'
  botDifficulty: 'medium', // 'easy' | 'medium' | 'hard'
  botRunning: false,
  
  // Sterne / Fehlerbegrenzung
  maxHearts: 3,
  currentHearts: 3,
  isGameOver: false,

  // Spielzeit-Timer
  gameSeconds: 0,
  gameTimerInterval: null,

  // Ambient Audio
  audioPlaying: false,
  audioContext: null,
  audioGainNode: null,

  // Sudoku Board Arrays (Länge 81)
  solution: Array(81).fill(0),
  initialBoard: Array(81).fill(0),
  currentBoard: Array(81).fill(0),
  notes: Array.from({ length: 81 }, () => new Set()),
  
  selectedIndex: null,
  notesActive: false,

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

// Sudoku Backtracking Generator
class SudokuEngine {
  static generate(clues = 34) {
    const board = Array(81).fill(0);
    this.fillBoxes(board);
    this.solve(board);
    const solution = [...board];

    const puzzle = [...solution];
    let toRemove = 81 - clues;
    const indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);

    for (const idx of indices) {
      if (toRemove <= 0) break;
      puzzle[idx] = 0;
      toRemove--;
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

// DOM Referenzen
const dom = {
  root: document.documentElement,
  points: document.getElementById('userPoints'),
  audioToggleBtn: document.getElementById('audioToggleBtn'),
  audioToggleIcon: document.getElementById('audioToggleIcon'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeToggleIcon: document.getElementById('themeToggleIcon'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  openAccountBtn: document.getElementById('openAccountBtn'),
  openShop: document.getElementById('openShopBtn'),
  closeShop: document.getElementById('closeShopBtn'),
  shopModal: document.getElementById('themeModal'),
  themesList: document.getElementById('themesContainer'),
  leaderboardModal: document.getElementById('leaderboardModal'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  usernameInput: document.getElementById('usernameInput'),
  btnSaveUsername: document.getElementById('btnSaveUsername'),
  myRankInfo: document.getElementById('myRankInfo'),
  myRankPoints: document.getElementById('myRankPoints'),
  leaderboardBody: document.getElementById('leaderboardBody'),
  accountModal: document.getElementById('accountModal'),
  closeAccountBtn: document.getElementById('closeAccountBtn'),
  accountPointsVal: document.getElementById('accountPointsVal'),
  accountThemeVal: document.getElementById('accountThemeVal'),
  accountAuthStatus: document.getElementById('accountAuthStatus'),
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
  tabZen: document.getElementById('tabZen'),
  tabVersus: document.getElementById('tabVersus'),
  tabSwap: document.getElementById('tabSwap'),
  zenDifficultyBar: document.getElementById('zenDifficultyBar'),
  zenDiffEasy: document.getElementById('zenDiffEasy'),
  zenDiffMedium: document.getElementById('zenDiffMedium'),
  zenDiffHard: document.getElementById('zenDiffHard'),
  lobby: document.getElementById('multiplayerLobby'),
  btnPlayOnline: document.getElementById('btnPlayOnline'),
  btnPlayBot: document.getElementById('btnPlayBot'),
  onlineSection: document.getElementById('onlineSection'),
  botSection: document.getElementById('botSection'),
  btnStartBotGame: document.getElementById('btnStartBotGame'),
  diffEasy: document.getElementById('diffEasy'),
  diffMedium: document.getElementById('diffMedium'),
  diffHard: document.getElementById('diffHard'),
  createRoom: document.getElementById('createRoomBtn'),
  joinRoom: document.getElementById('joinRoomBtn'),
  roomInput: document.getElementById('roomCodeInput'),
  roomDisplay: document.getElementById('roomCodeDisplay'),
  currentRoom: document.getElementById('currentRoomCode'),
  connDot: document.getElementById('connDot'),
  connText: document.getElementById('connText'),
  gameHud: document.getElementById('gameHud'),
  heartsWrap: document.getElementById('heartsWrap'),
  heartsDisplay: document.getElementById('heartsDisplay'),
  gameTimerDisplay: document.getElementById('gameTimerDisplay'),
  versusBars: document.getElementById('versusBars'),
  playerBar: document.getElementById('playerProgressBar'),
  opponentBar: document.getElementById('opponentProgressBar'),
  playerLabel: document.getElementById('playerProgressLabel'),
  opponentLabel: document.getElementById('opponentProgressLabel'),
  opponentLabelText: document.getElementById('opponentLabelText'),
  swapBox: document.getElementById('swapTimerBox'),
  swapTimer: document.getElementById('swapTimer'),
  swapPartnerLabel: document.getElementById('swapPartnerLabel'),
  grid: document.getElementById('sudokuGrid'),
  btnNotes: document.getElementById('btnNotes'),
  btnErase: document.getElementById('btnErase'),
  btnNewGame: document.getElementById('btnNewGame'),
  numpad: document.getElementById('numpad'),
  toast: document.getElementById('toast')
};

// Initialisierung
async function init() {
  buildGrid();
  bindEvents();
  await initAuth();
  startNewGame();
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

async function initAuth() {
  try {
    if (!window.supabase || SUPABASE_CONFIG.url.includes('xyzcompany')) {
      state.isOffline = true;
      loadLocalState();
      updatePointsDisplay();
      return;
    }

    state.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    const { data: sessionData } = await state.supabase.auth.getSession();
    let session = sessionData?.session;

    if (!session) {
      const { data: authData, error } = await state.supabase.auth.signInAnonymously();
      if (error) throw error;
      session = authData.session;
    }

    state.user = session.user;
    await syncProfileFromDB();
  } catch (e) {
    state.isOffline = true;
    loadLocalState();
    updatePointsDisplay();
  }
}

async function syncProfileFromDB() {
  if (!state.supabase || !state.user) return;
  try {
    const { data } = await state.supabase.from('profiles').select('username, sync_points, active_theme').eq('id', state.user.id).single();
    if (data) {
      state.profile.username = data.username || 'Spieler';
      state.profile.sync_points = data.sync_points || 0;
      state.profile.active_theme = data.active_theme || 'nordic-light';
    }
    const { data: themes } = await state.supabase.from('unlocked_themes').select('theme_id').eq('user_id', state.user.id);
    if (themes) {
      state.profile.unlocked_themes = themes.map(t => t.theme_id);
    }
    setTheme(state.profile.active_theme);
    updatePointsDisplay();
  } catch (_) {}
}

function loadLocalState() {
  const saved = localStorage.getItem('swapdoku_state');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      state.profile = { ...state.profile, ...parsed };
    } catch (_) {}
  }
  setTheme(state.profile.active_theme);
}

function saveLocalState() {
  localStorage.setItem('swapdoku_state', JSON.stringify(state.profile));
}

function updatePointsDisplay() {
  dom.points.textContent = state.profile.sync_points;
  if (dom.accountPointsVal) dom.accountPointsVal.textContent = state.profile.sync_points;
  if (dom.accountThemeVal) {
    const activeObj = THEMES.find(t => t.id === state.profile.active_theme);
    dom.accountThemeVal.textContent = activeObj ? activeObj.name : state.profile.active_theme;
  }
}

// -----------------------------------------------------------------------------
// TIMER- & ZEITMESSUNG
// -----------------------------------------------------------------------------
function startStopwatch() {
  stopStopwatch();
  state.gameSeconds = 0;
  updateStopwatchDisplay();

  state.gameTimerInterval = setInterval(() => {
    state.gameSeconds++;
    updateStopwatchDisplay();
  }, 1000);
}

function stopStopwatch() {
  if (state.gameTimerInterval) {
    clearInterval(state.gameTimerInterval);
    state.gameTimerInterval = null;
  }
}

function updateStopwatchDisplay() {
  const mins = Math.floor(state.gameSeconds / 60);
  const secs = state.gameSeconds % 60;
  dom.gameTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// -----------------------------------------------------------------------------
// ENTSPANNTER AMBIENT-SOUND (WEB AUDIO SYNTHESIZER)
// -----------------------------------------------------------------------------
function toggleAmbientSound() {
  if (state.audioPlaying) {
    stopAmbientSound();
  } else {
    startAmbientSound();
  }
}

function startAmbientSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    if (!state.audioContext) {
      state.audioContext = new AudioContext();
    }
    
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    // Sanfte Zen-Harmonien (C-Dur / Pentatonik Pad)
    const freqs = [130.81, 164.81, 196.00, 261.63, 329.63]; // C3, E3, G3, C4, E4
    state.audioGainNode = state.audioContext.createGain();
    state.audioGainNode.gain.setValueAtTime(0.05, state.audioContext.currentTime);
    state.audioGainNode.connect(state.audioContext.destination);

    state.activeOscillators = [];
    freqs.forEach(freq => {
      const osc = state.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioContext.currentTime);

      const filter = state.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, state.audioContext.currentTime);

      osc.connect(filter);
      filter.connect(state.audioGainNode);
      osc.start();
      state.activeOscillators.push(osc);
    });

    state.audioPlaying = true;
    dom.audioToggleBtn.classList.add('active');
    toast('Entspannte Ambient-Musik an');
  } catch (err) {
    console.warn('Audio-Init:', err);
  }
}

function stopAmbientSound() {
  if (state.activeOscillators) {
    state.activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (_) {}
    });
    state.activeOscillators = [];
  }
  state.audioPlaying = false;
  dom.audioToggleBtn.classList.remove('active');
  toast('Ambient-Musik aus');
}

// -----------------------------------------------------------------------------
// STERNE & LEBEN LOGIK
// -----------------------------------------------------------------------------
function setupHeartsForDifficulty() {
  if (state.mode === 'zen') {
    switch (state.zenDifficulty) {
      case 'easy': state.maxHearts = 5; break;
      case 'hard': state.maxHearts = 1; break;
      case 'medium':
      default: state.maxHearts = 3; break;
    }
  } else {
    state.maxHearts = 3;
  }
  state.currentHearts = state.maxHearts;
  state.isGameOver = false;
  renderHearts();
}

function renderHearts() {
  let starsStr = '';
  for (let i = 0; i < state.maxHearts; i++) {
    starsStr += (i < state.currentHearts) ? '★' : '☆';
  }
  dom.heartsDisplay.textContent = starsStr;
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
  toast('Keine Versuche mehr übrig!');
}

// -----------------------------------------------------------------------------
// SPIELABLAUF & RENDERING
// -----------------------------------------------------------------------------
function getCluesForZenDifficulty() {
  switch (state.zenDifficulty) {
    case 'easy': return 40;   // Viele Vorgaben
    case 'hard': return 28;   // Wenige Vorgaben
    case 'medium':
    default: return 34;
  }
}

function startNewGame(customBoard = null, customSol = null) {
  stopSwapCountdown();
  stopBot();
  stopStopwatch();
  state.botRunning = false;
  setupHeartsForDifficulty();

  if (customBoard && customSol) {
    state.initialBoard = [...customBoard];
    state.currentBoard = [...customBoard];
    state.solution = [...customSol];
  } else {
    const clues = state.mode === 'zen' ? getCluesForZenDifficulty() : 34;
    const { solution, initialBoard } = SudokuEngine.generate(clues);
    state.solution = solution;
    state.initialBoard = [...initialBoard];
    state.currentBoard = [...initialBoard];
  }

  state.notes = Array.from({ length: 81 }, () => new Set());
  state.selectedIndex = null;

  updateProgressBars(0, 0);
  render();
  updateNumpadCompletedState();
  startStopwatch();

  if (state.mode === 'swap' && state.opponentType !== 'bot') {
    startSwapCountdown();
  }
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

      // Fehler markieren falls benutzerdefinierte Zahl falsch ist
      if (!isGiven && val !== state.solution[i]) {
        cell.classList.add('error');
      }
    } else {
      valSpan.textContent = '';
      valSpan.style.display = 'none';
      notesDiv.style.display = 'grid';

      const noteSpans = notesDiv.children;
      for (let n = 1; n <= 9; n++) {
        noteSpans[n - 1].textContent = state.notes[i].has(n) ? n : '';
      }
    }
  }

  highlightRelated();
}

function selectCell(index) {
  if (state.isGameOver) return;
  state.selectedIndex = index;
  render();
}

function highlightRelated() {
  if (state.selectedIndex === null) return;
  const cells = dom.grid.children;
  const row = Math.floor(state.selectedIndex / 9);
  const col = state.selectedIndex % 9;
  const currentVal = state.currentBoard[state.selectedIndex];

  for (let i = 0; i < 81; i++) {
    if (i === state.selectedIndex) continue;
    const r = Math.floor(i / 9);
    const c = i % 9;
    const sameBox = Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3);

    if (r === row || c === col || sameBox || (currentVal !== 0 && state.currentBoard[i] === currentVal)) {
      cells[i].classList.add('highlighted');
    }
  }
}

function updateNumpadCompletedState() {
  const completedDigits = SudokuEngine.getCompletedDigits(state.currentBoard, state.solution);
  const numButtons = dom.numpad.querySelectorAll('.num');

  numButtons.forEach(btn => {
    const digit = parseInt(btn.dataset.num, 10);
    if (completedDigits.has(digit)) {
      btn.classList.add('completed');
    } else {
      btn.classList.remove('completed');
    }
  });
}

function handleNumberInput(num) {
  if (state.isGameOver) return;
  const idx = state.selectedIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  // Prüfen, ob Zahl bereits vollständig belegt ist
  const completedDigits = SudokuEngine.getCompletedDigits(state.currentBoard, state.solution);
  if (completedDigits.has(num)) return;

  if (state.notesActive) {
    if (state.notes[idx].has(num)) {
      state.notes[idx].delete(num);
    } else {
      state.notes[idx].add(num);
    }
    state.currentBoard[idx] = 0;
  } else {
    // Zahl eintragen & auf Fehler prüfen
    const wasEmpty = state.currentBoard[idx] === 0;
    const isCorrect = (num === state.solution[idx]);

    state.currentBoard[idx] = num;
    state.notes[idx].clear();

    if (!isCorrect && wasEmpty) {
      deductHeart();
    }

    checkProgress();
    updateNumpadCompletedState();
  }

  render();
}

function clearCell() {
  if (state.isGameOver) return;
  const idx = state.selectedIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  state.currentBoard[idx] = 0;
  state.notes[idx].clear();
  checkProgress();
  updateNumpadCompletedState();
  render();
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
  let pts = 50;
  if (state.mode === 'versus') pts = 100;
  if (state.mode === 'swap') pts = 75;

  toast(`Gelöst in ${dom.gameTimerDisplay.textContent}! (+${pts} Pts)`);

  if (state.mode === 'versus' && state.channel && state.opponentType === 'online') {
    broadcast('GAME_OVER', { winner: state.user?.id || 'player' });
  }

  await addPoints(pts);
}

async function addPoints(pts) {
  state.profile.sync_points += pts;
  updatePointsDisplay();
  saveLocalState();

  if (!state.isOffline && state.supabase && state.user) {
    try {
      await state.supabase.rpc('add_sync_points', { points_to_add: pts });
    } catch (_) {}
  }
}

// -----------------------------------------------------------------------------
// BOT ENGINE
// -----------------------------------------------------------------------------
function getBotIntervalMs() {
  switch (state.botDifficulty) {
    case 'easy': return 3800;   // ~3.8s pro Zelle
    case 'hard': return 1400;   // ~1.4s pro Zelle
    case 'medium':
    default: return 2400;       // ~2.4s pro Zelle
  }
}

function startBotMatch() {
  stopBot();
  state.botRunning = true;
  toast('Spiel gegen Bot gestartet!');

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
  const emptyIndices = [];
  for (let i = 0; i < 81; i++) {
    if (state.botBoard[i] === 0 || state.botBoard[i] !== state.botSolution[i]) {
      emptyIndices.push(i);
    }
  }

  if (emptyIndices.length === 0) {
    stopBot();
    if (state.mode === 'versus') {
      toast('Der Bot hat das Rätsel zuerst gelöst!');
    } else if (state.mode === 'swap') {
      toast('Der Bot hat seinen Teil gelöst!');
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

// -----------------------------------------------------------------------------
// MODI & MULTIPLAYER LOBBY
// -----------------------------------------------------------------------------
function setMode(mode) {
  state.mode = mode;
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
  dom.opponentLabelText.textContent = isBot ? 'Bot' : 'Gegner';
  dom.swapPartnerLabel.textContent = isBot ? 'Swap mit Bot in' : 'Swap in';
}

function createRoom() {
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  state.isHost = true;
  joinRoom(code);
}

async function joinRoom(code) {
  if (!code || code.length !== 4) {
    toast('4-stelligen Code eingeben');
    return;
  }

  leaveRoom();
  state.roomCode = code.toUpperCase();
  dom.currentRoom.textContent = state.roomCode;
  dom.roomDisplay.classList.remove('hidden');
  setConnectionStatus('connecting', 'Verbinde...');

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
    setConnectionStatus('connected', `${state.peersCount} Spieler`);

    if (state.isHost && state.peersCount === 2 && state.mode === 'versus') {
      broadcast('SYNC_BOARD', {
        initialBoard: state.initialBoard,
        solution: state.solution
      });
    }
  });

  state.channel
    .on('broadcast', { event: 'SYNC_BOARD' }, ({ payload }) => {
      toast('Board synchronisiert');
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
      toast('Gegner war schneller');
    });

  state.channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      setConnectionStatus('connected', 'Verbunden');
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
  setConnectionStatus('disconnected', 'Nicht verbunden');
}

function setConnectionStatus(status, text) {
  dom.connDot.className = 'dot ' + (status === 'connected' ? 'connected' : status === 'connecting' ? 'connecting' : '');
  dom.connText.textContent = text;
}

// -----------------------------------------------------------------------------
// CO-OP SWAP COUNTDOWN & HANDLING
// -----------------------------------------------------------------------------
function startSwapCountdown() {
  stopSwapCountdown();
  state.swapSecondsLeft = 10;
  dom.swapTimer.textContent = `${state.swapSecondsLeft}s`;

  state.swapTimerId = setInterval(() => {
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
  setTimeout(() => dom.grid.classList.remove('swapping'), 300);

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
    toast('Board mit Bot getauscht!');
  } else if (state.channel) {
    broadcast('SWAP', {
      currentBoard: state.currentBoard,
      initialBoard: state.initialBoard,
      solution: state.solution
    });
  } else {
    const next = SudokuEngine.generate(34);
    state.solution = next.solution;
    state.initialBoard = next.initialBoard;
    state.currentBoard = [...next.initialBoard];
    render();
    toast('Board getauscht');
  }
}

function applyIncomingSwap(payload) {
  dom.grid.classList.add('swapping');
  setTimeout(() => dom.grid.classList.remove('swapping'), 300);

  state.currentBoard = [...payload.currentBoard];
  state.initialBoard = [...payload.initialBoard];
  state.solution = [...payload.solution];
  state.selectedIndex = null;

  render();
  checkProgress();
  updateNumpadCompletedState();
  toast('Board getauscht');
}

// -----------------------------------------------------------------------------
// SPIELREGELN ERKLÄRUNGS-MODAL
// -----------------------------------------------------------------------------
function showModeRules() {
  if (state.mode === 'zen') {
    dom.rulesModalTitle.textContent = 'Einzelspieler — Regeln';
    dom.rulesModalText.innerHTML = `
      <p><strong>Ziel:</strong> Fülle das gesamte 9x9-Gitter so aus, dass in jeder Zeile, Spalte und jedem 3x3-Block jede Zahl von 1 bis 9 genau einmal vorkommt.</p>
      <ul>
        <li><strong>Einfach:</strong> 5 Versuche (★). Viele Startzahlen.</li>
        <li><strong>Mittel:</strong> 3 Versuche (★). Ausgeglichene Herausforderung.</li>
        <li><strong>Schwer:</strong> Nur 1 Versuch (★)! Keine Fehler erlaubt.</li>
      </ul>
      <p>Bei jedem gelösten Board erhältst du <strong>+50 Sync-Points</strong>.</p>
    `;
  } else if (state.mode === 'versus') {
    dom.rulesModalTitle.textContent = 'Versus-Modus — Regeln';
    dom.rulesModalText.innerHTML = `
      <p><strong>Ziel:</strong> Du und dein Gegner (online per 4-stelligem Raumcode oder ein lokaler Bot) lösen zeitgleich <strong>dasselbe Rätsel</strong>.</p>
      <ul>
        <li>Der Fortschrittsbalken oben zeigt live, wer wie weit ist.</li>
        <li>Wer zuerst alle Felder korrekt ausgefüllt hat, gewinnt die Partie.</li>
      </ul>
      <p>Der Sieger erhält <strong>+100 Sync-Points</strong>.</p>
    `;
  } else if (state.mode === 'swap') {
    dom.rulesModalTitle.textContent = 'Co-Op Swap — Regeln';
    dom.rulesModalText.innerHTML = `
      <p><strong>Die kooperative Herausforderung:</strong></p>
      <ul>
        <li>Zwei Spieler (oder du und der Bot) starten mit <strong>zwei unterschiedlichen Rätseln</strong>.</li>
        <li>Ein <strong>10-Sekunden-Timer</strong> läuft synchron ab.</li>
        <li>Sobald der Timer 0 erreicht, werden beide Boards über das Netzwerk ausgetauscht!</li>
        <li>Du übernimmst genau das Board deines Partners an der Stelle, wo er gerade war.</li>
        <li>Löst gemeinsam beide Rätsel unter Zeitdruck.</li>
      </ul>
      <p>Belohnung nach erfolgreichem Abschluss: <strong>+75 Sync-Points</strong> für beide!</p>
    `;
  }
  dom.rulesModal.classList.remove('hidden');
}

// -----------------------------------------------------------------------------
// RANGLISTE & ACCOUNT
// -----------------------------------------------------------------------------
async function openLeaderboard() {
  dom.myRankPoints.textContent = state.profile.sync_points;
  dom.leaderboardModal.classList.remove('hidden');
  await loadLeaderboardData();
}

function closeLeaderboard() {
  dom.leaderboardModal.classList.add('hidden');
}

function openAccount() {
  dom.usernameInput.value = state.profile.username;
  updatePointsDisplay();
  dom.accountModal.classList.remove('hidden');
}

function closeAccount() {
  dom.accountModal.classList.add('hidden');
}

async function saveUsername() {
  const newName = dom.usernameInput.value.trim();
  if (!newName) {
    toast('Name darf nicht leer sein');
    return;
  }

  state.profile.username = newName;
  saveLocalState();
  toast('Spielername gespeichert');

  if (!state.isOffline && state.supabase && state.user) {
    try {
      await state.supabase.from('profiles').update({ username: newName }).eq('id', state.user.id);
    } catch (_) {}
  }
  await loadLeaderboardData();
}

async function loadLeaderboardData() {
  dom.leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--muted)">Lade Rangliste...</td></tr>';

  let list = [];

  if (!state.isOffline && state.supabase) {
    try {
      const { data, error } = await state.supabase
        .from('profiles')
        .select('id, username, sync_points')
        .order('sync_points', { ascending: false })
        .limit(20);

      if (!error && data) {
        list = data;
      }
    } catch (_) {}
  }

  // Lokale Daten ergänzen falls leer
  if (list.length === 0) {
    list = [
      { id: 'bot-1', username: 'SudokuMaster', sync_points: 350 },
      { id: 'bot-2', username: 'ZenSeeker', sync_points: 225 },
      { id: state.user?.id || 'local-me', username: state.profile.username, sync_points: state.profile.sync_points },
      { id: 'bot-3', username: 'NordicSolver', sync_points: 100 },
      { id: 'bot-4', username: 'GridRunner', sync_points: 50 }
    ];
  }

  const currentUserId = state.user?.id || 'local-me';
  let myRank = '-';

  list.sort((a, b) => b.sync_points - a.sync_points);

  dom.leaderboardBody.innerHTML = '';
  list.forEach((entry, idx) => {
    const isMe = entry.id === currentUserId || entry.username === state.profile.username;
    const rank = idx + 1;
    if (isMe) myRank = rank;

    const tr = document.createElement('tr');
    if (isMe) tr.className = 'my-row';
    tr.innerHTML = `
      <td>#${rank}</td>
      <td>${entry.username || 'Spieler'} ${isMe ? '(Du)' : ''}</td>
      <td style="text-align: right;">${entry.sync_points}</td>
    `;
    dom.leaderboardBody.appendChild(tr);
  });

  dom.myRankInfo.innerHTML = `Dein Rang: <strong>Platz ${myRank}</strong> &bull; Punkte: <strong>${state.profile.sync_points}</strong>`;
}

// -----------------------------------------------------------------------------
// THEMES & DARK/LIGHT TOGGLE
// -----------------------------------------------------------------------------
function setTheme(id) {
  dom.root.setAttribute('data-theme', id);
  updateThemeToggleIcon(id);
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
  dom.themesList.innerHTML = '';
  THEMES.forEach(t => {
    const isOwned = state.profile.unlocked_themes.includes(t.id);
    const isActive = state.profile.active_theme === t.id;
    const canAfford = state.profile.sync_points >= t.cost;

    const row = document.createElement('div');
    row.className = 'theme-row';
    row.innerHTML = `
      <div>
        <div class="theme-name">${t.name}</div>
        <div class="theme-price">${t.cost === 0 ? 'Standard' : t.cost + ' Pts'}</div>
      </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'btn';

    if (isActive) {
      btn.textContent = 'Aktiv';
      btn.disabled = true;
    } else if (isOwned) {
      btn.textContent = 'Aktivieren';
      btn.onclick = () => activateTheme(t.id);
    } else {
      btn.textContent = 'Kaufen';
      btn.disabled = !canAfford;
      btn.onclick = () => buyTheme(t.id, t.cost);
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
  updatePointsDisplay();

  if (!state.isOffline && state.supabase && state.user) {
    state.supabase.from('profiles').update({ active_theme: id }).eq('id', state.user.id);
  }
}

async function buyTheme(id, cost) {
  if (state.profile.sync_points < cost) return;

  state.profile.sync_points -= cost;
  state.profile.unlocked_themes.push(id);
  state.profile.active_theme = id;
  setTheme(id);
  updatePointsDisplay();
  saveLocalState();
  renderThemeShop();
  toast(`${id} freigeschaltet`);

  if (!state.isOffline && state.supabase && state.user) {
    try {
      await state.supabase.rpc('purchase_theme', { theme_name: id, cost });
    } catch (_) {}
  }
}

// -----------------------------------------------------------------------------
// UI & TASTATUR EVENTS
// -----------------------------------------------------------------------------
function bindEvents() {
  // Audio Toggle
  dom.audioToggleBtn.addEventListener('click', toggleAmbientSound);

  // Theme Toggle (Hell/Dunkel)
  dom.themeToggleBtn.addEventListener('click', toggleDarkLight);

  // Rangliste
  dom.openLeaderboardBtn.addEventListener('click', openLeaderboard);
  dom.closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
  dom.leaderboardModal.addEventListener('click', e => {
    if (e.target === dom.leaderboardModal) closeLeaderboard();
  });

  // Account
  dom.openAccountBtn.addEventListener('click', openAccount);
  dom.closeAccountBtn.addEventListener('click', closeAccount);
  dom.btnSaveUsername.addEventListener('click', saveUsername);
  dom.accountModal.addEventListener('click', e => {
    if (e.target === dom.accountModal) closeAccount();
  });

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

  // Online vs Bot Umschalter
  dom.btnPlayOnline.addEventListener('click', () => setOpponentType('online'));
  dom.btnPlayBot.addEventListener('click', () => setOpponentType('bot'));

  // Bot-Schwierigkeitsgrade & Start Button
  dom.diffEasy.addEventListener('click', () => setBotDifficulty('easy'));
  dom.diffMedium.addEventListener('click', () => setBotDifficulty('medium'));
  dom.diffHard.addEventListener('click', () => setBotDifficulty('hard'));
  dom.btnStartBotGame.addEventListener('click', startBotMatch);

  // Raum-Lobby
  dom.createRoom.addEventListener('click', createRoom);
  dom.joinRoom.addEventListener('click', () => joinRoom(dom.roomInput.value.trim()));
  dom.roomInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') joinRoom(dom.roomInput.value.trim());
  });

  // Spielsteuerung
  dom.btnErase.addEventListener('click', clearCell);
  dom.btnNewGame.addEventListener('click', () => startNewGame());
  dom.btnNotes.addEventListener('click', () => {
    state.notesActive = !state.notesActive;
    dom.btnNotes.classList.toggle('active', state.notesActive);
    dom.btnNotes.textContent = `Notizen: ${state.notesActive ? 'An' : 'Aus'}`;
  });

  dom.numpad.addEventListener('click', e => {
    const btn = e.target.closest('.num');
    if (!btn || btn.classList.contains('completed')) return;
    handleNumberInput(parseInt(btn.dataset.num, 10));
  });

  window.addEventListener('keydown', e => {
    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      clearCell();
    } else if (e.key.toLowerCase() === 'n') {
      dom.btnNotes.click();
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      moveSelection(e.key);
    }
  });

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
  dom.toast._t = setTimeout(() => dom.toast.classList.add('hidden'), 2200);
}

window.addEventListener('DOMContentLoaded', init);
