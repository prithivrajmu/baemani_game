import { BaseCharacter } from './baseCharacter.js';

export class GothCharacter extends BaseCharacter {
  constructor(x, y) {
    super(x, y, 'goth');
  }
  
  drawCharacter(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Add sliding rotation effect
    if (this.isMoving) {
      const rotation = Math.sin(this.moveProgress * Math.PI) * 0.3;
      ctx.rotate(rotation);
    }
    
    // Struggling animation when stuck
    if (this.isStuck) {
      const struggle = Math.sin(this.struggleTime * 8) * 0.2;
      ctx.rotate(struggle);
      
      // Frantic shaking
      const shakeX = Math.sin(this.struggleTime * 12) * 3;
      const shakeY = Math.cos(this.struggleTime * 15) * 2;
      ctx.translate(shakeX, shakeY);
    } else {
      // Idle animation - slight bob
      const idleBob = Math.sin(this.idleTime * 3) * 2;
      ctx.translate(0, idleBob);
    }
    
    // Character scale
    let scale = 1;
    if (this.isMoving) {
      scale += Math.sin(this.moveProgress * Math.PI) * 0.3;
    } else if (this.isStuck) {
      scale += Math.sin(this.struggleTime * 10) * 0.1;
    }
    ctx.scale(scale, scale);
    
    // Draw shadow
    ctx.fillStyle = this.isStuck ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-25, 35, 50, 8);
    
    // Draw boots
    ctx.fillStyle = '#000';
    ctx.fillRect(-20, 25, 15, 12);
    ctx.fillRect(5, 25, 15, 12);
    
    // Boot buckles
    ctx.fillStyle = '#888';
    ctx.fillRect(-18, 27, 3, 2);
    ctx.fillRect(7, 27, 3, 2);
    
    // Draw legs
    ctx.fillStyle = '#111';
    if (this.isStuck) {
      const legFlail = Math.sin(this.struggleTime * 6) * 5;
      ctx.fillRect(-15 + legFlail, -5, 12, 32);
      ctx.fillRect(3 - legFlail, -5, 12, 32);
    } else {
      ctx.fillRect(-15, -5, 12, 32);
      ctx.fillRect(3, -5, 12, 32);
    }
    
    // Draw torso
    ctx.fillStyle = '#000';
    ctx.fillRect(-18, -25, 36, 25);
    
    // Draw arms
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      const armFlail1 = Math.sin(this.struggleTime * 7) * 10;
      const armFlail2 = Math.cos(this.struggleTime * 9) * 10;
      ctx.fillRect(-25 + armFlail1, -20, 10, 20);
      ctx.fillRect(15 + armFlail2, -20, 10, 20);
    } else {
      ctx.fillRect(-25, -20, 10, 20);
      ctx.fillRect(15, -20, 10, 20);
    }
    
    // Draw guitar
    this.drawGuitar(ctx);
    
    // Draw head
    ctx.fillStyle = '#F5DEB3';
    ctx.beginPath();
    ctx.arc(0, -35, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw spiky hair
    ctx.fillStyle = '#000';
    const spikes = [
      { x: -8, y: -45, w: 4, h: 8 },
      { x: -3, y: -47, w: 3, h: 10 },
      { x: 2, y: -46, w: 4, h: 9 },
      { x: 7, y: -44, w: 3, h: 7 }
    ];
    
    spikes.forEach((spike, index) => {
      let spikeY = spike.y;
      if (this.isStuck) {
        spikeY += Math.sin(this.struggleTime * 8 + index) * 3;
      }
      ctx.fillRect(spike.x, spikeY, spike.w, spike.h);
    });
    
    // Draw eyes
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      ctx.fillRect(-7, -38, 4, 3);
      ctx.fillRect(3, -38, 4, 3);
    } else {
      ctx.fillRect(-6, -38, 3, 2);
      ctx.fillRect(3, -38, 3, 2);
    }
    
    // Eye liner
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, -39);
    ctx.lineTo(-3, -38);
    ctx.moveTo(2, -38);
    ctx.lineTo(7, -39);
    ctx.stroke();
    
    // Draw mouth when stuck
    if (this.isStuck) {
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(0, -30, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  drawGuitar(ctx) {
    // Guitar body
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(-12, -10, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Guitar neck
    ctx.fillStyle = '#654321';
    ctx.fillRect(-20, -18, 15, 4);
    
    // Guitar headstock
    ctx.fillStyle = '#654321';
    ctx.fillRect(-22, -20, 4, 8);
    
    // Strings
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      let y = -18 + i * 0.6;
      if (this.isStuck) {
        y += Math.sin(this.struggleTime * 20 + i) * 0.5;
      }
      ctx.beginPath();
      ctx.moveTo(-22, y);
      ctx.lineTo(-5, y);
      ctx.stroke();
    }
    
    // Pickups
    ctx.fillStyle = '#000';
    ctx.fillRect(-15, -12, 6, 2);
    ctx.fillRect(-15, -8, 6, 2);
    
    // Bridge
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(-15, -5, 6, 1);
  }
}