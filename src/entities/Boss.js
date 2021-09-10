import Phaser from 'phaser';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss');
    
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.body.setAllowGravity(false);
    this.setImmovable(true);
    this.setScale(1.5);
    
    this.health = 8;
    this.isHurt = false;
    this.isDead = false;
    
    // Movement pattern
    this.startY = y;
    this.phase = 0;
  }

  update(time, delta, player) {
    if (this.isDead) return;
    
    // Hover movement
    this.y = this.startY + Math.sin(time / 500) * 50;
    
    // Horizontal movement following player within bounds
    const dx = player.x - this.x;
    if (Math.abs(dx) > 100) {
        this.setVelocityX(dx > 0 ? 150 : -150);
    } else {
        this.setVelocityX(0);
    }
    
    // Hurt flicker
    if (this.isHurt) {
        this.setAlpha(Math.sin(time / 50) > 0 ? 1 : 0.3);
    } else {
        this.setAlpha(1);
    }
  }

  takeDamage() {
    if (this.isHurt || this.isDead) return;
    
    this.health--;
    this.isHurt = true;
    this.setTint(0xFF0000);
    
    // Play hit sound
    if (this.scene.audio) this.scene.audio.playHit();
    
    if (this.health <= 0) {
        this.die();
    } else {
        this.scene.time.delayedCall(1000, () => {
            this.isHurt = false;
            this.clearTint();
        });
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    
    // Multiple explosions
    for (let i = 0; i < 10; i++) {
        this.scene.time.delayedCall(i * 200, () => {
            if (this.scene.audio) this.scene.audio.playExplosion();
            const ex = this.scene.add.particles(this.x + Phaser.Math.Between(-50, 50), this.y + Phaser.Math.Between(-50, 50), 'spark', {
                speed: { min: 50, max: 150 },
                scale: { start: 1, end: 0 },
                lifespan: 500,
                quantity: 10,
                tint: [0xFF6600, 0xFFD700]
            });
            this.scene.time.delayedCall(500, () => ex.destroy());
        });
    }
    
    this.scene.time.delayedCall(2500, () => {
        this.scene.reachGoal();
        this.destroy();
    });
  }
}
