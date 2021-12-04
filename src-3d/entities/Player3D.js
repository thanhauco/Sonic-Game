import * as THREE from 'three';
import { GameConfig3D } from '../config/GameConfig3D.js';

export default class Player3D extends THREE.Group {
    constructor(model) {
        super();
        this.add(model);
        
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.targetLane = 0; // -1, 0, 1
        this.isJumping = false;
        this.isRolling = false;
        this.speedMultiplier = 1;
        
        // Tilt animation
        this.rotationGroup = model;
    }

    update(time, delta, keys) {
        // Forward movement
        const config = GameConfig3D;
        const dt = delta / 1000;
        
        // Update forward velocity
        this.velocity.z = config.PLAYER_SPEED * this.speedMultiplier;
        
        // Handle Lane Switching
        if (keys.left && !this.prevLeft) {
            this.targetLane = Math.max(this.targetLane - 1, -1);
        }
        if (keys.right && !this.prevRight) {
            this.targetLane = Math.min(this.targetLane + 1, 1);
        }
        this.prevLeft = keys.left;
        this.prevRight = keys.right;
        
        // Interpolate to target lane
        const targetX = this.targetLane * config.LANE_WIDTH;
        this.position.x += (targetX - this.position.x) * config.LANE_SWITCH_SPEED * dt;
        
        // Jump handling
        if (keys.space && !this.isJumping) {
            this.velocity.y = config.JUMP_FORCE;
            this.isJumping = true;
        }
        
        // Gravity and floor collision
        if (this.isJumping) {
            this.velocity.y -= config.GRAVITY * dt;
            this.position.y += this.velocity.y * dt;
            
            if (this.position.y <= 1) {
                this.position.y = 1;
                this.velocity.y = 0;
                this.isJumping = false;
            }
        }
        
        // Forward position update
        this.position.z += this.velocity.z * dt;
        
        // Visual Tilt based on lane switching
        const tiltX = (targetX - this.position.x) * 0.1;
        this.rotationGroup.rotation.z = -tiltX;
        
        // Sonic Spin animation when jumping/rolling
        if (this.isJumping || this.isRolling) {
            this.rotationGroup.rotation.x -= 15 * dt;
        } else {
            this.rotationGroup.rotation.x = 0;
            // Running bob
            this.rotationGroup.position.y = Math.abs(Math.sin(time * 0.01)) * 0.1;
        }
    }

    collectRing() {
        // Visual/Audio feedback for ring collection
    }

    takeDamage() {
        // Damage logic
    }
}
