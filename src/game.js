import { GothCharacter } from './characters/gothCharacter.js';
import { SupermanCharacter } from './characters/supermanCharacter.js';
import { YogaCharacter } from './characters/yogaCharacter.js';
import { AudioManager } from './audio.js';
import { TrafficManager } from './trafficManager.js';
import { CHARACTERS, LOCATIONS, TRAFFIC_LAWS, LEVEL_CONFIG } from './gameConfig.js';

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = {};
    this.audioManager = new AudioManager();
    
    // Game state
    this.gameState = 'character-select'; // character-select, location-select, playing, success
    this.selectedCharacter = null;
    this.selectedLocation = null;
    this.currentLevel = 1;
    
    // Game world dimensions
    this.worldWidth = 0;
    this.worldHeight = 0;
    
    // Game objects
    this.character = null;
    this.trafficManager = null;
    
    // Success state
    this.successTimer = 0;
    this.successDuration = 300; // 5 seconds at 60fps
    this.typewriterText = '';
    this.typewriterIndex = 0;
    this.typewriterSpeed = 3; // Characters per frame
    
    // Input handling
    this.inputCooldown = 0;
    this.inputDelay = 10; // Frames between inputs
    
    this.updateWorldSize();
    console.log('Game initialized');
  }
  
  updateWorldSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.worldWidth = rect.width;
    this.worldHeight = rect.height;
    
    if (this.character) {
      // Update character spawn point
      const spawnY = this.getStartingY();
      this.character.setSpawnPoint(this.worldWidth / 2, spawnY);
    }
    
    if (this.trafficManager) {
      this.trafficManager.updateWorldSize(this.worldWidth, this.worldHeight);
    }
  }
  
  getGoalY() {
    // Top sidewalk area - well above the road
    const roadCenterY = this.worldHeight / 2;
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    const roadWidth = 80 * levelConfig.lanes;
    return roadCenterY - roadWidth / 2 - 80; // Increased distance from road
  }
  
  getStartingY() {
    // Bottom sidewalk area - well below the road
    const roadCenterY = this.worldHeight / 2;
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    const roadWidth = 80 * levelConfig.lanes;
    return roadCenterY + roadWidth / 2 + 80; // Increased distance from road
  }
  
  getRoadBounds() {
    const roadCenterY = this.worldHeight / 2;
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    const roadWidth = 80 * levelConfig.lanes;
    
    return {
      top: roadCenterY - roadWidth / 2,
      bottom: roadCenterY + roadWidth / 2
    };
  }
  
  selectCharacter(characterType) {
    console.log('Selecting character:', characterType);
    this.selectedCharacter = characterType;
    this.gameState = 'location-select';
  }
  
  selectLocation(locationKey) {
    console.log('Selecting location:', locationKey);
    this.selectedLocation = LOCATIONS[locationKey];
    this.selectedLocation.key = locationKey;
    this.startGame();
  }
  
  startGame() {
    console.log('Starting game with character:', this.selectedCharacter, 'location:', this.selectedLocation.key);
    
    // Reset game state properly
    this.gameState = 'playing';
    this.currentLevel = 1;
    this.successTimer = 0;
    this.typewriterIndex = 0;
    this.typewriterText = '';
    
    // Create character at bottom of screen (starting position)
    const spawnX = this.worldWidth / 2;
    const spawnY = this.getStartingY();
    
    console.log('Character spawn position:', spawnX, spawnY);
    console.log('Goal position:', this.getGoalY());
    console.log('Distance to goal:', spawnY - this.getGoalY());
    
    switch (this.selectedCharacter) {
      case 'goth':
        this.character = new GothCharacter(spawnX, spawnY);
        break;
      case 'superman':
        this.character = new SupermanCharacter(spawnX, spawnY);
        break;
      case 'yoga':
        this.character = new YogaCharacter(spawnX, spawnY);
        break;
    }
    
    this.character.setSpawnPoint(spawnX, spawnY);
    
    // Create traffic manager
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    this.trafficManager = new TrafficManager(
      this.worldWidth, 
      this.worldHeight, 
      this.selectedLocation, 
      levelConfig
    );
    
    console.log('Game started successfully, state:', this.gameState);
  }
  
  setInput(keys) {
    this.keys = keys;
  }
  
  initAudio() {
    this.audioManager.init();
  }
  
  checkCollisions() {
    if (!this.character || this.character.isStuck || this.gameState !== 'playing') return;
    
    const characterBounds = this.character.getBounds();
    
    this.trafficManager.vehicles.forEach(vehicle => {
      const vehicleBounds = vehicle.getBounds();
      
      if (characterBounds.x < vehicleBounds.x + vehicleBounds.width &&
          characterBounds.x + characterBounds.width > vehicleBounds.x &&
          characterBounds.y < vehicleBounds.y + vehicleBounds.height &&
          characterBounds.y + characterBounds.height > vehicleBounds.y) {
        
        this.character.getStuckToVehicle(vehicle);
        this.audioManager.playCrashSound();
      }
    });
  }
  
  checkForSuccess() {
    if (!this.character || this.gameState !== 'playing') return;
    
    const goalY = this.getGoalY();
    console.log('Checking success - Character Y:', this.character.y, 'Goal Y:', goalY, 'Is stuck:', this.character.isStuck);
    
    if (this.character.y <= goalY && !this.character.isStuck) {
      console.log('Success! Character reached goal');
      this.triggerSuccess();
    }
  }
  
  checkForRespawn() {
    if (!this.character || !this.character.isStuck) return;
    
    if (this.character.stuckToVehicle && 
        this.character.stuckToVehicle.isOffScreen(this.worldWidth)) {
      console.log('Respawning character');
      this.character.respawn();
    }
  }
  
  triggerSuccess() {
    console.log('Triggering success state');
    this.gameState = 'success';
    this.successTimer = 0;
    this.typewriterIndex = 0;
    this.typewriterText = this.getRandomTrafficLaw();
    
    this.audioManager.playSuccessSound();
    
    // Pause traffic
    if (this.trafficManager) {
      this.trafficManager.vehicles.forEach(vehicle => {
        vehicle.speed = 0;
      });
    }
  }
  
  getRandomTrafficLaw() {
    const locationLaws = TRAFFIC_LAWS[this.selectedLocation.key] || [];
    const globalLaws = TRAFFIC_LAWS.global || [];
    const allLaws = [...locationLaws, ...globalLaws];
    
    return allLaws[Math.floor(Math.random() * allLaws.length)] || 
           "Always look both ways before crossing!";
  }
  
  nextLevel() {
    console.log('Advancing to next level');
    this.currentLevel++;
    if (this.currentLevel > 10) {
      this.currentLevel = 10; // Max level
    }
    
    // Update traffic manager with new level config
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    this.trafficManager.updateLevel(levelConfig);
    this.trafficManager.clearAllVehicles();
    
    // Reset character to starting position
    const spawnX = this.worldWidth / 2;
    const spawnY = this.getStartingY();
    this.character.setSpawnPoint(spawnX, spawnY);
    this.character.respawn();
    
    // Return to playing state
    this.gameState = 'playing';
    console.log('Next level started, state:', this.gameState);
  }
  
  update() {
    // Decrease input cooldown
    if (this.inputCooldown > 0) {
      this.inputCooldown--;
    }
    
    if (this.gameState === 'playing') {
      this.updatePlaying();
    } else if (this.gameState === 'success') {
      this.updateSuccess();
    }
    
    // Update world size if window resized
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width !== this.worldWidth || rect.height !== this.worldHeight) {
      this.updateWorldSize();
    }
  }
  
  updatePlaying() {
    // Handle input with cooldown
    if (this.character && !this.character.isStuck && this.inputCooldown === 0) {
      let moved = false;
      const roadBounds = this.getRoadBounds();
      
      if (this.keys['ArrowUp'] && this.character.y > 50) {
        moved = this.character.startMove(0, -1);
      } else if (this.keys['ArrowDown'] && this.character.y < this.worldHeight - 50) {
        moved = this.character.startMove(0, 1);
      } else if (this.keys['ArrowLeft'] && this.character.x > 50) {
        moved = this.character.startMove(-1, 0);
      } else if (this.keys['ArrowRight'] && this.character.x < this.worldWidth - 50) {
        moved = this.character.startMove(1, 0);
      }
      
      if (moved) {
        this.audioManager.playMoveSound(this.selectedCharacter);
        this.inputCooldown = this.inputDelay;
      }
    }
    
    // Update game objects
    if (this.character) {
      this.character.update();
    }
    
    if (this.trafficManager) {
      this.trafficManager.update();
      
      if (this.trafficManager.hasActiveVehicles()) {
        if (!this.audioManager.rumblePlaying) {
          this.audioManager.startVehicleRumble();
        }
      } else {
        if (this.audioManager.rumblePlaying) {
          this.audioManager.stopVehicleRumble();
        }
      }
    }
    
    this.checkCollisions();
    this.checkForSuccess();
    this.checkForRespawn();
  }
  
  updateSuccess() {
    this.successTimer++;
    
    // Typewriter effect
    if (this.typewriterIndex < this.typewriterText.length) {
      if (this.successTimer % this.typewriterSpeed === 0) {
        this.typewriterIndex++;
        this.audioManager.playTypewriterSound();
      }
    }
    
    // Auto-advance to next level
    if (this.successTimer >= this.successDuration) {
      this.nextLevel();
    }
  }
  
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.worldWidth, this.worldHeight);
    
    if (this.gameState === 'playing' || this.gameState === 'success') {
      this.renderGame(ctx);
    }
  }
  
  renderGame(ctx) {
    // Draw background
    this.drawBackground(ctx);
    
    // Draw world
    this.drawWorld(ctx);
    
    // Draw traffic
    if (this.trafficManager) {
      this.trafficManager.render(ctx);
    }
    
    // Draw character
    if (this.character) {
      this.character.render(ctx);
    }
    
    // Draw goal area
    this.drawGoalArea(ctx);
    
    // Draw starting area
    this.drawStartingArea(ctx);
  }
  
  drawBackground(ctx) {
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
    if (!this.selectedLocation) return;
    
    const roadCenterY = this.worldHeight / 2;
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    const roadWidth = 80 * levelConfig.lanes;
    const sidewalkWidth = 100;
    
    // Draw road
    ctx.fillStyle = this.selectedLocation.roadColor;
    ctx.beginPath();
    ctx.moveTo(0, roadCenterY - roadWidth / 2);
    
    for (let x = 0; x <= this.worldWidth; x += 20) {
      const wobble = Math.sin(x * 0.02) * 10;
      ctx.lineTo(x, roadCenterY - roadWidth / 2 + wobble);
    }
    
    for (let x = this.worldWidth; x >= 0; x -= 20) {
      const wobble = Math.sin(x * 0.025) * 8;
      ctx.lineTo(x, roadCenterY + roadWidth / 2 + wobble);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Draw lane markings
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 10]);
    
    for (let i = 1; i < levelConfig.lanes; i++) {
      const laneY = roadCenterY - roadWidth / 2 + (i * 80);
      ctx.beginPath();
      for (let x = 0; x <= this.worldWidth; x += 2) {
        const wobble = Math.sin(x * 0.03) * 3;
        if (x === 0) {
          ctx.moveTo(x, laneY + wobble);
        } else {
          ctx.lineTo(x, laneY + wobble);
        }
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw sidewalks
    ctx.fillStyle = this.selectedLocation.sidewalkColor;
    
    // Top sidewalk
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.worldWidth, 0);
    for (let x = this.worldWidth; x >= 0; x -= 15) {
      const wobble = Math.sin(x * 0.04) * 15;
      ctx.lineTo(x, roadCenterY - roadWidth / 2 - sidewalkWidth + wobble);
    }
    ctx.closePath();
    ctx.fill();
    
    // Bottom sidewalk
    ctx.beginPath();
    ctx.moveTo(0, this.worldHeight);
    ctx.lineTo(this.worldWidth, this.worldHeight);
    for (let x = this.worldWidth; x >= 0; x -= 15) {
      const wobble = Math.sin(x * 0.045) * 12;
      ctx.lineTo(x, roadCenterY + roadWidth / 2 + sidewalkWidth + wobble);
    }
    ctx.closePath();
    ctx.fill();
  }
  
  drawGoalArea(ctx) {
    const goalY = this.getGoalY();
    
    // Draw goal line
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, goalY);
    ctx.lineTo(this.worldWidth, goalY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw "GOAL" text
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL', this.worldWidth / 2, goalY - 10);
  }
  
  drawStartingArea(ctx) {
    const startY = this.getStartingY();
    
    // Draw start line
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(0, startY);
    ctx.lineTo(this.worldWidth, startY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw "START" text
    ctx.fillStyle = '#FF1493';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('START', this.worldWidth / 2, startY + 30);
  }
}