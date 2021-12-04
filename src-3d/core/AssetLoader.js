import * as THREE from 'three';
import { GameConfig3D } from '../config/GameConfig3D.js';

export default class AssetLoader {
    constructor() {
        this.geometries = new Map();
        this.materials = new Map();
        
        this.initCommons();
    }

    initCommons() {
        // Sonic Materials
        this.materials.set('sonic-body', new THREE.MeshPhongMaterial({ color: GameConfig3D.COLORS.SONIC_BLUE, flatShading: true }));
        this.materials.set('sonic-skin', new THREE.MeshPhongMaterial({ color: 0xFFCC99, flatShading: true }));
        this.materials.set('sonic-shoes', new THREE.MeshPhongMaterial({ color: 0xFF0000, flatShading: true }));
        
        // World Materials
        this.materials.set('ring', new THREE.MeshStandardMaterial({ 
            color: GameConfig3D.COLORS.RING_GOLD, 
            metalness: 0.8, 
            roughness: 0.2,
            emissive: GameConfig3D.COLORS.RING_GOLD,
            emissiveIntensity: 0.5
        }));
        
        this.materials.set('grass', new THREE.MeshPhongMaterial({ color: GameConfig3D.COLORS.GRASS }));
        this.materials.set('ground', new THREE.MeshPhongMaterial({ color: GameConfig3D.COLORS.GROUND }));
    }

    createSonicModel() {
        const group = new THREE.Group();
        
        // Body (Sphere)
        const bodyGeom = new THREE.SphereGeometry(1, 8, 8);
        const body = new THREE.Mesh(bodyGeom, this.materials.get('sonic-body'));
        group.add(body);
        
        // Spines (Cylinders)
        for (let i = 0; i < 3; i++) {
            const spineGeom = new THREE.CylinderGeometry(0.2, 0.5, 1.5, 6);
            const spine = new THREE.Mesh(spineGeom, this.materials.get('sonic-body'));
            spine.position.set(0, 0.5 - i * 0.4, -0.8);
            spine.rotation.x = Math.PI / 4;
            group.add(spine);
        }
        
        // Head/Face area
        const headGeom = new THREE.SphereGeometry(0.8, 8, 8);
        const head = new THREE.Mesh(headGeom, this.materials.get('sonic-body'));
        head.position.set(0, 0.8, 0.2);
        group.add(head);
        
        // Face (Skin part)
        const faceGeom = new THREE.SphereGeometry(0.6, 8, 8);
        const face = new THREE.Mesh(faceGeom, this.materials.get('sonic-skin'));
        face.position.set(0, 0.6, 0.6);
        group.add(face);
        
        // Shoes
        const shoeGeom = new THREE.BoxGeometry(0.6, 0.4, 1.2);
        const leftShoe = new THREE.Mesh(shoeGeom, this.materials.get('sonic-shoes'));
        leftShoe.position.set(-0.5, -1, 0.2);
        group.add(leftShoe);
        
        const rightShoe = new THREE.Mesh(shoeGeom, this.materials.get('sonic-shoes'));
        rightShoe.position.set(0.5, -1, 0.2);
        group.add(rightShoe);
        
        group.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        return group;
    }

    createRingMesh() {
        const torusGeom = new THREE.TorusGeometry(0.5, 0.1, 8, 16);
        const ring = new THREE.Mesh(torusGeom, this.materials.get('ring'));
        ring.castShadow = true;
        return ring;
    }

    createTreeModel() {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
        const trunk = new THREE.Mesh(trunkGeom, this.materials.get('ground'));
        trunk.position.y = 2;
        group.add(trunk);
        
        // Leaves
        const leafGeom = new THREE.ConeGeometry(2, 4, 8);
        const leaves = new THREE.Mesh(leafGeom, this.materials.get('grass'));
        leaves.position.y = 5;
        group.add(leaves);
        
        return group;
    }
}
