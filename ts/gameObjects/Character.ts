import * as THREE from 'three';
import { TileRenderer } from '../rendering/TileRenderer';

class Character {
    mesh: THREE.Mesh;

    constructor(position?: THREE.Vector3) {

        const scaleFactor = TileRenderer.scaleFactor;

        // const geometry = new CapsuleGeometry(1, 2, 8); // Adjust these parameters as needed
        const geometry = new THREE.CapsuleGeometry(1, 1, 1);        
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Banana yellow color
        this.mesh = new THREE.Mesh(geometry, material);
        // this.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        if(position) {
            this.mesh.position.set(position.x, position.y, position.z);
        }
    }

    render() {
        return this.mesh;
    }
}

export default Character;
