import { Game } from './game.js';

let game;
let canvas;
let ctx;

function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  // Set up canvas size
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Initialize game
  game = new Game(canvas, ctx);
  
  // Set up input handling
  setupInput();
  
  // Start game loop
  gameLoop();
  
  // Audio context needs user interaction
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
    
    // Prevent default arrow key scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });
  
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });
  
  // Pass input to game
  game.setInput(keys);
}

function gameLoop() {
  game.update();
  game.render();
  requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', init);