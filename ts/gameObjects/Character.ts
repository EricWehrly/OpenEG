import * as THREE from 'three';

class Character {
    mesh: THREE.Mesh;

    constructor(position?: THREE.Vector3) {
        // const geometry = new CapsuleGeometry(1, 2, 8); // Adjust these parameters as needed
        const geometry = new THREE.CapsuleGeometry(1, 1, 1);        
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Adjust the color as needed
        this.mesh = new THREE.Mesh(geometry, material);

        if(position) {
            this.mesh.position.set(position.x, position.y, position.z);
        }
    }

    render() {
        return this.mesh;
    }
}

export default Character;
