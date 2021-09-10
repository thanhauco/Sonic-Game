import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig.js';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Ring from '../entities/Ring.js';
import Monitor from '../entities/Monitor.js';
import Boss from '../entities/Boss.js';
import InteractiveObject from '../entities/InteractiveObject.js';
import HUD from '../ui/HUD.js';
import AudioManager from '../utils/AudioManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Audio manager
    this.audio = new AudioManager(this);
    
    // Set world bounds
    this.worldWidth = 4000;
    this.physics.world.setBounds(0, 0, this.worldWidth, height);
    
    // Create parallax backgrounds
    this.createBackgrounds(width, height);
    
    // Create level
    this.createLevel();
    
    // Create player
    this.player = new Player(this, 100, height - 150);
    
    // Create groups for game objects
    this.rings = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.monitors = this.physics.add.group();
    this.interactiveObjects = this.physics.add.group();
    
    // Combo system
    this.enemyCombo = 0;
    
    // Populate level
    this.spawnRings();
    this.spawnEnemies();
    this.spawnMonitors();
    this.spawnInteractiveObjects();
    this.spawnBoss();
    
    // Setup collisions
    this.setupCollisions();
    
    // Camera follow player
    this.cameras.main.setBounds(0, 0, this.worldWidth, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Create HUD
    this.hud = new HUD(this);
    
    // Input for pause
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    
    // Game state
    this.isPaused = false;
    
    // Fade in
    this.cameras.main.fadeIn(500);
  }

  createBackgrounds(width, height) {
    // Sky (static)
    this.add.image(width / 2, height / 2, 'sky')
      .setScrollFactor(0)
      .setScale(1.2)
      .setDepth(-3);
    
    // Distant mountains (slow parallax)
    this.mountains = this.add.tileSprite(0, height - 200, this.worldWidth * 1.5, 400, 'mountains')
      .setOrigin(0, 0.5)
      .setScrollFactor(0.2)
      .setScale(1)
      .setDepth(-2);
    
    // Trees (medium parallax)
    this.trees = this.add.tileSprite(0, height - 100, this.worldWidth * 1.5, 300, 'trees')
      .setOrigin(0, 0.5)
      .setScrollFactor(0.5)
      .setScale(0.8)
      .setDepth(-1);
  }

  createLevel() {
    const height = this.cameras.main.height;
    
    // Create ground platform graphics
    this.platforms = this.physics.add.staticGroup();
    
    // Main ground - a series of platforms
    this.createGroundSection(0, height - 40, 800);
    this.createGroundSection(900, height - 40, 600);
    this.createGroundSection(1600, height - 40, 500);
    this.createGroundSection(2200, height - 40, 800);
    this.createGroundSection(3100, height - 40, 900);
    
    // Elevated platforms
    this.createPlatform(400, height - 140, 200);
    this.createPlatform(700, height - 220, 150);
    this.createPlatform(1000, height - 180, 180);
    this.createPlatform(1400, height - 280, 120);
    this.createPlatform(1700, height - 150, 200);
    this.createPlatform(2000, height - 240, 150);
    this.createPlatform(2400, height - 180, 220);
    this.createPlatform(2800, height - 280, 150);
    this.createPlatform(3200, height - 160, 180);
    this.createPlatform(3500, height - 250, 200);
    
    // Floating platforms (with gaps)
    this.createPlatform(1100, height - 350, 100);
    this.createPlatform(1300, height - 400, 100);
    this.createPlatform(2600, height - 380, 120);
    this.createPlatform(3000, height - 420, 100);
    
    // Goal post
    this.createGoalPost(3850, height - 40);
  }

  createGroundSection(x, y, width) {
    const graphics = this.add.graphics();
    
    // Checkered brown pattern
    const checkSize = 20;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < width / checkSize; col++) {
        graphics.fillStyle((row + col) % 2 === 0 ? 0x8B4513 : 0xA0522D);
        graphics.fillRect(x + col * checkSize, y + row * checkSize, checkSize, checkSize);
      }
    }
    
    // Green grass top
    graphics.fillStyle(0x228B22);
    graphics.fillRect(x, y - 10, width, 12);
    
    // Grass blades
    graphics.fillStyle(0x32CD32);
    for (let i = 0; i < width / 10; i++) {
      graphics.fillTriangle(
        x + i * 10 + 5, y - 10,
        x + i * 10 + 2, y - 20 - Math.random() * 5,
        x + i * 10 + 8, y - 20 - Math.random() * 5
      );
    }
    
    // Create physics body
    const platform = this.add.zone(x + width / 2, y + 10, width, 40);
    this.physics.add.existing(platform, true);
    this.platforms.add(platform);
  }

  createPlatform(x, y, width) {
    const graphics = this.add.graphics();
    
    // Platform gradient
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x4a9c2d, 0x4a9c2d, 0x2d5a1a, 0x2d5a1a, 1);
    gradient.fillRect(x, y, width, 30);
    
    // Top edge
    gradient.fillStyle(0x5bb535);
    gradient.fillRect(x, y, width, 6);
    
    // Texture lines
    gradient.lineStyle(1, 0x000000, 0.2);
    for (let i = 0; i < 3; i++) {
      gradient.lineBetween(x, y + 10 + i * 8, x + width, y + 10 + i * 8);
    }
    
    // Create physics body
    const platform = this.add.zone(x + width / 2, y + 15, width, 30);
    this.physics.add.existing(platform, true);
    this.platforms.add(platform);
  }

  createGoalPost(x, y) {
    // Goal post graphics
    const post = this.add.graphics();
    
    // Pole
    post.fillStyle(0xFFD700);
    post.fillRect(x, y - 120, 8, 120);
    
    // Base
    post.fillStyle(0x8B4513);
    post.fillRect(x - 10, y - 10, 28, 20);
    
    // Spinning sign
    this.goalSign = this.add.graphics();
    this.goalSign.fillStyle(0xFF4444);
    this.goalSign.fillEllipse(x + 4, y - 100, 40, 50);
    
    // Star on sign
    this.goalSign.fillStyle(0xFFD700);
    this.drawStar(this.goalSign, x + 4, y - 100, 15);
    
    // Goal trigger zone
    this.goalZone = this.add.zone(x, y - 60, 50, 120);
    this.physics.add.existing(this.goalZone, true);
    
    // Goal collision
    this.physics.add.overlap(this.player, this.goalZone, () => this.reachGoal());
  }

  drawStar(graphics, cx, cy, size) {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      points.push(cx + Math.cos(angle) * size);
      points.push(cy + Math.sin(angle) * size);
    }
    graphics.fillPoints(points, true);
  }

  spawnRings() {
    const height = this.cameras.main.height;
    
    // Ring arcs and patterns
    const ringPatterns = [
      // Arc near start
      ...this.createRingArc(200, height - 100, 5, 30),
      ...this.createRingArc(600, height - 150, 6, 35),
      
      // Line on platform
      ...this.createRingLine(400, height - 165, 5),
      ...this.createRingLine(1000, height - 205, 4),
      
      // Vertical climb
      ...this.createRingVertical(750, height - 250, 4),
      ...this.createRingVertical(1350, height - 330, 3),
      
      // Arcs over gaps
      ...this.createRingArc(850, height - 120, 4, 25),
      ...this.createRingArc(1550, height - 100, 5, 30),
      
      // More patterns
      ...this.createRingLine(1700, height - 175, 5),
      ...this.createRingArc(2100, height - 150, 6, 30),
      ...this.createRingLine(2400, height - 205, 5),
      ...this.createRingArc(2700, height - 120, 4, 25),
      ...this.createRingVertical(2900, height - 320, 3),
      ...this.createRingLine(3200, height - 185, 4),
      ...this.createRingArc(3400, height - 150, 5, 30),
      ...this.createRingLine(3500, height - 275, 4),
    ];
    
    ringPatterns.forEach(pos => {
      const ring = new Ring(this, pos.x, pos.y);
      this.rings.add(ring);
    });
  }

  createRingArc(startX, startY, count, spacing) {
    const rings = [];
    for (let i = 0; i < count; i++) {
      rings.push({
        x: startX + i * spacing,
        y: startY - Math.sin((i / (count - 1)) * Math.PI) * 40,
      });
    }
    return rings;
  }

  createRingLine(startX, y, count) {
    const rings = [];
    for (let i = 0; i < count; i++) {
      rings.push({ x: startX + i * 30, y });
    }
    return rings;
  }

  createRingVertical(x, startY, count) {
    const rings = [];
    for (let i = 0; i < count; i++) {
      rings.push({ x, y: startY + i * 35 });
    }
    return rings;
  }

  spawnEnemies() {
    const height = this.cameras.main.height;
    
    // Crabmeat enemies on ground
    const crabmeatPositions = [
      { x: 500, y: height - 60 },
      { x: 1200, y: height - 200 },
      { x: 1800, y: height - 60 },
      { x: 2500, y: height - 200 },
      { x: 2900, y: height - 60 },
      { x: 3300, y: height - 60 },
    ];
    
    crabmeatPositions.forEach(pos => {
      const enemy = new Enemy(this, pos.x, pos.y, 'enemies', 0, 'crabmeat');
      this.enemies.add(enemy);
    });
    
    // Buzzbomber enemies in air
    const buzzbomberPositions = [
      { x: 800, y: height - 250 },
      { x: 1500, y: height - 300 },
      { x: 2200, y: height - 280 },
      { x: 3000, y: height - 320 },
    ];
    
    buzzbomberPositions.forEach(pos => {
      const enemy = new Enemy(this, pos.x, pos.y, 'enemies', 4, 'buzzbomber');
      this.enemies.add(enemy);
    });
  }

  spawnMonitors() {
    const height = this.cameras.main.height;
    
    const monitorPositions = [
      { x: 350, y: height - 70, type: 'speed' },
      { x: 1100, y: height - 380, type: 'shield' },
      { x: 1900, y: height - 70, type: 'invincibility' },
      { x: 2600, y: height - 410, type: 'life' },
      { x: 3400, y: height - 70, type: 'speed' },
    ];
    
    monitorPositions.forEach(pos => {
      const monitor = new Monitor(this, pos.x, pos.y, pos.type);
      this.monitors.add(monitor);
    });
  }

  setupCollisions() {
    // Player vs platforms
    this.physics.add.collider(this.player, this.platforms);
    
    // Player vs rings
    this.physics.add.overlap(this.player, this.rings, (player, ring) => {
      ring.collect();
    });
    
    // Player vs enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.handleEnemyCollision(player, enemy);
    });
    
    // Player vs monitors
    this.physics.add.overlap(this.player, this.monitors, (player, monitor) => {
      // Only break if jumping/rolling on top
      if (player.body.velocity.y > 0 || player.state.isRolling || player.state.isJumping) {
        monitor.hit(player);
      }
    });
    
    // Enemies vs platforms
    this.physics.add.collider(this.enemies, this.platforms);
    
    this.physics.add.collider(this.rings, this.platforms);
    
    // Player vs Interactive Objects
    this.physics.add.overlap(this.player, this.interactiveObjects, (player, obj) => {
        obj.onOverlap(player);
    });
    
    // Player vs Boss
    this.physics.add.overlap(this.player, this.boss, (player, boss) => {
        this.handleBossCollision(player, boss);
    });
  }

  handleBossCollision(player, boss) {
    if (boss.isDead) return;
    
    const isAttacking = 
      (player.body.velocity.y > 0 && player.y < boss.y - 20) ||
      player.state.isRolling ||
      player.state.isJumping ||
      player.state.isInvincible;
    
    if (isAttacking) {
      boss.takeDamage();
      player.body.velocity.y = -400;
      this.cameras.main.shake(200, 0.01);
    } else {
      const died = player.takeDamage();
      if (died) this.playerDeath();
    }
  }

  spawnInteractiveObjects() {
    const height = this.cameras.main.height;
    const positions = [
        { x: 850, y: height - 60, type: 'spring' },
        { x: 1500, y: height - 120, type: 'spikes' },
        { x: 2100, y: height - 60, type: 'spring' },
        { x: 2800, y: height - 60, type: 'spikes' },
        { x: 3300, y: height - 180, type: 'spring' }
    ];
    
    positions.forEach(pos => {
        const obj = new InteractiveObject(this, pos.x, pos.y, pos.type);
        this.interactiveObjects.add(obj);
    });
  }

  spawnBoss() {
    this.boss = new Boss(this, 3700, this.cameras.main.height - 300);
  }

  handleEnemyCollision(player, enemy) {
    // Check if player is attacking (jumping on top, rolling, or spinning)
    const isAttacking = 
      (player.body.velocity.y > 0 && player.y < enemy.y - 20) ||
      player.state.isRolling ||
      player.state.isJumping ||
      player.state.isInvincible;
    
    if (isAttacking) {
      // Defeat enemy
      enemy.defeat();
      
      // Combo scoring
      this.enemyCombo++;
      const comboBonus = this.enemyCombo * 100;
      window.gameState.score += comboBonus;
      
      // Visual feedback for combo
      if (this.enemyCombo > 1) {
          const comboText = this.add.text(enemy.x, enemy.y - 40, `${comboBonus} COMBO!`, {
              fontFamily: 'Arial Black',
              fontSize: '20px',
              color: '#FFD700'
          }).setOrigin(0.5);
          this.tweens.add({
              targets: comboText,
              y: enemy.y - 80,
              alpha: 0,
              duration: 800,
              onComplete: () => comboText.destroy()
          });
      }
      
      // Bounce player up
      player.body.velocity.y = -300;
      
      // Screen shake
      this.cameras.main.shake(100, 0.005);
    } else {
      // Player takes damage
      const died = player.takeDamage();
      
      if (died) {
        this.audio.playHit();
        this.playerDeath();
      }
    }
  }

  handleEnemyDefeat(enemy) {
      enemy.defeat();
      this.audio.playExplosion();
  }

  playerDeath() {
    window.gameState.lives--;
    
    // Death animation
    this.player.setTint(0xFF0000);
    this.player.body.velocity.y = -400;
    this.player.body.setAllowGravity(true);
    
    // Disable controls temporarily
    this.player.disableBody();
    
    this.time.delayedCall(1500, () => {
      if (window.gameState.lives <= 0) {
        // Game over
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
          this.hud.destroy();
          this.scene.start('GameOverScene');
        });
      } else {
        // Respawn
        this.respawnPlayer();
      }
    });
  }

  respawnPlayer() {
    this.player.setPosition(100, this.cameras.main.height - 150);
    this.player.clearTint();
    this.player.enableBody(true, 100, this.cameras.main.height - 150, true, true);
    this.player.setInvincible();
  }

  reachGoal() {
    if (this.goalReached) return;
    this.goalReached = true;
    
    // Victory!
    const victoryText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'GOAL!', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '72px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
    
    this.tweens.add({
      targets: victoryText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    
    // Bonus score
    window.gameState.score += 10000;
    
    // Transition after delay
    this.time.delayedCall(3000, () => {
      this.cameras.main.fadeOut(500);
      this.time.delayedCall(500, () => {
        this.hud.destroy();
        this.scene.start('GameOverScene');
      });
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.physics.pause();
      
      // Pause overlay
      this.pauseOverlay = this.add.graphics();
      this.pauseOverlay.fillStyle(0x000000, 0.7);
      this.pauseOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
      this.pauseOverlay.setScrollFactor(0);
      this.pauseOverlay.setDepth(150);
      
      this.pauseText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'PAUSED', {
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: '48px',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(151);
      
      this.pauseHint = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Press P or ESC to resume', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#AAAAAA',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(151);
    } else {
      this.physics.resume();
      if (this.pauseOverlay) this.pauseOverlay.destroy();
      if (this.pauseText) this.pauseText.destroy();
      if (this.pauseHint) this.pauseHint.destroy();
    }
  }

  update(time, delta) {
    if (this.isPaused) return;
    
    // Update player
    this.player.update();
    this.player.updateShield();
    
    // Reset combo when landing
    if (this.player.body.blocked.down || this.player.body.touching.down) {
        this.enemyCombo = 0;
    }
    
    // Update boss
    if (this.boss) {
        this.boss.update(time, delta, this.player);
    }
    
    // Update enemies
    this.enemies.children.iterate((enemy) => {
      if (enemy.active) {
        enemy.update(time, delta, this.player);
      }
    });
    
    // Update rings
    this.rings.children.iterate((ring) => {
      if (ring.active) {
        ring.update(time, delta, this.player);
      }
    });
    
    // Update HUD
    this.hud.update(time, delta);
    
    // Parallax background scroll
    if (this.mountains) {
      this.mountains.tilePositionX = this.cameras.main.scrollX * 0.1;
    }
    if (this.trees) {
      this.trees.tilePositionX = this.cameras.main.scrollX * 0.3;
    }
    
    // Goal post spin animation
    if (this.goalSign && !this.goalReached) {
      this.goalSign.rotation += 0.02;
    }
    
    // Fall death
    if (this.player.y > this.cameras.main.height + 100) {
      const died = this.player.takeDamage();
      if (died) {
        this.playerDeath();
      } else {
        this.respawnPlayer();
      }
    }
  }
}
