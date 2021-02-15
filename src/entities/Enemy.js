import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, type = 'crabmeat') {
    super(scene, x, y, texture, frame);
    
    this.scene = scene;
    this.type = type;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Physics setup
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setScale(1);
    
    // Patrol state
    this.patrolDirection = 1;
    this.patrolTimer = 0;
    this.patrolDuration = 2000 + Math.random() * 1000;
    
    // Type-specific setup
    if (this.type === 'buzzbomber') {
      this.body.setAllowGravity(false);
      this.setSize(50, 40);
      this.swoopTarget = null;
      this.isSwooping = false;
    } else {
      this.setSize(50, 40);
      this.setOffset(7, 12);
    }
    
    // Create animation
    this.createAnimation();
  }

  createAnimation() {
    const key = `${this.type}-walk`;
    
    if (!this.scene.anims.exists(key)) {
      if (this.type === 'crabmeat') {
        this.scene.anims.create({
          key: key,
          frames: this.scene.anims.generateFrameNumbers('enemies', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1,
        });
      } else if (this.type === 'buzzbomber') {
        this.scene.anims.create({
          key: key,
          frames: this.scene.anims.generateFrameNumbers('enemies', { start: 4, end: 7 }),
          frameRate: 12,
          repeat: -1,
        });
      }
    }
    
    this.play(key);
  }

  update(time, delta, player) {
    if (this.type === 'crabmeat') {
      this.updateCrabmeat(delta);
    } else if (this.type === 'buzzbomber') {
      this.updateBuzzbomber(delta, player);
    }
  }

  updateCrabmeat(delta) {
    const speed = GameConfig.ENEMY.PATROL_SPEED;
    
    // Patrol behavior
    this.patrolTimer += delta;
    
    if (this.patrolTimer >= this.patrolDuration) {
      this.patrolTimer = 0;
      this.patrolDirection *= -1;
    }
    
    // Check for edges or walls
    if (this.body.blocked.left || this.body.blocked.right) {
      this.patrolDirection *= -1;
      this.patrolTimer = 0;
    }
    
    this.setVelocityX(speed * this.patrolDirection);
    this.setFlipX(this.patrolDirection < 0);
  }

  updateBuzzbomber(delta, player) {
    if (!player) return;
    
    const speed = GameConfig.ENEMY.BUZZBOMBER_SPEED;
    const swoopSpeed = GameConfig.ENEMY.SWOOP_SPEED;
    
    // Hover and patrol
    if (!this.isSwooping) {
      this.patrolTimer += delta;
      
      if (this.patrolTimer >= this.patrolDuration) {
        this.patrolTimer = 0;
        this.patrolDirection *= -1;
      }
      
      // Horizontal patrol
      this.setVelocityX(speed * this.patrolDirection);
      this.setFlipX(this.patrolDirection < 0);
      
      // Hover effect
      this.setVelocityY(Math.sin(Date.now() / 300) * 30);
      
      // Check if player is in range for swoop
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 200 && dy > 0 && Math.abs(dx) < 100) {
        this.isSwooping = true;
        this.swoopTarget = { x: player.x, y: player.y };
      }
    } else {
      // Swoop attack
      const dx = this.swoopTarget.x - this.x;
      const dy = this.swoopTarget.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 10) {
        this.setVelocityX((dx / dist) * swoopSpeed);
        this.setVelocityY((dy / dist) * swoopSpeed);
      } else {
        // End swoop, fly back up
        this.isSwooping = false;
        this.setVelocityY(-100);
        this.swoopTarget = null;
      }
    }
  }

  defeat() {
    // Explosion effect
    const explosion = this.scene.add.particles(this.x, this.y, 'spark', {
      speed: { min: 100, max: 200 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 15,
      angle: { min: 0, max: 360 },
      tint: [0xFF6600, 0xFFD700, 0xFF4444],
    });
    
    this.scene.time.delayedCall(400, () => explosion.destroy());
    
    // Add score
    window.gameState.score += GameConfig.SCORE.ENEMY;
    
    // Spawn animal friend (visual only)
    const animal = this.scene.add.circle(this.x, this.y, 8, 0x87CEEB);
    this.scene.physics.add.existing(animal);
    animal.body.setVelocity(Phaser.Math.Between(-100, 100), -200);
    animal.body.setBounce(0.5);
    
    this.scene.time.delayedCall(2000, () => animal.destroy());
    
    this.destroy();
  }
}
