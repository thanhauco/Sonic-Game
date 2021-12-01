import * as THREE from 'three';
import { GameConfig3D } from '../config/GameConfig3D.js';

export default class Scene extends THREE.Scene {
    constructor() {
        super();
        
        // Background color (Sky Blue)
        this.background = new THREE.Color(GameConfig3D.COLORS.SKY);
        
        // Fog for depth and performance (culling distant objects)
        this.fog = new THREE.Fog(GameConfig3D.COLORS.SKY, 50, 200);
        
        this.setupLighting();
    }

    setupLighting() {
        // Ambient light for basic visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.add(ambientLight);
        
        // Directional light (Sun)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(50, 100, 50);
        this.sunLight.castShadow = true;
        
        // Setup shadow camera for better quality/performance
        const d = 50;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
        this.sunLight.shadow.camera.far = 300;
        this.sunLight.shadow.mapSize.width = 1024;
        this.sunLight.shadow.mapSize.height = 1024;
        
        this.add(this.sunLight);
    }

    update(time, delta) {
        // Any global scene updates go here
    }
}
