import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export default class Ring extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ring');
    
    this.scene = scene;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Physics setup
    this.body.setAllowGravity(false);
    this.setSize(24, 24);
    this.setScale(1);
    this.isScattered = false;
    
    // Animation
    this.createAnimation();
    
    // Float animation
    this.floatOffset = Math.random() * Math.PI * 2;
    this.originalY = y;
  }

  createAnimation() {
    if (!this.scene.anims.exists('ring-spin')) {
      this.scene.anims.create({
        key: 'ring-spin',
        frames: this.scene.anims.generateFrameNumbers('ring', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    
    this.play('ring-spin');
  }

  update(time, delta, player) {
    // Float animation
    if (!this.isScattered) {
      this.y = this.originalY + Math.sin(time / 300 + this.floatOffset) * 3;
    }
    
    // Magnetic attraction when player is close
    if (player && !this.isScattered) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < GameConfig.RING.MAGNETIC_RANGE) {
        const speed = GameConfig.RING.MAGNETIC_SPEED;
        this.setVelocity((dx / dist) * speed, (dy / dist) * speed);
        this.body.setAllowGravity(false);
      }
    }
  }

  collect() {
    // Add ring and score
    window.gameState.rings++;
    window.gameState.score += GameConfig.SCORE.RING;
    
    
    // Check for extra life
    if (window.gameState.rings >= GameConfig.RINGS_FOR_LIFE) {
      window.gameState.rings -= GameConfig.RINGS_FOR_LIFE;
      window.gameState.lives++;
    }
    
    // Collection effect
    const sparkle = this.scene.add.particles(this.x, this.y, 'spark', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      lifespan: 200,
      quantity: 5,
      angle: { min: 0, max: 360 },
      tint: 0xFFD700,
    });
    
    this.scene.time.delayedCall(200, () => sparkle.destroy());
    
    this.destroy();
  }
}
