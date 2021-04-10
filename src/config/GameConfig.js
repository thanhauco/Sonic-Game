// Game configuration constants
export const GameConfig = {
  // Display
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  
  // Physics - Sonic-style movement
  GRAVITY: 300,
  
  // Player movement
  PLAYER: {
    MAX_SPEED: 600,
    ACCELERATION: 800,
    DECELERATION: 1200,
    AIR_ACCELERATION: 400,
    JUMP_FORCE: -520,
    VARIABLE_JUMP_FORCE: -180,
    ROLL_DECELERATION: 100,
    SPIN_DASH_MAX_CHARGE: 8,
    SPIN_DASH_SPEED_PER_CHARGE: 100,
    INVINCIBILITY_DURATION: 2000,
  },
  
  // Ring physics
  RING: {
    SCATTER_SPEED: 400,
    SCATTER_COUNT: 20,
    MAGNETIC_RANGE: 100,
    MAGNETIC_SPEED: 300,
  },
  
  // Enemies
  ENEMY: {
    PATROL_SPEED: 100,
    BUZZBOMBER_SPEED: 150,
    SWOOP_SPEED: 250,
  },
  
  // Power-ups
  POWERUP: {
    SPEED_MULTIPLIER: 1.5,
    SPEED_DURATION: 15000,
    INVINCIBILITY_DURATION: 10000,
  },
  
  // Scoring
  SCORE: {
    RING: 10,
    ENEMY: 100,
    CHECKPOINT: 1000,
  },
  
  // Starting values
  START_LIVES: 3,
  RINGS_FOR_LIFE: 100,
};

export default GameConfig;
