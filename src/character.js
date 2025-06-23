export class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.spawnX = x;
    this.spawnY = y;
    
    // Animation state
    this.idleTime = 0;
    this.isSliding = false;
    this.slideProgress = 0;
    this.slideStartX = x;
    this.slideStartY = y;
    this.slideDistance = 80;
    this.slideSpeed = 0.15;
    
    // Collision and stuck state
    this.isStuck = false;
    this.stuckToLimo = null;
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
    this.stuckToLimo = null;
    this.isSliding = false;
    this.slideProgress = 0;
    this.trail = [];
    this.struggleTime = 0;
  }
  
  getStuckToLimo(limo) {
    if (this.isStuck) return;
    
    this.isStuck = true;
    this.stuckToLimo = limo;
    this.isSliding = false;
    
    // Calculate offset from limo position
    this.stuckOffsetX = this.x - limo.x;
    this.stuckOffsetY = this.y - limo.y;
    
    // Clear trail when stuck
    this.trail = [];
  }
  
  startPowerSlide(dirX, dirY) {
    if (this.isSliding || this.isStuck) return;
    
    this.isSliding = true;
    this.slideProgress = 0;
    this.slideStartX = this.x;
    this.slideStartY = this.y;
    
    // Calculate slide destination
    this.targetX = this.x + dirX * this.slideDistance;
    this.targetY = this.y + dirY * this.slideDistance;
  }
  
  update() {
    if (this.isStuck && this.stuckToLimo) {
      // Follow the limousine
      this.x = this.stuckToLimo.x + this.stuckOffsetX;
      this.y = this.stuckToLimo.y + this.stuckOffsetY;
      this.struggleTime += 0.2;
      return;
    }
    
    if (this.isSliding) {
      this.slideProgress += this.slideSpeed;
      
      if (this.slideProgress >= 1) {
        this.slideProgress = 1;
        this.isSliding = false;
      }
      
      // Smooth easing for slide
      const easeOut = 1 - Math.pow(1 - this.slideProgress, 3);
      this.x = this.slideStartX + (this.targetX - this.slideStartX) * easeOut;
      this.y = this.slideStartY + (this.targetY - this.slideStartY) * easeOut;
      
      // Add to trail during slide
      if (this.slideProgress < 0.8) {
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
    
    // Draw character
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
  
  drawCharacter(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Add sliding rotation effect
    if (this.isSliding) {
      const rotation = Math.sin(this.slideProgress * Math.PI) * 0.3;
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
    if (this.isSliding) {
      scale += Math.sin(this.slideProgress * Math.PI) * 0.3;
    } else if (this.isStuck) {
      scale += Math.sin(this.struggleTime * 10) * 0.1; // Frantic scaling
    }
    ctx.scale(scale, scale);
    
    // Draw shadow (dimmer when stuck)
    ctx.fillStyle = this.isStuck ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-25, 35, 50, 8);
    
    // Draw boots (heavy, gothic)
    ctx.fillStyle = '#000';
    ctx.fillRect(-20, 25, 15, 12); // Left boot
    ctx.fillRect(5, 25, 15, 12);   // Right boot
    
    // Boot buckles
    ctx.fillStyle = '#888';
    ctx.fillRect(-18, 27, 3, 2);
    ctx.fillRect(7, 27, 3, 2);
    
    // Draw legs (black pants) - more animated when stuck
    ctx.fillStyle = '#111';
    if (this.isStuck) {
      // Legs flailing
      const legFlail = Math.sin(this.struggleTime * 6) * 5;
      ctx.fillRect(-15 + legFlail, -5, 12, 32); // Left leg
      ctx.fillRect(3 - legFlail, -5, 12, 32);   // Right leg
    } else {
      ctx.fillRect(-15, -5, 12, 32); // Left leg
      ctx.fillRect(3, -5, 12, 32);   // Right leg
    }
    
    // Draw torso (black shirt)
    ctx.fillStyle = '#000';
    ctx.fillRect(-18, -25, 36, 25);
    
    // Draw arms - flailing when stuck
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      const armFlail1 = Math.sin(this.struggleTime * 7) * 10;
      const armFlail2 = Math.cos(this.struggleTime * 9) * 10;
      ctx.fillRect(-25 + armFlail1, -20, 10, 20); // Left arm
      ctx.fillRect(15 + armFlail2, -20, 10, 20);  // Right arm
    } else {
      ctx.fillRect(-25, -20, 10, 20); // Left arm
      ctx.fillRect(15, -20, 10, 20);  // Right arm
    }
    
    // Draw guitar
    this.drawGuitar(ctx);
    
    // Draw head (pale skin)
    ctx.fillStyle = '#F5DEB3';
    ctx.beginPath();
    ctx.arc(0, -35, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw spiky hair (black) - more chaotic when stuck
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
    
    // Draw eyes (gothic makeup) - wider when stuck (panic)
    ctx.fillStyle = '#000';
    if (this.isStuck) {
      ctx.fillRect(-7, -38, 4, 3); // Left eye (wider)
      ctx.fillRect(3, -38, 4, 3);  // Right eye (wider)
    } else {
      ctx.fillRect(-6, -38, 3, 2); // Left eye
      ctx.fillRect(3, -38, 3, 2);  // Right eye
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
    
    // Draw mouth when stuck (open in shock)
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
    ctx.fillStyle = '#8B0000'; // Dark red electric guitar
    ctx.beginPath();
    ctx.ellipse(-12, -10, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Guitar neck
    ctx.fillStyle = '#654321';
    ctx.fillRect(-20, -18, 15, 4);
    
    // Guitar headstock
    ctx.fillStyle = '#654321';
    ctx.fillRect(-22, -20, 4, 8);
    
    // Strings (vibrating when stuck)
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      let y = -18 + i * 0.6;
      if (this.isStuck) {
        y += Math.sin(this.struggleTime * 20 + i) * 0.5; // String vibration
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