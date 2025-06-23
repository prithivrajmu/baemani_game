export class Limousine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1.5 + Math.random() * 0.5; // Slightly varied speed
    this.length = 300 + Math.random() * 200; // Ridiculously long, varied
    this.height = 40;
    this.wobbleOffset = Math.random() * Math.PI * 2;
    this.destroyed = false;
    
    // Visual properties
    this.wheelCount = Math.floor(this.length / 50); // More wheels for longer limos
    this.windowSpacing = 35;
    this.animationTime = 0;
    
    // Collision bounds
    this.width = this.length;
  }
  
  update() {
    this.x -= this.speed;
    this.animationTime += 0.1;
    
    // Mark for destruction when completely off screen
    if (this.x + this.length < -50) {
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
  
  render(ctx) {
    ctx.save();
    
    // Draw shadow first
    this.drawShadow(ctx);
    
    // Draw main body
    this.drawBody(ctx);
    
    // Draw wheels
    this.drawWheels(ctx);
    
    // Draw windows
    this.drawWindows(ctx);
    
    // Draw details
    this.drawDetails(ctx);
    
    ctx.restore();
  }
  
  drawShadow(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    
    // Wobbly shadow
    for (let i = 0; i <= this.length; i += 10) {
      const wobble = Math.sin((i + this.animationTime * 50) * 0.02 + this.wobbleOffset) * 3;
      const x = this.x + i;
      const y = this.y + this.height + 8 + wobble;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Complete shadow shape
    for (let i = this.length; i >= 0; i -= 10) {
      const wobble = Math.sin((i + this.animationTime * 50) * 0.02 + this.wobbleOffset) * 3;
      const x = this.x + i;
      const y = this.y + this.height + 15 + wobble;
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
  }
  
  drawBody(ctx) {
    // Main body - hot pink with wobbles
    ctx.fillStyle = '#FF69B4';
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    
    // Top edge (wobbly)
    for (let i = 0; i <= this.length; i += 8) {
      const wobble = Math.sin((i + this.animationTime * 30) * 0.03 + this.wobbleOffset) * 4;
      const x = this.x + i;
      const y = this.y + wobble;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Right edge
    ctx.lineTo(this.x + this.length, this.y + this.height);
    
    // Bottom edge (wobbly)
    for (let i = this.length; i >= 0; i -= 8) {
      const wobble = Math.sin((i + this.animationTime * 25) * 0.025 + this.wobbleOffset) * 3;
      const x = this.x + i;
      const y = this.y + this.height + wobble;
      ctx.lineTo(x, y);
    }
    
    // Left edge
    ctx.lineTo(this.x, this.y);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Add some shine/highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    for (let i = 0; i <= this.length; i += 12) {
      const wobble = Math.sin((i + this.animationTime * 35) * 0.04 + this.wobbleOffset) * 2;
      const x = this.x + i;
      const y = this.y + 5 + wobble;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    for (let i = this.length; i >= 0; i -= 12) {
      const x = this.x + i;
      const y = this.y + 12;
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
  }
  
  drawWheels(ctx) {
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Draw wheels along the length
    for (let i = 0; i < this.wheelCount; i++) {
      const wheelX = this.x + 30 + (i * (this.length - 60) / (this.wheelCount - 1));
      const wheelY = this.y + this.height - 5;
      const wheelRadius = 12;
      
      // Wheel
      ctx.beginPath();
      ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Hubcap
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(wheelX, wheelY, wheelRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      
      // Spokes
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      for (let spoke = 0; spoke < 6; spoke++) {
        const angle = (spoke / 6) * Math.PI * 2 + this.animationTime;
        const spokeLength = wheelRadius * 0.4;
        ctx.beginPath();
        ctx.moveTo(wheelX, wheelY);
        ctx.lineTo(
          wheelX + Math.cos(angle) * spokeLength,
          wheelY + Math.sin(angle) * spokeLength
        );
        ctx.stroke();
      }
      
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
    }
  }
  
  drawWindows(ctx) {
    ctx.fillStyle = 'rgba(100, 150, 255, 0.7)'; // Tinted windows
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Calculate number of windows
    const windowCount = Math.floor(this.length / this.windowSpacing) - 1;
    
    for (let i = 0; i < windowCount; i++) {
      const windowX = this.x + 25 + (i * this.windowSpacing);
      const windowY = this.y + 8;
      const windowWidth = 25;
      const windowHeight = 20;
      
      // Add slight wobble to windows
      const wobble = Math.sin((windowX + this.animationTime * 20) * 0.05) * 1;
      
      ctx.fillRect(windowX, windowY + wobble, windowWidth, windowHeight);
      ctx.strokeRect(windowX, windowY + wobble, windowWidth, windowHeight);
      
      // Window reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(windowX + 2, windowY + wobble + 2, windowWidth - 4, 6);
      ctx.fillStyle = 'rgba(100, 150, 255, 0.7)';
    }
  }
  
  drawDetails(ctx) {
    // Front grille
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(this.x + this.length - 15, this.y + 15, 12, 15);
    
    // Headlights
    ctx.fillStyle = '#FFFF99';
    ctx.beginPath();
    ctx.arc(this.x + this.length - 8, this.y + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.length - 8, this.y + 30, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail lights
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(this.x + 8, this.y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 8, this.y + 30, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Antenna
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + this.length * 0.7, this.y);
    ctx.lineTo(this.x + this.length * 0.7 - 5, this.y - 15);
    ctx.stroke();
    
    // Antenna ball
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(this.x + this.length * 0.7 - 5, this.y - 15, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  isOffScreen(canvasWidth) {
    return this.x + this.length < -50;
  }
}