import Phaser from 'phaser';

export default class HUD {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(100);
    
    this.createHUD();
    
    // Animation values
    this.displayScore = 0;
    this.displayRings = 0;
    this.ringFlashTimer = 0;
  }

  createHUD() {
    const scene = this.scene;
    
    // HUD background panel (top-left)
    const panel = scene.add.graphics();
    panel.fillStyle(0x000000, 0.5);
    panel.fillRoundedRect(10, 10, 200, 90, 10);
    this.container.add(panel);
    
    // Score
    this.scoreLabel = scene.add.text(20, 18, 'SCORE', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#FFD700',
    });
    this.container.add(this.scoreLabel);
    
    this.scoreText = scene.add.text(20, 32, '00000000', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '18px',
      color: '#FFFFFF',
    });
    this.container.add(this.scoreText);
    
    // Rings
    this.ringLabel = scene.add.text(20, 55, 'RINGS', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#FFD700',
    });
    this.container.add(this.ringLabel);
    
    this.ringIcon = scene.add.sprite(20, 78, 'ring');
    this.ringIcon.setScale(0.6);
    this.ringIcon.setOrigin(0, 0.5);
    this.container.add(this.ringIcon);
    
    this.ringText = scene.add.text(40, 70, '000', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '16px',
      color: '#FFFFFF',
    });
    this.container.add(this.ringText);
    
    // Timer (top-right)
    const timerPanel = scene.add.graphics();
    timerPanel.fillStyle(0x000000, 0.5);
    timerPanel.fillRoundedRect(scene.cameras.main.width - 110, 10, 100, 40, 10);
    this.container.add(timerPanel);
    
    this.timerLabel = scene.add.text(scene.cameras.main.width - 100, 14, 'TIME', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      color: '#FFD700',
    });
    this.container.add(this.timerLabel);
    
    this.timerText = scene.add.text(scene.cameras.main.width - 100, 26, '00:00', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '18px',
      color: '#FFFFFF',
    });
    this.container.add(this.timerText);
    
    // Lives (bottom-left)
    const livesPanel = scene.add.graphics();
    livesPanel.fillStyle(0x000000, 0.5);
    livesPanel.fillRoundedRect(10, scene.cameras.main.height - 50, 80, 40, 10);
    this.container.add(livesPanel);
    
    this.lifeIcon = scene.add.image(30, scene.cameras.main.height - 30, 'lifeIcon');
    this.lifeIcon.setScale(0.8);
    this.container.add(this.lifeIcon);
    
    this.livesText = scene.add.text(50, scene.cameras.main.height - 38, 'x3', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '18px',
      color: '#FFFFFF',
    });
    this.container.add(this.livesText);
    
    // Ring animation
    scene.anims.create({
      key: 'hud-ring-spin',
      frames: scene.anims.generateFrameNumbers('ring', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.ringIcon.play('hud-ring-spin');
    
    // Start timer
    this.startTime = scene.time.now;
  }

  update(time, delta) {
    const state = window.gameState;
    
    // Smooth score animation
    if (this.displayScore < state.score) {
      this.displayScore = Math.min(state.score, this.displayScore + Math.ceil((state.score - this.displayScore) / 10));
    }
    this.scoreText.setText(this.displayScore.toString().padStart(8, '0'));
    
    // Ring count with flash effect
    const currentRings = state.rings;
    if (currentRings !== this.displayRings) {
      this.displayRings = currentRings;
      this.ringFlashTimer = 200;
      
      // Flash effect
      this.ringText.setColor('#FFFF00');
      this.ringText.setScale(1.3);
    }
    
    if (this.ringFlashTimer > 0) {
      this.ringFlashTimer -= delta;
      if (this.ringFlashTimer <= 0) {
        this.ringText.setColor('#FFFFFF');
        this.ringText.setScale(1);
      }
    }
    
    this.ringText.setText(currentRings.toString().padStart(3, '0'));
    
    // Timer
    const elapsed = Math.floor((time - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.timerText.setText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    
    // Lives
    this.livesText.setText(`x${state.lives}`);
    
    // Low ring warning
    if (currentRings === 0) {
      this.ringText.setColor('#FF4444');
      this.ringIcon.setTint(0xFF4444);
    } else {
      this.ringIcon.clearTint();
    }
  }

  destroy() {
    this.container.destroy();
  }
}
