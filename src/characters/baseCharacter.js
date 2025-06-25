import { BaseCharacter } from './baseCharacter.js';

export class BaseCharacter {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.spawnX = x;
    this.spawnY = y;
    this.type = type;
    
    // Animation state
    this.idleTime = 0;
    this.isMoving = false;
    this.moveProgress = 0;
    this.moveStartX = x;
    this.moveStartY = y;
    this.moveDistance = 80;
    this.moveSpeed = 0.15;
    
    // Collision and stuck state
    this.isStuck = false;
    this.stuckToVehicle = null;
    this.stuckOffsetX = 0;
    this.stuckOffsetY = 0;
    this.struggleTime = 0;
    
    // Trail effect
    this.trail = [];
    this.maxTrailLength = 8;
    
    // Collision bounds
    this.width = 36;
    this.height = 70;
  }
  
  setSpawnPoint(x, y) {
    this.spawnX = x;
    this.spawnY = y;
  }
  
  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.targetX = this.spawnX;
    this.targetY = this.spawnY;
    this.isStuck = false;
    this.stuckToVehicle = null;
    this.isMoving = false;
    this.moveProgress = 0;
    this.trail = [];
    this.struggleTime = 0;
  }
  
  getStuckToVehicle(vehicle) {
    if (this.isStuck) return;
    
    this.isStuck = true;
    this.stuckToVehicle = vehicle;
    this.isMoving = false;
    
    // Calculate offset from vehicle position
    this.stuckOffsetX = this.x - vehicle.x;
    this.stuckOffsetY = this.y - vehicle.y;
    
    // Clear trail when stuck
    this.trail = [];
  }
  
  startMove(dirX, dirY) {
    if (this.isMoving || this.isStuck) return false;
    
    this.isMoving = true;
    this.moveProgress = 0;
    this.moveStartX = this.x;
    this.moveStartY = this.y;
    
    // Calculate move destination
    this.targetX = this.x + dirX * this.moveDistance;
    this.targetY = this.y + dirY * this.moveDistance;
    
    return true;
  }
  
  update() {
    if (this.isStuck && this.stuckToVehicle) {
      // Follow the vehicle
      this.x = this.stuckToVehicle.x + this.stuckOffsetX;
      this.y = this.stuckToVehicle.y + this.stuckOffsetY;
      this.struggleTime += 0.2;
      return;
    }
    
    if (this.isMoving) {
      this.moveProgress += this.moveSpeed;
      
      if (this.moveProgress >= 1) {
        this.moveProgress = 1;
        this.isMoving = false;
      }
      
      // Smooth easing for movement
      const easeOut = 1 - Math.pow(1 - this.moveProgress, 3);
      this.x = this.moveStartX + (this.targetX - this.moveStartX) * easeOut;
      this.y = this.moveStartY + (this.targetY - this.moveStartY) * easeOut;
      
      // Add to trail during movement
      if (this.moveProgress < 0.8) {
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      }
    }
    
    // Update trail
    this.trail.forEach(point => {
      point.alpha -= 0.1;
    });
    this.trail = this.trail.filter(point => point.alpha > 0);
    
    // Keep trail length manageable
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    
    this.idleTime += 0.1;
  }
  
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
  
  render(ctx) {
    // Draw trail (only when not stuck)
    if (!this.isStuck) {
      this.drawTrail(ctx);
    }
    
    // Draw character (implemented by subclasses)
    this.drawCharacter(ctx);
  }
  
  drawTrail(ctx) {
    if (this.trail.length < 2) return;
    
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    this.trail.forEach((point, index) => {
      if (index === 0) return;
      
      const prevPoint = this.trail[index - 1];
      ctx.globalAlpha = point.alpha * 0.5;
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
    
    ctx.globalAlpha = 1;
  }
  
  // To be implemented by subclasses
  drawCharacter(ctx) {
    throw new Error("drawCharacter must be implemented by subclass");
  }
}