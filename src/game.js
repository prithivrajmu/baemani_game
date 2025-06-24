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
    
    this.updateWorldSize();
  }
  
  updateWorldSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.worldWidth = rect.width;
    this.worldHeight = rect.height;
    
    if (this.character) {
      // Update character spawn point
      const spawnY = this.getGoalY() - 50;
      this.character.setSpawnPoint(this.worldWidth / 2, spawnY);
    }
    
    if (this.trafficManager) {
      this.trafficManager.updateWorldSize(this.worldWidth, this.worldHeight);
    }
  }
  
  getGoalY() {
    // Top sidewalk area
    const roadCenterY = this.worldHeight / 2;
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    const roadWidth = 80 * levelConfig.lanes;
    return roadCenterY - roadWidth / 2 - 50;
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
    this.selectedCharacter = characterType;
    this.gameState = 'location-select';
  }
  
  selectLocation(locationKey) {
    this.selectedLocation = LOCATIONS[locationKey];
    this.selectedLocation.key = locationKey;
    this.startGame();
  }
  
  startGame() {
    this.gameState = 'playing';
    this.currentLevel = 1;
    
    // Create character
    const spawnY = this.getGoalY() - 50;
    const spawnX = this.worldWidth / 2;
    
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
    if (this.character.y <= goalY && !this.character.isStuck) {
      this.triggerSuccess();
    }
  }
  
  checkForRespawn() {
    if (!this.character || !this.character.isStuck) return;
    
    if (this.character.stuckToVehicle && 
        this.character.stuckToVehicle.isOffScreen(this.worldWidth)) {
      this.character.respawn();
    }
  }
  
  triggerSuccess() {
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
    this.currentLevel++;
    if (this.currentLevel > 10) {
      this.currentLevel = 10; // Max level
    }
    
    // Update traffic manager with new level config
    const levelConfig = LEVEL_CONFIG[this.currentLevel];
    this.trafficManager.updateLevel(levelConfig);
    this.trafficManager.clearAllVehicles();
    
    // Reset character
    this.character.respawn();
    
    this.gameState = 'playing';
  }
  
  update() {
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
    // Handle input
    if (this.character && !this.character.isStuck) {
      let moved = false;
      const roadBounds = this.getRoadBounds();
      
      if (this.keys['ArrowUp'] && this.character.y > 50) {
        this.character.startMove(0, -1);
        moved = true;
      }
      if (this.keys['ArrowDown'] && this.character.y < roadBounds.bottom + 50) {
        this.character.startMove(0, 1);
        moved = true;
      }
      if (this.keys['ArrowLeft'] && this.character.x > 50) {
        this.character.startMove(-1, 0);
        moved = true;
      }
      if (this.keys['ArrowRight'] && this.character.x < this.worldWidth - 50) {
        this.character.startMove(1, 0);
        moved = true;
      }
      
      if (moved) {
        this.audioManager.playMoveSound(this.selectedCharacter);
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
}