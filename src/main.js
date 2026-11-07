import { Game } from './game.js';

let game;
let canvas;
let ctx;
let last = 0;
let acc = 0;
const STEP = 1000 / 60; // game logic is tuned per-frame at 60fps; keep it there on 120/144Hz displays

function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  game = new Game(canvas, ctx);
  
  setupInput();
  setupMenus();
  setupCharacterPreviews();
  requestAnimationFrame((t) => { last = t; gameLoop(t); });
  
  // Browsers only allow audio after a user gesture (click or tap)
  document.addEventListener('pointerdown', () => {
    game.initAudio();
  }, { once: true });
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function setupCharacterPreviews() {
  // Draw character previews in the selection cards
  const gothPreview = document.getElementById('goth-preview');
  const supermanPreview = document.getElementById('superman-preview');
  const yogaPreview = document.getElementById('yoga-preview');
  
  if (gothPreview) {
    drawCharacterPreview(gothPreview, 'goth');
  }
  if (supermanPreview) {
    drawCharacterPreview(supermanPreview, 'superman');
  }
  if (yogaPreview) {
    drawCharacterPreview(yogaPreview, 'yoga');
  }
}

function drawCharacterPreview(element, characterType) {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  // Clear background
  ctx.fillStyle = 'rgba(51, 0, 102, 0.5)';
  ctx.fillRect(0, 0, 100, 100);
  
  // Draw simplified character preview
  ctx.save();
  ctx.translate(50, 50);
  ctx.scale(0.6, 0.6);
  
  switch (characterType) {
    case 'goth':
      drawGothPreview(ctx);
      break;
    case 'superman':
      drawSupermanPreview(ctx);
      break;
    case 'yoga':
      drawYogaPreview(ctx);
      break;
  }
  
  ctx.restore();
  
  element.appendChild(canvas);
}

function drawGothPreview(ctx) {
  // Head
  ctx.fillStyle = '#F5DEB3';
  ctx.beginPath();
  ctx.arc(0, -20, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Spiky hair
  ctx.fillStyle = '#000';
  ctx.fillRect(-8, -30, 4, 8);
  ctx.fillRect(-3, -32, 3, 10);
  ctx.fillRect(2, -31, 4, 9);
  ctx.fillRect(7, -29, 3, 7);
  
  // Body
  ctx.fillStyle = '#000';
  ctx.fillRect(-12, -10, 24, 20);
  
  // Guitar
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.ellipse(-8, 5, 6, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(-4, -23, 2, 2);
  ctx.fillRect(2, -23, 2, 2);
}

function drawSupermanPreview(ctx) {
  // Head
  ctx.fillStyle = '#FDBCB4';
  ctx.beginPath();
  ctx.arc(0, -20, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-2, -30, 8, 0, Math.PI);
  ctx.fill();
  
  // Cape
  ctx.fillStyle = '#DC143C';
  ctx.fillRect(-10, -15, 5, 25);
  
  // Body (blue)
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(-10, -10, 20, 20);
  
  // S symbol
  ctx.fillStyle = '#DC143C';
  ctx.fillRect(-6, -8, 12, 8);
  ctx.fillStyle = '#FFD700';
  ctx.font = '12px bold sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('S', 0, -2);
  
  // Crutches
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-15, -5);
  ctx.lineTo(-18, 15);
  ctx.moveTo(15, -5);
  ctx.lineTo(18, 15);
  ctx.stroke();
}

function drawYogaPreview(ctx) {
  // Head
  ctx.fillStyle = '#FDBCB4';
  ctx.beginPath();
  ctx.arc(0, -20, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair bun
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(0, -28, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Body (yoga top)
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(-10, -10, 20, 18);
  
  // Yoga mat
  ctx.fillStyle = '#9370DB';
  ctx.fillRect(-3, -15, 2, 25);
  
  // Soda bottle
  ctx.fillStyle = '#228B22';
  ctx.fillRect(12, -8, 4, 10);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(12, -10, 4, 2);
  
  // Eyes (peaceful)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-4, -22);
  ctx.lineTo(-2, -23);
  ctx.moveTo(2, -23);
  ctx.lineTo(4, -22);
  ctx.stroke();
}

function setupInput() {
  const keys = {};
  
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    if (e.code === 'KeyP' || e.code === 'Escape') game.togglePause();
    if (e.code === 'KeyM') toggleMute();
  });
  
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });
  
  // Losing focus would otherwise leave a key "held" forever
  const autoPause = () => {
    Object.keys(keys).forEach(k => { keys[k] = false; });
    if (game.gameState === 'playing') game.togglePause();
  };
  window.addEventListener('blur', autoPause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) autoPause(); });
  
  // On-screen d-pad (touch) drives the same key state as the keyboard
  document.querySelectorAll('#dpad button').forEach(btn => {
    const set = (down) => (e) => { e.preventDefault(); keys[btn.dataset.key] = down; };
    btn.addEventListener('pointerdown', set(true));
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => btn.addEventListener(t, set(false)));
  });
  
  game.setInput(keys);
}

