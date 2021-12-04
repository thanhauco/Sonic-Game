// 3D Game Configuration
export const GameConfig3D = {
  // Display
  WIDTH: 800,
  HEIGHT: 600,
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  
  // Performance
  MAX_DRAW_CALLS: 100,
  TARGET_FPS: 60,
  PIXEL_RATIO: Math.min(window.devicePixelRatio, 2),
  
  // Physics
  GRAVITY: 30,
  PLAYER_SPEED: 50,
  PLAYER_MAX_SPEED: 100,
  PLAYER_ACCELERATION: 20,
  JUMP_FORCE: 15,
  LANE_SWITCH_SPEED: 15,
  
  // Lanes
  LANE_WIDTH: 3,
  LANE_COUNT: 3,
  
  // Level generation
  CHUNK_LENGTH: 100,
  VISIBLE_CHUNKS: 3,
  RING_SPACING: 5,
  OBSTACLE_FREQUENCY: 0.1,
  
  // Scoring
  RING_SCORE: 10,
  DISTANCE_SCORE: 1,
  
  // Colors
  COLORS: {
    SONIC_BLUE: 0x1E90FF,
    SONIC_DARK: 0x0066CC,
    RING_GOLD: 0xFFD700,
    SKY: 0x87CEEB,
    GRASS: 0x228B22,
    GROUND: 0x8B4513
  }
};
