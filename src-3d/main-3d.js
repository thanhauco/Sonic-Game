import * as THREE from 'three';
import Renderer from './core/Renderer.js';
import Scene from './core/Scene.js';
import AssetLoader from './core/AssetLoader.js';
import Player3D from './entities/Player3D.js';
import TubeLevel from './levels/TubeLevel.js';
import { GameConfig3D } from './config/GameConfig3D.js';

class Game3D {
    constructor() {
        this.container = document.body;
        
        // Setup Core
        this.renderer = new Renderer(this.container);
        this.scene = new Scene();
        this.assetLoader = new AssetLoader();
        
        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(
            GameConfig3D.FOV, 
            window.innerWidth / window.innerHeight, 
            GameConfig3D.NEAR, 
            GameConfig3D.FAR
        );
        this.camera.position.set(0, 5, -10); // Fly-behind camera
        
        // Input tracking
        this.keys = { left: false, right: false, space: false };
        this.setupKeyboard();
        
        // Entities
        this.initGame();
        
        // Start Loop
        this.lastTime = performance.now();
        this.animate();
    }

    initGame() {
        // Player
        const sonicModel = this.assetLoader.createSonicModel();
        this.player = new Player3D(sonicModel);
        this.player.position.set(0, 1, 0);
        this.scene.add(this.player);
        
        // Level
        this.level = new TubeLevel(this.scene, this.assetLoader);
        
        // Global game state (shared with 2D if needed)
        window.gameState = window.gameState || {
            score: 0,
            rings: 0,
            lives: 3
        };
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
            if (e.code === 'Space') this.keys.space = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
            if (e.code === 'Space') this.keys.space = false;
        });
    }

    animate(time) {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = time - this.lastTime || 0;
        this.lastTime = time;
        
        if (delta > 100) return; // Cap huge deltas (e.g. from tab switch)

        // Update Entities
        this.player.update(time, delta, this.keys);
        this.level.update(this.player.position.z);
        this.level.checkCollisions(this.player);
        
        // Camera Follow
        const targetCamPos = new THREE.Vector3(
            this.player.position.x * 0.5,
            this.player.position.y + 4,
            this.player.position.z - 8
        );
        this.camera.position.lerp(targetCamPos, 0.1);
        this.camera.lookAt(0, this.player.position.y + 1, this.player.position.z + 5);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize 3D Game
new Game3D();
