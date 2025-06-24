import { Game } from './game.js';

let game;
let canvas;
let ctx;

function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  game = new Game(canvas, ctx);
  
  setupInput();
  setupMenus();
  gameLoop();
  
  // Audio initialization
  document.addEventListener('click', () => {
    game.initAudio();
  }, { once: true });
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}

function setupInput() {
  const keys = {};
  
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });
  
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
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
      showLocationSelect();
    });
  });
  
  // Location selection
  const locationCards = document.querySelectorAll('.location-card');
  locationCards.forEach(card => {
    card.addEventListener('click', () => {
      const locationType = card.dataset.location;
      game.selectLocation(locationType);
      showGameUI();
    });
  });
}

function showLocationSelect() {
  document.getElementById('character-select').classList.add('hidden');
  document.getElementById('location-select').classList.remove('hidden');
}

function showGameUI() {
  document.getElementById('location-select').classList.add('hidden');
  document.getElementById('game-ui').classList.remove('hidden');
  
  // Update UI displays
  updateGameUI();
}

function updateGameUI() {
  const levelDisplay = document.getElementById('level-display');
  const locationDisplay = document.getElementById('location-display');
  
  if (levelDisplay && game.currentLevel) {
    levelDisplay.textContent = `Level ${game.currentLevel}`;
  }
  
  if (locationDisplay && game.selectedLocation) {
    locationDisplay.textContent = game.selectedLocation.name;
  }
}

function updateSuccessScreen() {
  const successScreen = document.getElementById('success-screen');
  const lawText = document.getElementById('law-text');
  
  if (game.gameState === 'success') {
    successScreen.classList.remove('hidden');
    
    if (lawText) {
      lawText.textContent = game.typewriterText.substring(0, game.typewriterIndex);
    }
  } else {
    successScreen.classList.add('hidden');
  }
}

function gameLoop() {
  game.update();
  game.render();
  
  // Update UI
  updateGameUI();
  updateSuccessScreen();
  
  requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);