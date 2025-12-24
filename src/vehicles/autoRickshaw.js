import { BaseVehicle } from './baseVehicle.js';

export class AutoRickshaw extends BaseVehicle {
  drawVehicle(ctx) {
    // Draw shadow (relative to vehicle origin at 0,0)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, this.height + 5, this.width, 8);
    
    // Main body (yellow/green)
    ctx.fillStyle = this.color;
    ctx.fillRect(10, 0, this.width - 20, this.height - 15);
    
    // Roof
    ctx.fillStyle = '#000';
    ctx.fillRect(5, -10, this.width - 10, 12);
    
    // Front windscreen
    ctx.fillStyle = 'rgba(100, 150, 255, 0.7)';
    ctx.fillRect(this.width - 25, 5, 15, 20);
    
    // Side panels
    ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
    ctx.fillRect(15, 5, 30, 20);
    
    // Wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(20, this.height - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width - 20, this.height - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Wheel spokes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + this.animationTime;
      ctx.beginPath();
      ctx.moveTo(20, this.height - 5);
      ctx.lineTo(
        20 + Math.cos(angle) * 6,
        this.height - 5 + Math.sin(angle) * 6
      );
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.width - 20, this.height - 5);
      ctx.lineTo(
        this.width - 20 + Math.cos(angle) * 6,
        this.height - 5 + Math.sin(angle) * 6
      );
      ctx.stroke();
    }
    
    // Headlight
    ctx.fillStyle = '#FFFF99';
    ctx.beginPath();
    ctx.arc(this.width - 10, 15, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // License plate
    ctx.fillStyle = '#FFF';
    ctx.fillRect(this.width - 20, this.height - 12, 15, 6);
    ctx.fillStyle = '#000';
    ctx.font = '6px monospace';
    ctx.fillText('TN01', this.width - 18, this.height - 8);
  }
}