function setupMenus() {
  // Character selection
  const characterCards = document.querySelectorAll('.character-card');
  characterCards.forEach(card => {
    card.addEventListener('click', () => {
      const characterType = card.dataset.character;
      game.selectCharacter(characterType);
      showScreen('location-select');
    });
  });
  
  // Location selection
  const locationCards = document.querySelectorAll('.location-card');
  locationCards.forEach(card => {
    card.addEventListener('click', () => {
      const locationType = card.dataset.location;
      game.selectLocation(locationType);
    });
  });
  
  const $ = (id) => document.getElementById(id);
  $('pause-btn').addEventListener('click', () => game.togglePause());
  $('resume-btn').addEventListener('click', () => game.togglePause());
  $('mute-btn').addEventListener('click', toggleMute);
  $('again-btn').addEventListener('click', () => game.startGame());
  ['pause-menu-btn', 'gameover-menu-btn'].forEach(id =>
    $(id).addEventListener('click', () => game.quitToMenu()));
}

function toggleMute() {
  game.audioManager.setMuted(!game.audioManager.muted);
}

const SCREENS = ['character-select', 'location-select', 'game-ui', 'pause-screen', 'gameover-screen'];

// Which screens are visible for each game state
const VISIBLE = {
  'character-select': ['character-select'],
  'location-select': ['location-select'],
  playing: ['game-ui'],
  paused: ['game-ui', 'pause-screen'],
  gameover: ['game-ui', 'gameover-screen']
};

function showScreen(state) {
  SCREENS.forEach(id =>
    document.getElementById(id).classList.toggle('hidden', !VISIBLE[state].includes(id)));
}

// Only touch the DOM when something changed
let shown = '';
function updateGameUI() {
  const g = game;
  const muted = g.audioManager.muted;
  const key = [g.gameState, g.currentLevel, g.lives, g.best, muted, g.selectedLocation?.name].join('|');
  if (key === shown) return;
  shown = key;
  
  showScreen(g.gameState);
  const text = (id, t) => { document.getElementById(id).textContent = t; };
  text('level-display', `Level ${g.currentLevel}/10`);
  text('location-display', g.selectedLocation?.name ?? '');
  text('lives-display', `Lives: ${g.lives}   Best: ${g.best}`);
  text('mute-btn', `Sound: ${muted ? 'off' : 'on'}`);
  text('best-display', g.best ? `Best run: ${g.best} level${g.best > 1 ? 's' : ''} cleared` : '');
  text('gameover-title', g.won ? 'You made it!' : 'Game Over');
  text('gameover-stats', `Levels cleared: ${g.levelsCleared} (best ${g.best})`);
  text('gameover-tip', `Road safety: ${g.tip}`);
}

function gameLoop(t) {
  acc = Math.min(acc + (t - last), STEP * 5);
  last = t;
  while (acc >= STEP) {
    game.update();
    acc -= STEP;
  }
  game.render();
  updateGameUI();
  
  requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);