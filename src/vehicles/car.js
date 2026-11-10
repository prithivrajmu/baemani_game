import { BaseVehicle } from './baseVehicle.js';

export class Car extends BaseVehicle {
  drawVehicle(ctx) {
    // Draw shadow (relative to vehicle origin at 0,0)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, this.height + 5, this.width, 8);
    
    // Main body
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Car roof
    ctx.fillStyle = this.color;
    ctx.fillRect(15, -15, this.width - 30, 18);
    
    // Windows
    ctx.fillStyle = 'rgba(100, 150, 255, 0.7)';
    ctx.fillRect(20, -12, 25, 12);
    ctx.fillRect(this.width - 45, -12, 25, 12);
    
    // Windshield
    ctx.fillRect(this.width - 18, -12, 15, 12);
    
    // Wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(20, this.height - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width - 20, this.height - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Hubcaps
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(20, this.height - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width - 20, this.height - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Headlights (front of car)
    ctx.fillStyle = '#FFFF99';
    ctx.beginPath();
    ctx.arc(this.width - 8, 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width - 8, 25, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Taillights (back of car)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(8, 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, 25, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}