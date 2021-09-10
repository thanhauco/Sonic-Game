import Phaser from 'phaser';

export default class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'spring') {
    super(scene, x, y, 'interactive');
    
    this.scene = scene;
    this.type = type;
    
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
    
    if (type === 'spring') {
        this.setFrame(0);
        this.setSize(60, 40);
        this.setOffset(2, 24);
    } else {
        this.setFrame(1);
        this.setSize(64, 32);
        this.setOffset(0, 32);
    }
    
    this.setScale(1);
  }

  onOverlap(player) {
    if (this.type === 'spring') {
        // Bounce player up high
        player.body.velocity.y = -800;
        player.state.isJumping = true;
        player.play('sonic-jump');
        
        // Play sound
        if (this.scene.audio) this.scene.audio.playSpring();
        
        // Spring animation effect
        this.scene.tweens.add({
            targets: this,
            scaleY: 0.5,
            duration: 50,
            yoyo: true,
            onComplete: () => this.setScale(1)
        });
        
        // Particles
        const ex = this.scene.add.particles(this.x, this.y, 'spark', {
            speed: 100,
            scale: { start: 0.5, end: 0 },
            lifespan: 200,
            quantity: 5
        });
        this.scene.time.delayedCall(200, () => ex.destroy());
        
    } else if (this.type === 'spikes') {
        // Damage player
        const died = player.takeDamage();
        if (died) {
            this.scene.playerDeath();
        } else {
            // Knockback
            player.body.velocity.y = -300;
            player.body.velocity.x = player.x < this.x ? -200 : 200;
        }
    }
  }
}
