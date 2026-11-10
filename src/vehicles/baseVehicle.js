export class BaseVehicle {
  constructor(x, y, type, config) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.config = config;
    this.speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.destroyed = false;
    this.animationTime = 0;
    this.direction = 1; // 1 = drives right-to-left, -1 = left-to-right (art faces right, so 1 is mirrored)
    this.canvasWidth = 0;
  }
  
  setDirection(direction) {
    this.direction = direction;
  }
  
  setCanvasWidth(canvasWidth) {
    this.canvasWidth = canvasWidth;
  }
  
  update() {
    this.x -= this.speed * this.direction;
    this.animationTime += 0.1;
    
    if (this.isOffScreen(this.canvasWidth || window.innerWidth)) {
      this.destroyed = true;
    }
  }
  
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
  
  isOffScreen(canvasWidth) {
    return (this.direction === 1 && this.x + this.width < -50) ||
           (this.direction === -1 && this.x > canvasWidth + 50);
  }
  
  render(ctx) {
    ctx.save();
    
    ctx.translate(this.x, this.y);
    // Sprites face right; mirror when driving right-to-left.
    if (this.direction === 1) {
      ctx.scale(-1, 1);
      ctx.translate(-this.width, 0);
    }
    
    // Draw vehicle at origin (0, 0) relative to vehicle position
    this.drawVehicle(ctx);
    ctx.restore();
  }
  
  // To be implemented by subclasses
  drawVehicle(ctx) {
    throw new Error("drawVehicle must be implemented by subclass");
  }
}