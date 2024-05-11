import * as THREE from 'three';
import { TileRenderer } from '../rendering/TileRenderer';
import EventTypes from '../core/EventTypes';
import Events from '../core/Events';
import GameObject from './GameObject';

class Character extends GameObject {
    mesh: THREE.Mesh;
    selected: boolean = true;

    constructor(position?: THREE.Vector3) {

        super();

        const scaleFactor = TileRenderer.scaleFactor;

        // const geometry = new CapsuleGeometry(1, 2, 8); // Adjust these parameters as needed
        const geometry = new THREE.CapsuleGeometry(1, 1, 1);        
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            // side: THREE.DoubleSide
        }); // Banana yellow color
        this.mesh = new THREE.Mesh(geometry, material);
        // this.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        if(position) {
            this.mesh.position.set(position.x, position.y, position.z);
        }

        Events.RaiseEvent(EventTypes.GameObjectCreated, this);
    }

    render() {
        return this.mesh;
    }
}

export default Character;
