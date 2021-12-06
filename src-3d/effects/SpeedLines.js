import * as THREE from 'three';

export default class SpeedLines extends THREE.Group {
    constructor() {
        super();
        
        const count = 40;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 6); // 2 points per line
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 10;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Start point (far)
            positions[i * 6] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = 20;
            
            // End point (near)
            positions[i * 6 + 3] = x;
            positions[i * 6 + 4] = y;
            positions[i * 6 + 5] = 0;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        
        this.lines = new THREE.LineSegments(geometry, material);
        this.add(this.lines);
        
        this.visible = false;
    }

    update(playerPos, isBoosting) {
        this.position.copy(playerPos);
        this.position.z += 10;
        
        this.visible = isBoosting;
        
        if (isBoosting) {
            // Randomly flicker/vibrate lines
            this.lines.position.x = (Math.random() - 0.5) * 0.2;
            this.lines.position.y = (Math.random() - 0.5) * 0.2;
        }
    }
}
