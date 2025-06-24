import { BaseVehicle } from './baseVehicle.js';

export class Car extends BaseVehicle {
  drawVehicle(ctx) {
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(this.x, this.y + this.height + 5, this.width, 8);
    
    // Main body
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Car roof
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + 15, this.y - 15, this.width - 30, 18);
    
    // Windows
    ctx.fillStyle = 'rgba(100, 150, 255, 0.7)';
    ctx.fillRect(this.x + 20, this.y - 12, 25, 12);
    ctx.fillRect(this.x + this.width - 45, this.y - 12, 25, 12);
    
    // Windshield
    ctx.fillRect(this.x + this.width - 18, this.y - 12, 15, 12);
    
    // Wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x + 20, this.y + this.height - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.width - 20, this.y + this.height - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Hubcaps
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(this.x + 20, this.y + this.height - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.width - 20, this.y + this.height - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Headlights
    ctx.fillStyle = '#FFFF99';
    ctx.beginPath();
    ctx.arc(this.x + this.width - 8, this.y + 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + this.width - 8, this.y + 25, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Taillights
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(this.x + 8, this.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 8, this.y + 25, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}