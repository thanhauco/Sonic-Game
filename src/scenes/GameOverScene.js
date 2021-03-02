import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Dark overlay background
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, width, height);
    
    // Game Over text with glitch effect
    const gameOverText = this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '64px',
      color: '#FF4444',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);
    
    // Pulse animation
    this.tweens.add({
      targets: gameOverText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Final score
    const finalScore = window.gameState?.score || 0;
    this.add.text(width / 2, height / 2 - 20, `FINAL SCORE: ${finalScore.toString().padStart(8, '0')}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    
    // Check for high score
    const highScore = window.gameState?.highScore || 0;
    if (finalScore > highScore) {
      window.gameState.highScore = finalScore;
      localStorage.setItem('sonicRushHighScore', finalScore.toString());
      
      const newHighScore = this.add.text(width / 2, height / 2 + 30, '★ NEW HIGH SCORE! ★', {
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: '24px',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: newHighScore,
        alpha: 0.5,
        duration: 300,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.add.text(width / 2, height / 2 + 30, `HIGH SCORE: ${highScore.toString().padStart(8, '0')}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5);
    }
    
    // Retry prompt
    const retryText = this.add.text(width / 2, height * 0.7, 'PRESS SPACE TO RETRY', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#00FF00',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: retryText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    
    // Menu option
    const menuText = this.add.text(width / 2, height * 0.78, 'PRESS M FOR MENU', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#AAAAAA',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    
    // Input handlers
    this.input.keyboard.on('keydown-SPACE', () => {
      this.cameras.main.fadeOut(300);
      this.time.delayedCall(300, () => {
        window.gameState.score = 0;
        window.gameState.rings = 0;
        window.gameState.lives = 3;
        this.scene.start('GameScene');
      });
    });
    
    this.input.keyboard.on('keydown-M', () => {
      this.cameras.main.fadeOut(300);
      this.time.delayedCall(300, () => {
        this.scene.start('TitleScene');
      });
    });
    
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(300);
      this.time.delayedCall(300, () => {
        window.gameState.score = 0;
        window.gameState.rings = 0;
        window.gameState.lives = 3;
        this.scene.start('GameScene');
      });
    });
    
    // Fade in
    this.cameras.main.fadeIn(500);
  }
}
