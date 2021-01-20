import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Loading background
    const bgGradient = this.add.graphics();
    bgGradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f3460, 0x0f3460, 1);
    bgGradient.fillRect(0, 0, width, height);
    
    // Title text
    const titleText = this.add.text(width / 2, height / 3, 'SONIC RUSH', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '48px',
      color: '#00d4ff',
      stroke: '#0066cc',
      strokeThickness: 4,
    }).setOrigin(0.5);
    
    // Animate title
    this.tweens.add({
      targets: titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Loading bar container
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222244, 0.8);
    progressBox.fillRoundedRect(width / 2 - 160, height / 2, 320, 30, 8);
    
    const progressBar = this.add.graphics();
    
    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 + 60, 'Loading...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Percentage text
    const percentText = this.add.text(width / 2, height / 2 + 15, '0%', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Update progress bar
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillGradientStyle(0x00d4ff, 0x0099ff, 0x00d4ff, 0x0099ff, 1);
      progressBar.fillRoundedRect(width / 2 - 155, height / 2 + 5, 310 * value, 20, 6);
      percentText.setText(parseInt(value * 100) + '%');
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
    
    // Generate all game assets programmatically
    this.generateAssets();
  }

  generateAssets() {
    // Generate Sonic sprite sheet
    this.generateSonicSprites();
    
    // Generate ring sprite
    this.generateRingSprite();
    
    // Generate platform tiles
    this.generatePlatformTiles();
    
    // Generate enemy sprites
    this.generateEnemySprites();
    
    // Generate background layers
    this.generateBackgrounds();
    
    // Generate UI elements
    this.generateUIElements();
    
    // Generate particles
    this.generateParticles();
  }

  generateSonicSprites() {
    const canvas = document.createElement('canvas');
    canvas.width = 384; // 6 frames x 64px
    canvas.height = 256; // 4 rows x 64px
    const ctx = canvas.getContext('2d');
    
    const sonicBlue = '#1E90FF';
    const sonicDarkBlue = '#0066CC';
    const skinColor = '#FFCC99';
    const shoeRed = '#FF4444';
    const white = '#FFFFFF';
    
    // Draw idle frame (row 0, frame 0)
    this.drawSonicFrame(ctx, 0, 0, 'idle', sonicBlue, sonicDarkBlue, skinColor, shoeRed, white);
    
    // Draw running frames (row 0, frames 1-5)
    for (let i = 1; i < 6; i++) {
      this.drawSonicFrame(ctx, i * 64, 0, 'run', sonicBlue, sonicDarkBlue, skinColor, shoeRed, white, i);
    }
    
    // Draw jump frames (row 1)
    for (let i = 0; i < 6; i++) {
      this.drawSonicFrame(ctx, i * 64, 64, 'jump', sonicBlue, sonicDarkBlue, skinColor, shoeRed, white, i);
    }
    
    // Draw spin/roll frames (row 2)
    for (let i = 0; i < 6; i++) {
      this.drawSonicFrame(ctx, i * 64, 128, 'spin', sonicBlue, sonicDarkBlue, skinColor, shoeRed, white, i);
    }
    
    // Draw hurt/special frames (row 3)
    this.drawSonicFrame(ctx, 0, 192, 'hurt', sonicBlue, sonicDarkBlue, skinColor, shoeRed, white);
    this.drawSonicFrame(ctx, 64, 192, 'spindash', sonicBlue, sonicDarkBlue, skinColor, shoeRed, white);
    
    this.textures.addCanvas('sonic', canvas);
  }

  drawSonicFrame(ctx, x, y, type, blue, darkBlue, skin, red, white, frame = 0) {
    ctx.save();
    ctx.translate(x + 32, y + 32);
    
    if (type === 'spin') {
      // Rotate for spin animation
      ctx.rotate((frame * Math.PI) / 3);
    }
    
    if (type === 'spin' || type === 'spindash') {
      // Ball form
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, 20);
      gradient.addColorStop(0, blue);
      gradient.addColorStop(1, darkBlue);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Spines
      ctx.fillStyle = darkBlue;
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(25, -6);
        ctx.lineTo(25, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 5, 14, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = blue;
      ctx.fill();
      
      // Head
      ctx.beginPath();
      ctx.arc(0, -12, 16, 0, Math.PI * 2);
      ctx.fillStyle = blue;
      ctx.fill();
      
      // Spines (back of head)
      ctx.fillStyle = darkBlue;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(8, -20 + i * 8);
        ctx.lineTo(28, -24 + i * 10);
        ctx.lineTo(25, -16 + i * 8);
        ctx.closePath();
        ctx.fill();
      }
      
      // Face area (tan/peach)
      ctx.beginPath();
      ctx.ellipse(-2, -8, 10, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = skin;
      ctx.fill();
      
      // Eyes
      ctx.beginPath();
      ctx.ellipse(-4, -12, 4, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = white;
      ctx.fill();
      
      // Pupils
      ctx.beginPath();
      ctx.arc(-3, -11, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Nose
      ctx.beginPath();
      ctx.arc(-10, -6, 3, 0, Math.PI * 2);
      ctx.fillStyle = skin;
      ctx.fill();
      
      // Shoes
      const legOffset = type === 'run' ? Math.sin(frame * 1.2) * 10 : 0;
      
      // Left shoe
      ctx.beginPath();
      ctx.ellipse(-6, 26 - legOffset, 10, 6, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = red;
      ctx.fill();
      
      // Right shoe
      ctx.beginPath();
      ctx.ellipse(6, 26 + legOffset, 10, 6, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = red;
      ctx.fill();
      
      // Shoe stripes
      ctx.strokeStyle = white;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 24 - legOffset);
      ctx.lineTo(-2, 24 - legOffset);
      ctx.moveTo(2, 24 + legOffset);
      ctx.lineTo(10, 24 + legOffset);
      ctx.stroke();
      
      if (type === 'hurt') {
        // X eyes for hurt
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-7, -15);
        ctx.lineTo(-1, -9);
        ctx.moveTo(-1, -15);
        ctx.lineTo(-7, -9);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  generateRingSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 192; // 6 frames x 32px
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < 6; i++) {
      const x = i * 32 + 16;
      const y = 16;
      const scaleX = Math.abs(Math.cos((i * Math.PI) / 3));
      
      // Outer ring
      ctx.beginPath();
      ctx.ellipse(x, y, 12 * Math.max(scaleX, 0.3), 12, 0, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, 12);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FFA500');
      gradient.addColorStop(1, '#B8860B');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Inner ring (hole)
      ctx.beginPath();
      ctx.ellipse(x, y, 5 * Math.max(scaleX, 0.3), 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#87CEEB';
      ctx.fill();
      
      // Shine
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
    
    this.textures.addCanvas('ring', canvas);
  }

  generatePlatformTiles() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; // 4 tiles x 64px
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Ground tile with checkered pattern
    this.drawGroundTile(ctx, 0, 0, '#8B4513', '#A0522D');
    
    // Grass top tile
    this.drawGrassTile(ctx, 64, 0);
    
    // Platform tile
    this.drawPlatformTile(ctx, 128, 0);
    
    // Corner tile
    this.drawCornerTile(ctx, 192, 0);
    
    this.textures.addCanvas('tiles', canvas);
  }

  drawGroundTile(ctx, x, y, color1, color2) {
    const size = 64;
    const checkSize = 16;
    
    for (let row = 0; row < size / checkSize; row++) {
      for (let col = 0; col < size / checkSize; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? color1 : color2;
        ctx.fillRect(x + col * checkSize, y + row * checkSize, checkSize, checkSize);
      }
    }
  }

  drawGrassTile(ctx, x, y) {
    // Brown base
    this.drawGroundTile(ctx, x, y + 20, '#8B4513', '#A0522D');
    
    // Green grass top
    ctx.fillStyle = '#228B22';
    ctx.fillRect(x, y, 64, 20);
    
    // Grass blades
    ctx.fillStyle = '#32CD32';
    for (let i = 0; i < 8; i++) {
      const bladeX = x + i * 8 + 4;
      ctx.beginPath();
      ctx.moveTo(bladeX, y + 20);
      ctx.lineTo(bladeX - 3, y + 5 + Math.random() * 5);
      ctx.lineTo(bladeX + 3, y + 5 + Math.random() * 5);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawPlatformTile(ctx, x, y) {
    // Main platform
    const gradient = ctx.createLinearGradient(x, y, x, y + 64);
    gradient.addColorStop(0, '#4a9c2d');
    gradient.addColorStop(0.3, '#3d8526');
    gradient.addColorStop(1, '#2d5a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, 64, 64);
    
    // Top edge highlight
    ctx.fillStyle = '#5bb535';
    ctx.fillRect(x, y, 64, 8);
    
    // Texture lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + 16 + i * 12);
      ctx.lineTo(x + 64, y + 16 + i * 12);
      ctx.stroke();
    }
  }

  drawCornerTile(ctx, x, y) {
    this.drawGrassTile(ctx, x, y);
    
    // Round corner
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.arc(x + 64, y + 64, 20, Math.PI, Math.PI * 1.5);
    ctx.lineTo(x + 64, y + 64);
    ctx.closePath();
    ctx.fill();
  }

  generateEnemySprites() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; // 4 frames x 64px
    canvas.height = 128; // 2 enemies x 64px
    const ctx = canvas.getContext('2d');
    
    // Crabmeat enemy (row 0)
    for (let i = 0; i < 4; i++) {
      this.drawCrabmeat(ctx, i * 64, 0, i);
    }
    
    // Buzzbomber enemy (row 1)
    for (let i = 0; i < 4; i++) {
      this.drawBuzzbomber(ctx, i * 64, 64, i);
    }
    
    this.textures.addCanvas('enemies', canvas);
  }

  drawCrabmeat(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x + 32, y + 40);
    
    // Body
    const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, 20);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#CC4444');
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Eyes
    const eyeOffset = Math.sin(frame * 0.5) * 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-8, -8 + eyeOffset, 5, 0, Math.PI * 2);
    ctx.arc(8, -8 + eyeOffset, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-7, -8 + eyeOffset, 2, 0, Math.PI * 2);
    ctx.arc(9, -8 + eyeOffset, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Claws
    const clawAngle = Math.sin(frame * 1.5) * 0.3;
    ctx.fillStyle = '#FF4444';
    
    // Left claw
    ctx.save();
    ctx.translate(-22, 5);
    ctx.rotate(-0.5 + clawAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Right claw
    ctx.save();
    ctx.translate(22, 5);
    ctx.rotate(0.5 - clawAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Legs
    ctx.strokeStyle = '#CC4444';
    ctx.lineWidth = 3;
    for (let i = -1; i <= 1; i++) {
      const legOffset = Math.sin(frame + i) * 3;
      ctx.beginPath();
      ctx.moveTo(i * 10, 12);
      ctx.lineTo(i * 12, 20 + legOffset);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  drawBuzzbomber(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x + 32, y + 32);
    
    // Body
    const gradient = ctx.createLinearGradient(0, -15, 0, 15);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#000000');
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Stripes
    ctx.fillStyle = '#000000';
    for (let i = -1; i <= 1; i++) {
      ctx.fillRect(-18, i * 8, 36, 4);
    }
    
    // Wings
    const wingFlap = Math.sin(frame * 3) * 15;
    ctx.fillStyle = 'rgba(200, 200, 255, 0.7)';
    
    // Left wing
    ctx.beginPath();
    ctx.ellipse(-10, -15 - wingFlap, 15, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Right wing
    ctx.beginPath();
    ctx.ellipse(10, -15 - wingFlap, 15, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-6, -2, 4, 0, Math.PI * 2);
    ctx.arc(6, -2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Stinger
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(-4, 22);
    ctx.lineTo(4, 22);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  generateBackgrounds() {
    // Sky layer
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 800;
    skyCanvas.height = 600;
    const skyCtx = skyCanvas.getContext('2d');
    
    // Gradient sky
    const gradient = skyCtx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#B0E2FF');
    gradient.addColorStop(1, '#E0F7FA');
    skyCtx.fillStyle = gradient;
    skyCtx.fillRect(0, 0, 800, 600);
    
    // Fluffy clouds
    for (let i = 0; i < 8; i++) {
      this.drawCloud(skyCtx, 100 + i * 120, 50 + Math.random() * 150, 40 + Math.random() * 30);
    }
    
    this.textures.addCanvas('sky', skyCanvas);
    
    // Mountains layer
    const mountainCanvas = document.createElement('canvas');
    mountainCanvas.width = 1600;
    mountainCanvas.height = 400;
    const mountainCtx = mountainCanvas.getContext('2d');
    
    // Distant mountains
    mountainCtx.fillStyle = '#6B8E23';
    for (let i = 0; i < 8; i++) {
      this.drawMountain(mountainCtx, i * 220 - 50, 400, 200 + Math.random() * 100, 250 + Math.random() * 50);
    }
    
    // Closer hills
    mountainCtx.fillStyle = '#228B22';
    for (let i = 0; i < 12; i++) {
      this.drawHill(mountainCtx, i * 150 - 30, 400, 120 + Math.random() * 60);
    }
    
    this.textures.addCanvas('mountains', mountainCanvas);
    
    // Trees layer
    const treeCanvas = document.createElement('canvas');
    treeCanvas.width = 1200;
    treeCanvas.height = 300;
    const treeCtx = treeCanvas.getContext('2d');
    
    for (let i = 0; i < 15; i++) {
      this.drawPalmTree(treeCtx, 40 + i * 80, 280, 80 + Math.random() * 40);
    }
    
    this.textures.addCanvas('trees', treeCanvas);
  }

  drawCloud(ctx, x, y, size) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size * 1.2, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y + size * 0.2, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMountain(ctx, x, baseY, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + width / 2, baseY - height);
    ctx.lineTo(x + width, baseY);
    ctx.closePath();
    ctx.fill();
    
    // Snow cap
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x + width / 2, baseY - height);
    ctx.lineTo(x + width / 2 - 20, baseY - height + 30);
    ctx.lineTo(x + width / 2 + 20, baseY - height + 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#6B8E23';
  }

  drawHill(ctx, x, baseY, size) {
    ctx.beginPath();
    ctx.arc(x + size, baseY, size, Math.PI, 0);
    ctx.fill();
  }

  drawPalmTree(ctx, x, y, height) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x - 5, y - height);
    ctx.lineTo(x + 5, y - height);
    ctx.lineTo(x + 8, y);
    ctx.closePath();
    ctx.fill();
    
    // Trunk segments
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(x - 7 + i * 0.3, y - i * height / 6);
      ctx.lineTo(x + 7 - i * 0.3, y - i * height / 6);
      ctx.stroke();
    }
    
    // Leaves
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const leafLength = 50;
      ctx.save();
      ctx.translate(x, y - height);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(leafLength / 2, 0, leafLength / 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  generateUIElements() {
    // Life icon
    const lifeCanvas = document.createElement('canvas');
    lifeCanvas.width = 32;
    lifeCanvas.height = 32;
    const lifeCtx = lifeCanvas.getContext('2d');
    
    // Mini Sonic face
    lifeCtx.fillStyle = '#1E90FF';
    lifeCtx.beginPath();
    lifeCtx.arc(16, 16, 14, 0, Math.PI * 2);
    lifeCtx.fill();
    
    // Spines
    lifeCtx.fillStyle = '#0066CC';
    for (let i = 0; i < 3; i++) {
      lifeCtx.beginPath();
      lifeCtx.moveTo(24, 8 + i * 6);
      lifeCtx.lineTo(32, 6 + i * 6);
      lifeCtx.lineTo(30, 12 + i * 6);
      lifeCtx.closePath();
      lifeCtx.fill();
    }
    
    // Eye
    lifeCtx.fillStyle = '#FFFFFF';
    lifeCtx.beginPath();
    lifeCtx.ellipse(12, 12, 4, 6, 0, 0, Math.PI * 2);
    lifeCtx.fill();
    
    lifeCtx.fillStyle = '#000000';
    lifeCtx.beginPath();
    lifeCtx.arc(13, 12, 2, 0, Math.PI * 2);
    lifeCtx.fill();
    
    this.textures.addCanvas('lifeIcon', lifeCanvas);
    
    // Monitor box
    const monitorCanvas = document.createElement('canvas');
    monitorCanvas.width = 128; // 4 types x 32px
    monitorCanvas.height = 32;
    const monitorCtx = monitorCanvas.getContext('2d');
    
    const monitorTypes = ['speed', 'shield', 'invincibility', 'life'];
    const monitorColors = ['#FF6600', '#00BFFF', '#FFD700', '#FF69B4'];
    
    monitorTypes.forEach((type, i) => {
      const x = i * 32;
      
      // Box
      monitorCtx.fillStyle = '#444444';
      monitorCtx.fillRect(x + 2, 2, 28, 28);
      
      monitorCtx.fillStyle = '#222222';
      monitorCtx.fillRect(x + 4, 4, 24, 24);
      
      // Screen
      monitorCtx.fillStyle = monitorColors[i];
      monitorCtx.fillRect(x + 6, 6, 20, 20);
      
      // Icon inside
      monitorCtx.fillStyle = '#FFFFFF';
      if (type === 'speed') {
        // Shoe icon
        monitorCtx.beginPath();
        monitorCtx.ellipse(x + 16, 16, 8, 4, 0, 0, Math.PI * 2);
        monitorCtx.fill();
      } else if (type === 'shield') {
        // Shield icon
        monitorCtx.beginPath();
        monitorCtx.arc(x + 16, 14, 6, Math.PI, 0);
        monitorCtx.lineTo(x + 16, 24);
        monitorCtx.closePath();
        monitorCtx.fill();
      } else if (type === 'invincibility') {
        // Star icon
        this.drawStar(monitorCtx, x + 16, 16, 8);
      } else if (type === 'life') {
        // Heart icon
        monitorCtx.beginPath();
        monitorCtx.arc(x + 12, 14, 4, 0, Math.PI * 2);
        monitorCtx.arc(x + 20, 14, 4, 0, Math.PI * 2);
        monitorCtx.fill();
        monitorCtx.beginPath();
        monitorCtx.moveTo(x + 8, 16);
        monitorCtx.lineTo(x + 16, 24);
        monitorCtx.lineTo(x + 24, 16);
        monitorCtx.closePath();
        monitorCtx.fill();
      }
    });
    
    this.textures.addCanvas('monitors', monitorCanvas);
  }

  drawStar(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  generateParticles() {
    // Spark particle
    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 16;
    sparkCanvas.height = 16;
    const sparkCtx = sparkCanvas.getContext('2d');
    
    const gradient = sparkCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
    sparkCtx.fillStyle = gradient;
    sparkCtx.fillRect(0, 0, 16, 16);
    
    this.textures.addCanvas('spark', sparkCanvas);
    
    // Dust cloud particle
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = 32;
    dustCanvas.height = 32;
    const dustCtx = dustCanvas.getContext('2d');
    
    const dustGradient = dustCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    dustGradient.addColorStop(0, 'rgba(200, 180, 150, 0.8)');
    dustGradient.addColorStop(1, 'rgba(200, 180, 150, 0)');
    dustCtx.fillStyle = dustGradient;
    dustCtx.beginPath();
    dustCtx.arc(16, 16, 16, 0, Math.PI * 2);
    dustCtx.fill();
    
    this.textures.addCanvas('dust', dustCanvas);
  }

  create() {
    // Transition to title scene
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('TitleScene');
    });
  }
}
