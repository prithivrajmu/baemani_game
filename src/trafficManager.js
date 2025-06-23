import { Limousine } from './limousine.js';

export class TrafficManager {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.limousines = [];
    this.spawnTimer = 0;
    this.spawnDelay = 120 + Math.random() * 60; // 1-2 seconds at 60fps
    
    // Define road lanes
    this.roadCenterY = canvasHeight / 2;
    this.roadWidth = 200;
    this.lanes = [
      this.roadCenterY - 60,  // Upper lane
      this.roadCenterY,       // Center lane  
      this.roadCenterY + 60   // Lower lane
    ];
  }
  
  update() {
    // Update spawn timer
    this.spawnTimer++;
    
    // Spawn new limousine if timer reached
    if (this.spawnTimer >= this.spawnDelay) {
      this.spawnLimousine();
      this.spawnTimer = 0;
      this.spawnDelay = 120 + Math.random() * 60; // Randomize next spawn
    }
    
    // Update all limousines
    this.limousines.forEach(limo => {
      limo.update();
    });
    
    // Remove destroyed limousines
    this.limousines = this.limousines.filter(limo => !limo.destroyed);
  }
  
  spawnLimousine() {
    // Choose random lane
    const randomLane = this.lanes[Math.floor(Math.random() * this.lanes.length)];
    
    // Spawn off-screen to the right
    const spawnX = this.canvasWidth + 50;
    const spawnY = randomLane - 20; // Center the limo in the lane
    
    const newLimo = new Limousine(spawnX, spawnY);
    this.limousines.push(newLimo);
  }
  
  render(ctx) {
    this.limousines.forEach(limo => {
      limo.render(ctx);
    });
  }
  
  hasActiveLimousines() {
    return this.limousines.length > 0;
  }
  
  updateWorldSize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Recalculate lanes
    this.roadCenterY = canvasHeight / 2;
    this.lanes = [
      this.roadCenterY - 60,
      this.roadCenterY,
      this.roadCenterY + 60
    ];
  }
}