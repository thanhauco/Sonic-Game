import Phaser from 'phaser';
import { GameConfig } from './config/GameConfig.js';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// Hide loading overlay when Phaser is ready
const hideLoadingOverlay = () => {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 500);
  }
};

// Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: GameConfig.GAME_WIDTH,
  height: GameConfig.GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#87CEEB',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GameConfig.GRAVITY },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene],
  callbacks: {
    postBoot: hideLoadingOverlay,
  },
};

// Create the game instance
const game = new Phaser.Game(config);

// Global game state
window.gameState = {
  score: 0,
  rings: 0,
  lives: GameConfig.START_LIVES,
  highScore: parseInt(localStorage.getItem('sonicRushHighScore')) || 0,
};

export default game;
