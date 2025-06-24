import { BaseCharacter } from './baseCharacter.js';

export class SupermanCharacter extends BaseCharacter {
  constructor(x, y) {
    super(x, y, 'superman');
    this.width = 40;
    this.height = 75;
  }
  
  drawCharacter(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Hobbling animation when moving
    if (this.isMoving) {
      const hobble = Math.sin(this.moveProgress * Math.PI * 4) * 0.2;
      ctx.rotate(hobble);
      
      // Up and down hobble motion
      const verticalHobble = Math.sin(this.moveProgress * Math.PI * 8) * 5;
      ctx.translate(0, verticalHobble);
    }
    
    // Struggling animation when stuck
    if (this.isStuck) {
      const struggle = Math.sin(this.struggleTime * 6) * 0.3;
      ctx.rotate(struggle);
      
      const shakeX = Math.sin(this.struggleTime * 10) * 4;
      const shakeY = Math.cos(this.struggleTime * 12) * 3;
      ctx.translate(shakeX, shakeY);
    } else if (!this.isMoving) {
      // Heroic idle pose
      const heroicBob = Math.sin(this.idleTime * 2) * 1;
      ctx.translate(0, heroicBob);
    }
    
    // Character scale
    let scale = 1;
    if (this.isStuck) {
      scale += Math.sin(this.struggleTime * 8) * 0.15;
    }
    ctx.scale(scale, scale);
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-25, 35, 50, 8);
    
    // Draw cape (flowing behind)
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    if (this.isStuck) {
      // Cape fluttering frantically
      const capeFlutter = Math.sin(this.struggleTime * 15) * 10;
      ctx.moveTo(-15, -20);
      ctx.quadraticCurveTo(-25 + capeFlutter, -10, -20 + capeFlutter, 20);
      ctx.quadraticCurveTo(-15 + capeFlutter, 25, -10, 20);
      ctx.lineTo(-15, -20);
    } else {
      // Normal cape flow
      const capeFlow = Math.sin(this.idleTime * 3) * 5;
      ctx.moveTo(-15, -20);
      ctx.quadraticCurveTo(-30 + capeFlow, -5, -25 + capeFlow, 25);
      ctx.quadraticCurveTo(-15, 30, -10, 20);
      ctx.lineTo(-15, -20);
    }
    ctx.fill();
    
    // Draw boots (heroic red boots)
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(-18, 25, 14, 12);
    ctx.fillRect(4, 25, 14, 12);
    
    // Boot details
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-16, 27, 2, 8);
    ctx.fillRect(6, 27, 2, 8);
    
    // Draw legs (blue tights)
    ctx.fillStyle = '#0000FF';
    if (this.isStuck) {
      const legFlail = Math.sin(this.struggleTime * 8) * 6;
      ctx.fillRect(-14 + legFlail, -5, 12, 32);
      ctx.fillRect(2 - legFlail, -5, 12, 32);
    } else {
      ctx.fillRect(-14, -5, 12, 32);
      ctx.fillRect(2, -5, 12, 32);
    }
    
    // Draw torso (blue with red S)
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(-18, -25, 36, 25);
    
    // Superman S symbol
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(-8, -20);
    ctx.lineTo(8, -20);
    ctx.lineTo(8, -15);
    ctx.lineTo(-3, -15);
    ctx.lineTo(-3, -10);
    ctx.lineTo(8, -10);
    ctx.lineTo(8, -5);
    ctx.lineTo(-8, -5);
    ctx.lineTo(-8, -10);
    ctx.lineTo(3, -10);
    ctx.lineTo(3, -15);
    ctx.lineTo(-8, -15);
    ctx.closePath();
    ctx.fill();
    
    // Draw arms (one holding crutch)
    ctx.fillStyle = '#0000FF';
    if (this.isStuck) {
      const armFlail1 = Math.sin(this.struggleTime * 9) * 12;
      const armFlail2 = Math.cos(this.struggleTime * 7) * 8;
      ctx.fillRect(-25 + armFlail1, -20, 10, 20);
      ctx.fillRect(15 + armFlail2, -20, 10, 20);
    } else {
      ctx.fillRect(-25, -20, 10, 20);
      ctx.fillRect(15, -20, 10, 20);
    }
    
    // Draw crutches
    this.drawCrutches(ctx);
    
    // Draw head (heroic jaw)
    ctx.fillStyle = '#FDBCB4';
    ctx.beginPath();
    ctx.arc(0, -35, 13, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw heroic hair (black with curl)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-2, -45, 8, 0, Math.PI);
    ctx.fill();
    
    // Superman curl
    ctx.beginPath();
    ctx.arc(5, -42, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes (determined)
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      ctx.fillRect(-6, -38, 3, 4);
      ctx.fillRect(3, -38, 3, 4);
    } else {
      ctx.fillRect(-5, -38, 3, 2);
      ctx.fillRect(2, -38, 3, 2);
    }
    
    // Heroic eyebrows
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -40);
    ctx.lineTo(-2, -39);
    ctx.moveTo(2, -39);
    ctx.lineTo(8, -40);
    ctx.stroke();
    
    // Draw mouth
    if (this.isStuck) {
      // Shocked expression
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(0, -30, 4, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Determined smile
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -32, 4, 0, Math.PI);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  drawCrutches(ctx) {
    // Left crutch
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (this.isStuck) {
      const crutchShake = Math.sin(this.struggleTime * 12) * 5;
      ctx.moveTo(-20 + crutchShake, -15);
      ctx.lineTo(-25 + crutchShake, 30);
    } else {
      ctx.moveTo(-20, -15);
      ctx.lineTo(-25, 30);
    }
    ctx.stroke();
    
    // Right crutch
    ctx.beginPath();
    if (this.isStuck) {
      const crutchShake = Math.cos(this.struggleTime * 10) * 4;
      ctx.moveTo(20 + crutchShake, -15);
      ctx.lineTo(25 + crutchShake, 30);
    } else {
      ctx.moveTo(20, -15);
      ctx.lineTo(25, 30);
    }
    ctx.stroke();
    
    // Crutch handles
    ctx.fillStyle = '#654321';
    if (this.isStuck) {
      const handleShake1 = Math.sin(this.struggleTime * 12) * 5;
      const handleShake2 = Math.cos(this.struggleTime * 10) * 4;
      ctx.fillRect(-22 + handleShake1, -17, 4, 8);
      ctx.fillRect(18 + handleShake2, -17, 4, 8);
    } else {
      ctx.fillRect(-22, -17, 4, 8);
      ctx.fillRect(18, -17, 4, 8);
    }
    
    // Crutch tips
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      const tipShake1 = Math.sin(this.struggleTime * 12) * 5;
      const tipShake2 = Math.cos(this.struggleTime * 10) * 4;
      ctx.fillRect(-27 + tipShake1, 28, 4, 4);
      ctx.fillRect(23 + tipShake2, 28, 4, 4);
    } else {
      ctx.fillRect(-27, 28, 4, 4);
      ctx.fillRect(23, 28, 4, 4);
    }
  }
}