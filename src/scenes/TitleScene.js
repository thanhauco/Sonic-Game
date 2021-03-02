import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Animated sky background
    this.add.image(width / 2, height / 2, 'sky').setScale(1.2);
    
    // Parallax mountains
    this.mountains = this.add.tileSprite(width / 2, height - 150, width, 400, 'mountains');
    this.mountains.setScale(0.8);
    
    // Parallax trees
    this.trees = this.add.tileSprite(width / 2, height - 80, width, 300, 'trees');
    this.trees.setScale(0.7);
    
    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x228B22, 1);
    ground.fillRect(0, height - 60, width, 60);
    
    // Checkered pattern on ground
    ground.fillStyle(0x8B4513, 1);
    ground.fillRect(0, height - 40, width, 40);
    ground.fillStyle(0xA0522D, 1);
    for (let i = 0; i < width / 20; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          ground.fillRect(i * 20, height - 40 + j * 20, 20, 20);
        }
      }
    }
    
    // Game logo container
    const logoY = 150;
    
    // Title shadow
    this.add.text(width / 2 + 4, logoY + 4, 'SONIC', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '72px',
      color: '#000000',
    }).setOrigin(0.5).setAlpha(0.3);
    
    // Main title - SONIC
    const sonicText = this.add.text(width / 2, logoY, 'SONIC', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '72px',
      color: '#0066FF',
      stroke: '#FFFFFF',
      strokeThickness: 6,
    }).setOrigin(0.5);
    
    // Title glow effect
    this.tweens.add({
      targets: sonicText,
      alpha: { from: 1, to: 0.8 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    
    // Subtitle - RUSH
    const rushText = this.add.text(width / 2, logoY + 65, 'RUSH', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '48px',
      color: '#FFD700',
      stroke: '#FF6600',
      strokeThickness: 4,
    }).setOrigin(0.5);
    
    // Rush text animation
    this.tweens.add({
      targets: rushText,
      scaleX: { from: 1, to: 1.05 },
      scaleY: { from: 1, to: 1.05 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Sonic character running animation
    const sonic = this.add.sprite(width / 2, height - 100, 'sonic');
    sonic.setScale(2);
    
    // Create animations
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'sonic', frame: 0 }],
      frameRate: 1,
    });
    
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('sonic', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1,
    });
    
    sonic.play('run');
    
    // Floating animation for Sonic
    this.tweens.add({
      targets: sonic,
      y: height - 105,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Spinning rings decoration
    const ringPositions = [
      { x: 150, y: 200 },
      { x: 650, y: 200 },
      { x: 100, y: 350 },
      { x: 700, y: 350 },
    ];
    
    ringPositions.forEach((pos, index) => {
      const ring = this.add.sprite(pos.x, pos.y, 'ring');
      ring.setScale(1.5);
      
      this.anims.create({
        key: `ring-spin-${index}`,
        frames: this.anims.generateFrameNumbers('ring', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
      
      ring.play(`ring-spin-${index}`);
      
      // Float animation
      this.tweens.add({
        targets: ring,
        y: pos.y - 10,
        duration: 800 + index * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
    
    // Press Start text
    const pressStart = this.add.text(width / 2, height - 180, 'PRESS SPACE OR CLICK TO START', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    
    // Blinking animation
    this.tweens.add({
      targets: pressStart,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    
    // Controls info
    this.add.text(width / 2, height - 25, '← → Move   |   SPACE Jump   |   ↓ Roll   |   ↓ + SPACE Spin Dash', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    
    // High score display
    const highScore = window.gameState?.highScore || 0;
    this.add.text(width / 2, 280, `HIGH SCORE: ${highScore.toString().padStart(8, '0')}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    
    // Input handlers
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.once('pointerdown', () => this.startGame());
    
    // Fade in
    this.cameras.main.fadeIn(500);
  }

  update() {
    // Parallax scrolling
    if (this.mountains) {
      this.mountains.tilePositionX += 0.3;
    }
    if (this.trees) {
      this.trees.tilePositionX += 0.8;
    }
  }

  startGame() {
    // Reset game state
    window.gameState = {
      score: 0,
      rings: 0,
      lives: 3,
      highScore: window.gameState?.highScore || 0,
    };
    
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('GameScene');
    });
  }
}
