# Sonic 2D Platformer Game

A high-speed 2D platformer game inspired by classic Sonic, built with modern JavaScript using **Vite** + **Phaser 3** framework.

## Project Setup

- Vite as build tool with HMR for fast development
- Phaser 3 as game framework
- Development and build scripts

## Core Game Engine

- Phaser game configuration (800x600 canvas, arcade physics)
- Scene registration and game initialization
- Physics constants (gravity, friction, max speeds)

## Game Scenes

- **BootScene**: Procedural asset generation and loading
- **TitleScene**: Animated title screen with parallax
- **GameScene**: Main gameplay and level management
- **GameOverScene**: Score summary and retry options

## Player System

- Running mechanics and acceleration
- Variable jump height
- Spin Dash and Rolling physics
- Invincibility frames

## Enemy System

- Crabmeat (Patrol AI)
- Buzzbomber (Swoop AI)

## Collectibles & Power-ups

- Golden Rings (Magnetic attraction, scatter on hit)
- Speed Shoes, Shield, Invincibility, Extra Life

## Level Design

- Procedural level generation
- Multi-layer parallax background
- Interactive platforms and goal post
