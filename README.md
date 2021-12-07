# Sonic Rush: Multi-Dimension Adventure

A high-speed Sonic tribute featuring both classic 2D platforming and a high-performance 3D runner mode. Built with **Vite**, **Phaser 3**, and **Three.js**.

## 🚀 Game Modes

### 1. Classic 2D Platformer (Phaser 3)

- **Authentic Physics**: Running, Jumping, Rolling, and Spin Dash logic.
- **Advanced Boss Fight**: Face off against Dr. Eggman in his Egg Mobile.
- **Dynamic Level**: Procedural tile generation, parallax backgrounds, and interactive objects (Springs, Spikes).
- **Combo System**: Score multipliers for precision jumping.

### 2. High-Performance 3D Runner (Three.js)

- **60 FPS WebGL Rendering**: Optimized for mobile and desktop with instanced rendering.
- **3D Mechanics**: 3-lane switching, jumping, and sliding under barriers.
- **Rush Effects**: Dash panels with FOV distortion and radial speed-line shaders.
- **Procedural 3D Assets**: All models generated via mathematical primitives for zero-latency loading.

## 🛠️ Tech Stack

- **Frameworks**: Phaser 3 (2D), Three.js (3D), Zustand (State)
- **Audio**: Synthesized Web Audio API (No external assets)
- **Infrastructure**: Dockerized build, GitHub Actions CI/CD

## 🎮 Controls

### 2D Mode

- **Arrow Keys**: Move (Left/Right)
- **Space**: Jump
- **Down**: Roll / Spin Dash (with Space)
- **P / ESC**: Pause

### 3D Mode

- **A / D or Arrow Keys**: Lane Switch
- **Space**: Jump
- **Down / S**: Slide
- **Back Button**: Return to 2D Mode

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Click **"PLAY 3D MODE"** on the title screen to switch dimensions!
