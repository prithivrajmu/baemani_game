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
  setupCharacterPreviews();
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
      console.log('Selected character:', characterType);
      game.selectCharacter(characterType);
      showLocationSelect();
    });
  });
  
  // Location selection
  const locationCards = document.querySelectorAll('.location-card');
  locationCards.forEach(card => {
    card.addEventListener('click', () => {
      const locationType = card.dataset.location;
      console.log('Selected location:', locationType);
      game.selectLocation(locationType);
      showGameUI();
    });
  });
}

function showLocationSelect() {
  console.log('Showing location select');
  document.getElementById('character-select').classList.add('hidden');
  document.getElementById('location-select').classList.remove('hidden');
}

function showGameUI() {
  console.log('Showing game UI');
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