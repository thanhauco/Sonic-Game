# Sonic Rush 2D

A high-speed 2D platformer game inspired by classic Sonic, built with modern JavaScript using **Vite** and **Phaser 3**.

## Features

- Authentic Sonic physics (Running, Jumping, Rolling, Spin Dash)
- Beautiful procedural graphics and parallax backgrounds
- Enemies (Crabmeat, Buzzbomber) with unique AI
- Collectibles (Rings, Power-up Monitors)
- Modern HUD with score, timer, and lives
- Responsive design for different screens

## Quick Start

```bash
npm install
npm run dev
```

## Controls

- **Arrow Keys**: Move (Left/Right)
- **Space**: Jump
- **Down**: Roll (while moving)
- **Down + Space**: Spin Dash (while stationary)
- **ESC/P**: Pause Game

## Architecture

Built with a modular scene-based architecture in Phaser 3.

- `BootScene.js`: Procedural asset generation and loading
- `TitleScene.js`: Animated menu with parallax
- `GameScene.js`: Main gameplay logic and level management
- `Entities/`: Reusable classes for Player, Enemies, and Collectibles
