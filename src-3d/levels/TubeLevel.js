import * as THREE from 'three';
import { GameConfig3D } from '../config/GameConfig3D.js';

export default class TubeLevel {
    constructor(scene, assetLoader) {
        this.scene = scene;
        this.assetLoader = assetLoader;
        
        this.chunks = [];
        this.chunkLength = GameConfig3D.CHUNK_LENGTH;
        this.visibleChunks = GameConfig3D.VISIBLE_CHUNKS;
        
        this.rings = [];
        this.obstacles = [];
        this.enemies = [];
        
        // Use InstancedMesh for high performance ring rendering
        this.setupInstancedRings();
        
        // Initial chunks
        for (let i = 0; i < this.visibleChunks; i++) {
            this.createChunk(i * this.chunkLength);
        }
    }

    setupInstancedRings() {
        const torusGeom = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
        const ringMat = this.assetLoader.materials.get('ring');
        this.ringInstances = new THREE.InstancedMesh(torusGeom, ringMat, 500);
        this.ringInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.ringInstances.castShadow = true;
        this.scene.add(this.ringInstances);
        
        this.activeRings = [];
    }

    createChunk(zOffset) {
        const group = new THREE.Group();
        group.position.z = zOffset;
        
        // Track Floor
        const floorGeom = new THREE.BoxGeometry(GameConfig3D.LANE_WIDTH * 3, 1, this.chunkLength);
        const floor = new THREE.Mesh(floorGeom, this.assetLoader.materials.get('grass'));
        floor.position.set(0, -0.5, this.chunkLength / 2);
        floor.receiveShadow = true;
        group.add(floor);
        
        // Decorative pillars/trees
        for (let i = 0; i < 5; i++) {
            const tree = this.assetLoader.createTreeModel();
            tree.position.set(
                (Math.random() > 0.5 ? 1 : -1) * (GameConfig3D.LANE_WIDTH * 2 + Math.random() * 5),
                0,
                Math.random() * this.chunkLength
            );
            group.add(tree);
        }
        
        // Spawn rings in patterns
        this.spawnRingPattern(zOffset);
        
        // Spawn obstacles
        if (Math.random() < GameConfig3D.OBSTACLE_FREQUENCY) {
            this.spawnObstaclePattern(zOffset);
        }
        
        this.scene.add(group);
        this.chunks.push({ z: zOffset, group });
    }

    spawnObstaclePattern(zOffset) {
        const laneX = [-GameConfig3D.LANE_WIDTH, 0, GameConfig3D.LANE_WIDTH];
        const types = Object.values(GameConfig3D.OBSTACLE_TYPES);
        
        const type = types[Math.floor(Math.random() * types.length)];
        const lane = laneX[Math.floor(Math.random() * 3)];
        const z = zOffset + Math.random() * GameConfig3D.CHUNK_LENGTH;
        
        let model;
        switch(type) {
            case 'hurdle': model = this.assetLoader.createHurdleModel(); break;
            case 'barrier': model = this.assetLoader.createBarrierModel(); break;
            case 'dash_panel': model = this.assetLoader.createDashPanelModel(); break;
            case 'enemy': model = this.assetLoader.createEnemyModel(); break;
        }
        
        if (model) {
            model.position.set(lane, 0, z);
            this.scene.add(model);
            this.obstacles.push({ type, lane, z, model });
        }
    }

    spawnRingPattern(zOffset) {
        const laneX = [-GameConfig3D.LANE_WIDTH, 0, GameConfig3D.LANE_WIDTH];
        const startZ = zOffset + 20;
        const count = 5;
        const selectedLane = laneX[Math.floor(Math.random() * 3)];
        
        for (let i = 0; i < count; i++) {
            this.activeRings.push({
                x: selectedLane,
                y: 1.5,
                z: startZ + i * 4,
                collected: false
            });
        }
    }

    update(playerZ) {
        // Update Ring Instances
        const matrix = new THREE.Matrix4();
        let instanceIdx = 0;
        
        const time = Date.now() * 0.005;
        
        this.activeRings.forEach((ring, idx) => {
            if (ring.collected) return;
            
            // Rotation and floating effect
            matrix.makeRotationY(time);
            matrix.setPosition(ring.x, ring.y + Math.sin(time + ring.z) * 0.2, ring.z);
            this.ringInstances.setMatrixAt(instanceIdx++, matrix);
        });
        
        this.ringInstances.count = instanceIdx;
        this.ringInstances.instanceMatrix.needsUpdate = true;
        
        // Chunk management (Infinite scrolling)
        if (playerZ > this.chunks[0].z + this.chunkLength) {
            const oldChunk = this.chunks.shift();
            this.scene.remove(oldChunk.group);
            
            const lastZ = this.chunks[this.chunks.length - 1].z;
            this.createChunk(lastZ + this.chunkLength);
            
            // Cleanup old rings
            this.activeRings = this.activeRings.filter(r => r.z > playerZ - 50);
            
            // Cleanup old obstacles
            this.obstacles = this.obstacles.filter(obs => {
                if (obs.z < playerZ - 50) {
                    this.scene.remove(obs.model);
                    return false;
                }
                return true;
            });
        }
    }

    checkCollisions(player) {
        // Simple bounding box collision for rings
        const pX = player.position.x;
        const pY = player.position.y;
        const pZ = player.position.z;
        const config = GameConfig3D;
        
        // Ring collisions
        this.activeRings.forEach(ring => {
            if (ring.collected) return;
            
            const dx = Math.abs(pX - ring.x);
            const dy = Math.abs(pY - ring.y);
            const dz = Math.abs(pZ - ring.z);
            
            if (dx < 1 && dy < 1.5 && dz < 1) {
                ring.collected = true;
                this.onRingCollected();
            }
        });

        // Obstacle collisions
        this.obstacles.forEach(obs => {
            const dx = Math.abs(pX - obs.lane);
            const dz = Math.abs(pZ - obs.z);
            
            if (dx < 1 && dz < 1) {
                if (obs.type === config.OBSTACLE_TYPES.DASH_PANEL) {
                    player.activateDash();
                } else if (obs.type === config.OBSTACLE_TYPES.HURDLE) {
                    if (!player.isJumping) player.takeDamage();
                } else if (obs.type === config.OBSTACLE_TYPES.BARRIER) {
                    if (!player.isSliding) player.takeDamage();
                } else if (obs.type === config.OBSTACLE_TYPES.ENEMY) {
                    if (!player.isJumping && !player.isRolling) player.takeDamage();
                }
            }
        });
    }

    onRingCollected() {
        window.gameState.rings++;
        window.gameState.score += GameConfig3D.RING_SCORE;
        // Trigger event for HUD
    }
}
