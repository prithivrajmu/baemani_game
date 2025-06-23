import { Character } from './character.js';
import { AudioManager } from './audio.js';
import { TrafficManager } from './trafficManager.js';

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = {};
    this.audioManager = new AudioManager();
    
    // Game world dimensions
    this.worldWidth = 0;
    this.worldHeight = 0;
    
    // Create character
    this.character = new Character(0, 0);
    
    // Create traffic manager
    this.trafficManager = null;
    
    this.updateWorldSize();
  }
  
  updateWorldSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.worldWidth = rect.width;
    this.worldHeight = rect.height;
    
    // Position character in center initially
    this.character.x = this.worldWidth / 2;
    this.character.y = this.worldHeight / 2;
    
    // Set spawn point (center of top sidewalk)
    const spawnY = this.worldHeight / 2 - 200; // Top sidewalk area
    this.character.setSpawnPoint(this.worldWidth / 2, spawnY);
    
    // Initialize or update traffic manager
    if (!this.trafficManager) {
      this.trafficManager = new TrafficManager(this.worldWidth, this.worldHeight);
    } else {
      this.trafficManager.updateWorldSize(this.worldWidth, this.worldHeight);
    }
  }
  
  setInput(keys) {
    this.keys = keys;
  }
  
  initAudio() {
    this.audioManager.init();
  }
  
  checkCollisions() {
    if (this.character.isStuck) return;
    
    const characterBounds = this.character.getBounds();
    
    this.trafficManager.limousines.forEach(limo => {
      const limoBounds = limo.getBounds();
      
      // Simple AABB collision detection
      if (characterBounds.x < limoBounds.x + limoBounds.width &&
          characterBounds.x + characterBounds.width > limoBounds.x &&
          characterBounds.y < limoBounds.y + limoBounds.height &&
          characterBounds.y + characterBounds.height > limoBounds.y) {
        
        // Collision detected!
        this.character.getStuckToLimo(limo);
        this.audioManager.playCrashSound();
      }
    });
  }
  
  checkForRespawn() {
    if (!this.character.isStuck) return;
    
    // Check if the limo carrying the character is off-screen
    if (this.character.stuckToLimo && this.character.stuckToLimo.isOffScreen(this.worldWidth)) {
      this.character.respawn();
    }
  }
  
  update() {
    // Handle input and character movement (only if not stuck)
    if (!this.character.isStuck) {
      let moved = false;
      
      if (this.keys['ArrowUp'] && this.character.y > 50) {
        this.character.startPowerSlide(0, -1);
        moved = true;
      }
      if (this.keys['ArrowDown'] && this.character.y < this.worldHeight - 50) {
        this.character.startPowerSlide(0, 1);
        moved = true;
      }
      if (this.keys['ArrowLeft'] && this.character.x > 50) {
        this.character.startPowerSlide(-1, 0);
        moved = true;
      }
      if (this.keys['ArrowRight'] && this.character.x < this.worldWidth - 50) {
        this.character.startPowerSlide(1, 0);
        moved = true;
      }
      
      // Play sound if moved
      if (moved) {
        this.audioManager.playGuitarRiff();
      }
    }
    
    // Update character
    this.character.update();
    
    // Update traffic
    if (this.trafficManager) {
      this.trafficManager.update();
      
      // Handle limousine audio
      if (this.trafficManager.hasActiveLimousines()) {
        if (!this.audioManager.limoPlaying) {
          this.audioManager.startLimoRumble();
        }
      } else {
        if (this.audioManager.limoPlaying) {
          this.audioManager.stopLimoRumble();
        }
      }
    }
    
    // Check for collisions
    this.checkCollisions();
    
    // Check for respawn
    this.checkForRespawn();
    
    // Update world size if window resized
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width !== this.worldWidth || rect.height !== this.worldHeight) {
      this.updateWorldSize();
    }
  }
  
  render() {
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.worldWidth, this.worldHeight);
    
    // Draw background
    this.drawBackground(ctx);
    
    // Draw road and sidewalks
    this.drawWorld(ctx);
    
    // Draw traffic
    if (this.trafficManager) {
      this.trafficManager.render(ctx);
    }
    
    // Draw character
    this.character.render(ctx);
  }
  
  drawBackground(ctx) {
    // Create a wild gradient background
    const gradient = ctx.createRadialGradient(
      this.worldWidth / 2, this.worldHeight / 2, 0,
      this.worldWidth / 2, this.worldHeight / 2, Math.max(this.worldWidth, this.worldHeight)
    );
    gradient.addColorStop(0, '#330066');
    gradient.addColorStop(0.5, '#1a0033');
    gradient.addColorStop(1, '#000011');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);
  }
  
  drawWorld(ctx) {
    const centerY = this.worldHeight / 2;
    const roadWidth = 200;
    const sidewalkWidth = 100;
    
    // Draw wobbly road (lime green)
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.moveTo(0, centerY - roadWidth / 2);
    
    // Create wobbly top edge
    for (let x = 0; x <= this.worldWidth; x += 20) {
      const wobble = Math.sin(x * 0.02) * 15 + Math.cos(x * 0.03) * 10;
      ctx.lineTo(x, centerY - roadWidth / 2 + wobble);
    }
    
    // Create wobbly bottom edge
    for (let x = this.worldWidth; x >= 0; x -= 20) {
      const wobble = Math.sin(x * 0.025) * 12 + Math.cos(x * 0.035) * 8;
      ctx.lineTo(x, centerY + roadWidth / 2 + wobble);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add road markings (yellow, wobbly)
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    for (let x = 0; x <= this.worldWidth; x += 2) {
      const wobble = Math.sin(x * 0.03) * 5;
      if (x === 0) {
        ctx.moveTo(x, centerY + wobble);
      } else {
        ctx.lineTo(x, centerY + wobble);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw top sidewalk (magenta)
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.worldWidth, 0);
    for (let x = this.worldWidth; x >= 0; x -= 15) {
      const wobble = Math.sin(x * 0.04) * 20 + Math.cos(x * 0.02) * 15;
      ctx.lineTo(x, centerY - roadWidth / 2 - sidewalkWidth + wobble);
    }
    ctx.closePath();
    ctx.fill();
    
    // Draw bottom sidewalk (magenta)
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(0, this.worldHeight);
    ctx.lineTo(this.worldWidth, this.worldHeight);
    for (let x = this.worldWidth; x >= 0; x -= 15) {
      const wobble = Math.sin(x * 0.045) * 18 + Math.cos(x * 0.025) * 12;
      ctx.lineTo(x, centerY + roadWidth / 2 + sidewalkWidth + wobble);
    }
    ctx.closePath();
    ctx.fill();
  }
}