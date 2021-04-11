import Phaser from 'phaser';

export default class Monitor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'speed') {
    super(scene, x, y, 'monitors');
    
    this.scene = scene;
    this.powerUpType = type;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Physics setup
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);
    this.setSize(28, 28);
    this.setScale(1.2);
    
    // Set correct frame based on type
    const frameMap = {
      'speed': 0,
      'shield': 1,
      'invincibility': 2,
      'life': 3,
    };
    
    this.setFrame(frameMap[type] || 0);
    this.isDestroyed = false;
  }

  hit(player) {
    
    this.isDestroyed = true;
    
    // Apply power-up effect based on type
    switch (this.powerUpType) {
      case 'speed':
        player.activateSpeedBoost();
        break;
      case 'shield':
        player.activateShield();
        break;
      case 'invincibility':
        player.activateInvincibility();
        break;
      case 'life':
        window.gameState.lives++;
        break;
    }
    
    // Destruction effect
    const debris = this.scene.add.particles(this.x, this.y, 'spark', {
      speed: { min: 80, max: 150 },
      scale: { start: 0.6, end: 0 },
      lifespan: 300,
      quantity: 8,
      angle: { min: 0, max: 360 },
      tint: [0x444444, 0x666666, 0x888888],
    });
    
    this.scene.time.delayedCall(300, () => debris.destroy());
    
    // Floating icon
    const iconColors = {
      'speed': 0xFF6600,
      'shield': 0x00BFFF,
      'invincibility': 0xFFD700,
      'life': 0xFF69B4,
    };
    
    const icon = this.scene.add.circle(this.x, this.y, 10, iconColors[this.powerUpType]);
    
    this.scene.tweens.add({
      targets: icon,
      y: this.y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => icon.destroy(),
    });
    
    this.destroy();
  }
}
