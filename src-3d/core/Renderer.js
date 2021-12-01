import * as THREE from 'three';
import Stats from 'stats.js';
import { GameConfig3D } from '../config/GameConfig3D.js';

export default class Renderer {
    constructor(container) {
        this.container = container;
        
        // Setup WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: false, // For performance, will use post-process AA if needed
            powerPreference: 'high-performance',
            alpha: false
        });
        
        this.renderer.setPixelRatio(GameConfig3D.PIXEL_RATIO);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Performance Monitoring
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
        
        // Stats position
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '0px';
        this.stats.dom.style.right = '0px';
        this.stats.dom.style.left = 'auto';

        // Window Resize handling
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, camera) {
        this.stats.begin();
        this.renderer.render(scene, camera);
        this.stats.end();
    }

    get domElement() {
        return this.renderer.domElement;
    }
}
