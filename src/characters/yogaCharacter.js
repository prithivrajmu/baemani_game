import { BaseCharacter } from './baseCharacter.js';

export class YogaCharacter extends BaseCharacter {
  constructor(x, y) {
    super(x, y, 'yoga');
    this.width = 35;
    this.height = 68;
  }
  
  drawCharacter(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Flowing movement animation
    if (this.isMoving) {
      const flow = Math.sin(this.moveProgress * Math.PI * 2) * 0.15;
      ctx.rotate(flow);
      
      // Graceful floating motion
      const float = Math.sin(this.moveProgress * Math.PI * 3) * 8;
      ctx.translate(0, float);
    }
    
    // Struggling animation when stuck (but still trying to be zen)
    if (this.isStuck) {
      const struggle = Math.sin(this.struggleTime * 4) * 0.1; // More controlled struggle
      ctx.rotate(struggle);
      
      const zenShake = Math.sin(this.struggleTime * 8) * 2;
      ctx.translate(zenShake, 0);
    } else if (!this.isMoving) {
      // Peaceful breathing animation
      const breathe = Math.sin(this.idleTime * 2) * 3;
      ctx.translate(0, breathe);
    }
    
    // Character scale (gentle pulsing)
    let scale = 1;
    if (this.isStuck) {
      scale += Math.sin(this.struggleTime * 6) * 0.05;
    } else {
      scale += Math.sin(this.idleTime * 2) * 0.02;
    }
    ctx.scale(scale, scale);
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(-20, 35, 40, 6);
    
    // Draw yoga mat (carried on back)
    ctx.fillStyle = '#9370DB';
    ctx.fillRect(-5, -30, 3, 40);
    ctx.fillStyle = '#8A2BE2';
    ctx.fillRect(-4, -29, 1, 38);
    
    // Draw feet (bare, in yoga pose)
    ctx.fillStyle = '#FDBCB4';
    if (this.isMoving) {
      // Graceful stepping
      const step = Math.sin(this.moveProgress * Math.PI * 4) * 5;
      ctx.fillRect(-15 + step, 25, 10, 8);
      ctx.fillRect(5 - step, 25, 10, 8);
    } else {
      ctx.fillRect(-15, 25, 10, 8);
      ctx.fillRect(5, 25, 10, 8);
    }
    
    // Draw legs (yoga pants)
    ctx.fillStyle = '#4B0082';
    if (this.isStuck) {
      const legTwist = Math.sin(this.struggleTime * 5) * 3;
      ctx.fillRect(-12 + legTwist, -5, 10, 32);
      ctx.fillRect(2 - legTwist, -5, 10, 32);
    } else {
      ctx.fillRect(-12, -5, 10, 32);
      ctx.fillRect(2, -5, 10, 32);
    }
    
    // Draw torso (yoga top)
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(-15, -25, 30, 25);
    
    // Yoga top pattern
    ctx.fillStyle = '#FFB6C1';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-8 + i * 8, -15, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw arms (in yoga pose)
    ctx.fillStyle = '#FDBCB4';
    if (this.isStuck) {
      // Still trying to maintain pose while stuck
      const armWave = Math.sin(this.struggleTime * 6) * 8;
      ctx.fillRect(-22 + armWave, -22, 8, 18);
      ctx.fillRect(14 - armWave, -22, 8, 18);
    } else {
      // Graceful arm positions
      ctx.fillRect(-22, -22, 8, 18);
      ctx.fillRect(14, -22, 8, 18);
    }
    
    // Draw soda bottle (the addiction!)
    this.drawSodaBottle(ctx);
    
    // Draw head (serene expression)
    ctx.fillStyle = '#FDBCB4';
    ctx.beginPath();
    ctx.arc(0, -35, 11, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw hair (in a bun)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(0, -45, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair tie
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(-2, -47, 4, 2);
    
    // Draw eyes (peaceful, closed during zen moments)
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      // Wide open in surprise but trying to stay zen
      ctx.fillRect(-5, -38, 3, 3);
      ctx.fillRect(2, -38, 3, 3);
    } else if (this.isMoving) {
      // Focused
      ctx.fillRect(-4, -38, 2, 2);
      ctx.fillRect(2, -38, 2, 2);
    } else {
      // Peaceful, slightly closed
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -37);
      ctx.lineTo(-2, -38);
      ctx.moveTo(2, -38);
      ctx.lineTo(5, -37);
      ctx.stroke();
    }
    
    // Draw mouth (serene smile or sipping)
    if (this.isStuck) {
      // "Om" expression
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(0, -30, 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Gentle smile
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -32, 3, 0, Math.PI);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  drawSodaBottle(ctx) {
    // Soda bottle (held in right hand)
    ctx.fillStyle = '#228B22';
    ctx.fillRect(18, -18, 6, 15);
    
    // Bottle cap
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(18, -20, 6, 3);
    
    // Label
    ctx.fillStyle = '#FFF';
    ctx.fillRect(19, -15, 4, 8);
    
    // Brand text (tiny)
    ctx.fillStyle = '#000';
    ctx.font = '4px monospace';
    ctx.fillText('ZEN', 19.5, -10);
    ctx.fillText('COLA', 19, -7);
    
    // Bubbles inside
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    if (this.isStuck) {
      // Shaking creates more bubbles
      for (let i = 0; i < 5; i++) {
        const bubbleY = -15 + Math.random() * 10;
        ctx.beginPath();
        ctx.arc(20 + Math.random() * 2, bubbleY, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Normal bubbles
      ctx.beginPath();
      ctx.arc(20, -12, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(21, -9, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Straw
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(21, -20);
    ctx.lineTo(21, -25);
    ctx.stroke();
    
    // Bendy part of straw
    ctx.beginPath();
    ctx.arc(19, -25, 2, 0, Math.PI);
    ctx.stroke();
  }
}