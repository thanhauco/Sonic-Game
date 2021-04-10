import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sonic');
    
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Physics setup
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setSize(32, 48);
    this.setOffset(16, 8);
    this.setScale(1.5);
    this.setDepth(10);
    
    // Player state
    this.state = {
      isRolling: false,
      isSpinDashing: false,
      spinDashCharge: 0,
      isJumping: false,
      isInvincible: false,
      hasShield: false,
      hasSpeedBoost: false,
      facingRight: true,
    };
    
    // Timers
    this.invincibilityTimer = null;
    this.speedBoostTimer = null;
    
    // Create animations
    this.createAnimations();
    
    // Input
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Dust particle emitter
    this.dustEmitter = scene.add.particles(0, 0, 'dust', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300,
      alpha: { start: 0.6, end: 0 },
      frequency: -1,
      quantity: 3,
    });
  }

  createAnimations() {
    const anims = this.scene.anims;
    
    // Check if animations already exist
    if (!anims.exists('sonic-idle')) {
      anims.create({
        key: 'sonic-idle',
        frames: [{ key: 'sonic', frame: 0 }],
        frameRate: 1,
      });
      
      anims.create({
        key: 'sonic-run',
        frames: anims.generateFrameNumbers('sonic', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: -1,
      });
      
      anims.create({
        key: 'sonic-jump',
        frames: anims.generateFrameNumbers('sonic', { start: 6, end: 11 }),
        frameRate: 15,
        repeat: -1,
      });
      
      anims.create({
        key: 'sonic-spin',
        frames: anims.generateFrameNumbers('sonic', { start: 12, end: 17 }),
        frameRate: 20,
        repeat: -1,
      });
      
      anims.create({
        key: 'sonic-hurt',
        frames: [{ key: 'sonic', frame: 18 }],
        frameRate: 1,
      });
      
      anims.create({
        key: 'sonic-spindash',
        frames: anims.generateFrameNumbers('sonic', { start: 12, end: 17 }),
        frameRate: 25,
        repeat: -1,
      });
    }
    
    this.play('sonic-idle');
  }

  update() {
    const config = GameConfig.PLAYER;
    const onGround = this.body.blocked.down || this.body.touching.down;
    
    // Speed boost multiplier
    const speedMult = this.state.hasSpeedBoost ? GameConfig.POWERUP.SPEED_MULTIPLIER : 1;
    
    // Handle spin dash
    if (this.state.isSpinDashing) {
      this.handleSpinDash(onGround);
      return;
    }
    
    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.handleHorizontalMovement(-1, onGround, config, speedMult);
    } else if (this.cursors.right.isDown) {
      this.handleHorizontalMovement(1, onGround, config, speedMult);
    } else {
      this.handleDeceleration(onGround, config);
    }
    
    // Jumping
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      // Check for spin dash initiation
      if (this.cursors.down.isDown && onGround) {
        this.startSpinDash();
      } else if (onGround) {
        this.jump(config);
      }
    }
    
    // Variable jump height
    if (!onGround && !this.spaceKey.isDown && this.body.velocity.y < config.VARIABLE_JUMP_FORCE) {
      this.body.velocity.y = config.VARIABLE_JUMP_FORCE;
    }
    
    // Rolling
    if (this.cursors.down.isDown && onGround && Math.abs(this.body.velocity.x) > 100) {
      this.state.isRolling = true;
      this.setSize(32, 32);
      this.setOffset(16, 24);
    } else if (onGround && !this.cursors.down.isDown) {
      this.state.isRolling = false;
      this.setSize(32, 48);
      this.setOffset(16, 8);
    }
    
    // Update animation and state
    this.updateAnimation(onGround);
    
    // Dust particles when running fast
    if (onGround && Math.abs(this.body.velocity.x) > 300) {
      this.dustEmitter.setPosition(this.x, this.y + 30);
      this.dustEmitter.explode(1);
    }
    
    // Landing state
    if (onGround && this.state.isJumping) {
      this.state.isJumping = false;
    }
    
    // Invincibility flicker
    if (this.state.isInvincible) {
      this.setAlpha(Math.sin(this.scene.time.now / 50) > 0 ? 1 : 0.3);
    } else {
      this.setAlpha(1);
    }
  }

  handleHorizontalMovement(direction, onGround, config, speedMult) {
    const acceleration = onGround ? config.ACCELERATION : config.AIR_ACCELERATION;
    const maxSpeed = config.MAX_SPEED * speedMult;
    
    // Set facing direction
    this.state.facingRight = direction > 0;
    this.setFlipX(direction < 0);
    
    // Apply acceleration
    this.body.velocity.x += acceleration * direction * (this.scene.game.loop.delta / 1000);
    
    // Clamp velocity
    this.body.velocity.x = Phaser.Math.Clamp(this.body.velocity.x, -maxSpeed, maxSpeed);
  }

  handleDeceleration(onGround, config) {
    if (onGround) {
      const decel = this.state.isRolling ? config.ROLL_DECELERATION : config.DECELERATION;
      
      if (this.body.velocity.x > 0) {
        this.body.velocity.x = Math.max(0, this.body.velocity.x - decel * (this.scene.game.loop.delta / 1000));
      } else if (this.body.velocity.x < 0) {
        this.body.velocity.x = Math.min(0, this.body.velocity.x + decel * (this.scene.game.loop.delta / 1000));
      }
    }
  }

  jump(config) {
    this.body.velocity.y = config.JUMP_FORCE;
    this.state.isJumping = true;
    
    // Emit spark particles
    const sparkEmitter = this.scene.add.particles(this.x, this.y + 20, 'spark', {
      speed: { min: 50, max: 100 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.5, end: 0 },
      lifespan: 200,
      quantity: 5,
    });
    
    this.scene.time.delayedCall(200, () => sparkEmitter.destroy());
  }

  startSpinDash() {
    this.state.isSpinDashing = true;
    this.state.spinDashCharge = 0;
    this.play('sonic-spindash');
    
    // Play charging sound effect (visual feedback)
    this.setTint(0x6666FF);
  }

  handleSpinDash(onGround) {
    const config = GameConfig.PLAYER;
    
    if (this.cursors.down.isDown && onGround) {
      // Charging
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.state.spinDashCharge = this.state.spinDashCharge + 1;
        
        // Visual feedback for charge
        const chargePercent = this.state.spinDashCharge / config.SPIN_DASH_MAX_CHARGE;
        this.setScale(1.5 + chargePercent * 0.2);
        
        // Charge particles
        const chargeEmitter = this.scene.add.particles(this.x, this.y, 'spark', {
          speed: 100,
          scale: { start: 0.3, end: 0 },
          lifespan: 150,
          quantity: 3,
          angle: { min: 0, max: 360 },
        });
        
        this.scene.time.delayedCall(150, () => chargeEmitter.destroy());
      }
      
      this.body.velocity.x = 0;
    } else {
      // Release spin dash
      const releaseSpeed = config.SPIN_DASH_SPEED_PER_CHARGE * this.state.spinDashCharge;
      this.body.velocity.x = this.state.facingRight ? releaseSpeed : -releaseSpeed;
      
      this.state.isSpinDashing = false;
      this.state.isRolling = true;
      this.setScale(1.5);
      this.clearTint();
      
      // Release particles
      const releaseEmitter = this.scene.add.particles(this.x, this.y, 'spark', {
        speed: { min: 100, max: 200 },
        scale: { start: 0.6, end: 0 },
        lifespan: 300,
        quantity: 10,
        angle: { min: this.state.facingRight ? 150 : 30, max: this.state.facingRight ? 210 : -30 },
      });
      
      this.scene.time.delayedCall(300, () => releaseEmitter.destroy());
    }
  }

  updateAnimation(onGround) {
    const speed = Math.abs(this.body.velocity.x);
    
    if (this.state.isSpinDashing) {
      // Already playing spindash animation
      return;
    }
    
    if (!onGround || this.state.isJumping) {
      if (this.state.isRolling || this.state.isJumping) {
        this.play('sonic-spin', true);
      } else {
        this.play('sonic-jump', true);
      }
    } else if (this.state.isRolling) {
      this.play('sonic-spin', true);
    } else if (speed > 10) {
      this.play('sonic-run', true);
      // Adjust frame rate based on speed
      this.anims.msPerFrame = Math.max(30, 100 - speed / 10);
    } else {
      this.play('sonic-idle', true);
    }
  }

  takeDamage() {
    if (this.state.isInvincible) return false;
    
    const rings = window.gameState.rings;
    
    if (this.state.hasShield) {
      // Shield absorbs hit
      this.state.hasShield = false;
      this.setInvincible();
      return false;
    }
    
    if (rings > 0) {
      // Scatter rings
      this.scatterRings(rings);
      window.gameState.rings = 0;
      this.setInvincible();
      
      // Knockback
      this.body.velocity.y = -300;
      this.body.velocity.x = this.state.facingRight ? -200 : 200;
      
      this.play('sonic-hurt');
      return false;
    }
    
    // No rings - lose a life
    return true;
  }

  scatterRings(count) {
    const scatterCount = Math.min(count, GameConfig.RING.SCATTER_COUNT);
    
    for (let i = 0; i < scatterCount; i++) {
      const angle = (i / scatterCount) * Math.PI * 2;
      const ring = this.scene.rings.create(this.x, this.y, 'ring');
      ring.setVelocity(
        Math.cos(angle) * GameConfig.RING.SCATTER_SPEED,
        Math.sin(angle) * GameConfig.RING.SCATTER_SPEED - 200
      );
      ring.setBounce(0.6);
      ring.setScale(0.8);
      ring.isScattered = true;
      
      // Scattered rings disappear after a while
      this.scene.time.delayedCall(3000 + Math.random() * 2000, () => {
        if (ring.active) {
          ring.destroy();
        }
      });
    }
  }

  setInvincible(duration = GameConfig.PLAYER.INVINCIBILITY_DURATION) {
    this.state.isInvincible = true;
    
    if (this.invincibilityTimer) {
      this.invincibilityTimer.destroy();
    }
    
    this.invincibilityTimer = this.scene.time.delayedCall(duration, () => {
      this.state.isInvincible = false;
    });
  }

  activateSpeedBoost() {
    this.state.hasSpeedBoost = true;
    this.setTint(0xFF6600);
    
    if (this.speedBoostTimer) {
      this.speedBoostTimer.destroy();
    }
    
    this.speedBoostTimer = this.scene.time.delayedCall(GameConfig.POWERUP.SPEED_DURATION, () => {
      this.state.hasSpeedBoost = false;
      this.clearTint();
    });
  }

  activateShield() {
    this.state.hasShield = true;
    
    // Create shield visual
    if (this.shieldGraphics) {
      this.shieldGraphics.destroy();
    }
    
    this.shieldGraphics = this.scene.add.graphics();
    this.updateShield();
  }

  updateShield() {
    if (!this.state.hasShield || !this.shieldGraphics) return;
    
    this.shieldGraphics.clear();
    this.shieldGraphics.lineStyle(3, 0x00BFFF, 0.8);
    this.shieldGraphics.strokeCircle(this.x, this.y, 35 + Math.sin(this.scene.time.now / 100) * 5);
  }

  activateInvincibility() {
    this.setInvincible(GameConfig.POWERUP.INVINCIBILITY_DURATION);
    
    // Star particles around player
    this.starEmitter = this.scene.add.particles(0, 0, 'spark', {
      speed: 50,
      scale: { start: 0.5, end: 0.1 },
      lifespan: 500,
      frequency: 50,
      quantity: 2,
      tint: [0xFFD700, 0xFF6600, 0xFF0000],
    });
    
    this.starEmitter.startFollow(this);
    
    this.scene.time.delayedCall(GameConfig.POWERUP.INVINCIBILITY_DURATION, () => {
      if (this.starEmitter) {
        this.starEmitter.destroy();
        this.starEmitter = null;
      }
    });
  }

  destroy() {
    if (this.dustEmitter) this.dustEmitter.destroy();
    if (this.shieldGraphics) this.shieldGraphics.destroy();
    if (this.starEmitter) this.starEmitter.destroy();
    super.destroy();
  }
}
