/**
 * SwapDoku: Kernlogik & Realtime-Synchronisation
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
    sync_points: 0,
    active_theme: 'nordic-light',
    unlocked_themes: ['nordic-light']
  },

  mode: 'zen', // 'zen' | 'versus' | 'swap'
  
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
  swapSecondsLeft: 10
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

  static countSolved(current, solution) {
    let count = 0;
    for (let i = 0; i < 81; i++) {
      if (current[i] !== 0 && current[i] === solution[i]) count++;
    }
    return count;
  }

  static isComplete(current, solution) {
    for (let i = 0; i < 81; i++) {
      if (current[i] === 0 || current[i] !== solution[i]) return false;
    }
    return true;
  }
}

// DOM Referenzen
const dom = {
  root: document.documentElement,
  points: document.getElementById('userPoints'),
  openShop: document.getElementById('openShopBtn'),
  closeShop: document.getElementById('closeShopBtn'),
  shopModal: document.getElementById('themeModal'),
  themesList: document.getElementById('themesContainer'),
  tabZen: document.getElementById('tabZen'),
  tabVersus: document.getElementById('tabVersus'),
  tabSwap: document.getElementById('tabSwap'),
  lobby: document.getElementById('multiplayerLobby'),
  createRoom: document.getElementById('createRoomBtn'),
  joinRoom: document.getElementById('joinRoomBtn'),
  roomInput: document.getElementById('roomCodeInput'),
  roomDisplay: document.getElementById('roomCodeDisplay'),
  currentRoom: document.getElementById('currentRoomCode'),
  connDot: document.getElementById('connDot'),
  connText: document.getElementById('connText'),
  versusBars: document.getElementById('versusBars'),
  playerBar: document.getElementById('playerProgressBar'),
  opponentBar: document.getElementById('opponentProgressBar'),
  playerLabel: document.getElementById('playerProgressLabel'),
  opponentLabel: document.getElementById('opponentProgressLabel'),
  swapBox: document.getElementById('swapTimerBox'),
  swapTimer: document.getElementById('swapTimer'),
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
    const { data } = await state.supabase.from('profiles').select('sync_points, active_theme').eq('id', state.user.id).single();
    if (data) {
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
    try { state.profile = JSON.parse(saved); } catch (_) {}
  }
  setTheme(state.profile.active_theme);
}

function saveLocalState() {
  localStorage.setItem('swapdoku_state', JSON.stringify(state.profile));
}

function updatePointsDisplay() {
  dom.points.textContent = state.profile.sync_points;
}

// Spielablauf
function startNewGame(customBoard = null, customSol = null) {
  stopSwapCountdown();

  if (customBoard && customSol) {
    state.initialBoard = [...customBoard];
    state.currentBoard = [...customBoard];
    state.solution = [...customSol];
  } else {
    const { solution, initialBoard } = SudokuEngine.generate(34);
    state.solution = solution;
    state.initialBoard = [...initialBoard];
    state.currentBoard = [...initialBoard];
  }

  state.notes = Array.from({ length: 81 }, () => new Set());
  state.selectedIndex = null;

  updateProgressBars(0, 0);
  render();

  if (state.mode === 'swap') {
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

function handleNumberInput(num) {
  const idx = state.selectedIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  if (state.notesActive) {
    if (state.notes[idx].has(num)) {
      state.notes[idx].delete(num);
    } else {
      state.notes[idx].add(num);
    }
    state.currentBoard[idx] = 0;
  } else {
    state.currentBoard[idx] = num;
    state.notes[idx].clear();
    checkProgress();
  }

  render();
}

function clearCell() {
  const idx = state.selectedIndex;
  if (idx === null || state.initialBoard[idx] !== 0) return;

  state.currentBoard[idx] = 0;
  state.notes[idx].clear();
  checkProgress();
  render();
}

function checkProgress() {
  const solved = SudokuEngine.countSolved(state.currentBoard, state.solution);
  const pct = Math.round((solved / 81) * 100);
  dom.playerBar.style.width = `${pct}%`;
  dom.playerLabel.textContent = `${pct}%`;

  if (state.mode === 'versus' && state.channel) {
    broadcast('PROGRESS', { solved, total: 81 });
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
  let pts = 50;
  if (state.mode === 'versus') pts = 100;
  if (state.mode === 'swap') pts = 75;

  toast(`Gelöst! +${pts} Punkte`);

  if (state.mode === 'versus' && state.channel) {
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

// Modi & Lobby
function setMode(mode) {
  state.mode = mode;
  [dom.tabZen, dom.tabVersus, dom.tabSwap].forEach(b => b.classList.remove('active'));

  dom.lobby.classList.toggle('hidden', mode === 'zen');
  dom.versusBars.classList.toggle('hidden', mode !== 'versus');
  dom.swapBox.classList.toggle('hidden', mode !== 'swap');

  if (mode === 'zen') {
    dom.tabZen.classList.add('active');
    leaveRoom();
  } else if (mode === 'versus') {
    dom.tabVersus.classList.add('active');
  } else {
    dom.tabSwap.classList.add('active');
  }

  startNewGame();
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
      const pct = Math.round((payload.solved / payload.total) * 100);
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

// Co-Op Swap Countdown
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

  if (state.channel) {
    broadcast('SWAP', {
      currentBoard: state.currentBoard,
      initialBoard: state.initialBoard,
      solution: state.solution
    });
  } else {
    // Lokaler Demo-Swap
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
  toast('Board getauscht');
}

// Themes
function setTheme(id) {
  dom.root.setAttribute('data-theme', id);
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

// UI & Tastatur Events
function bindEvents() {
  dom.tabZen.addEventListener('click', () => setMode('zen'));
  dom.tabVersus.addEventListener('click', () => setMode('versus'));
  dom.tabSwap.addEventListener('click', () => setMode('swap'));

  dom.createRoom.addEventListener('click', createRoom);
  dom.joinRoom.addEventListener('click', () => joinRoom(dom.roomInput.value.trim()));
  dom.roomInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') joinRoom(dom.roomInput.value.trim());
  });

  dom.btnErase.addEventListener('click', clearCell);
  dom.btnNewGame.addEventListener('click', () => startNewGame());
  dom.btnNotes.addEventListener('click', () => {
    state.notesActive = !state.notesActive;
    dom.btnNotes.classList.toggle('active', state.notesActive);
    dom.btnNotes.textContent = `Notizen: ${state.notesActive ? 'An' : 'Aus'}`;
  });

  dom.numpad.addEventListener('click', e => {
    const btn = e.target.closest('.num');
    if (!btn) return;
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
