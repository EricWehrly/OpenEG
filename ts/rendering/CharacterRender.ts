import * as THREE from 'three';
import { TileRenderer } from '../rendering/TileRenderer';
import Events from '../core/Events';
import Character from '../gameObjects/Character';
import EventTypes from '../core/EventTypes';
import Renderer from './Renderer';
import RendererLayers from './RendererLayers';

export default class CharacterRenderer {
    mesh: THREE.Mesh;

    static {
        Events.Subscribe(EventTypes.GameObjectCreated, (gameObject: any) => {
            if(gameObject instanceof Character) {
                const character = gameObject as Character;
                new CharacterRenderer(character);
            }
        });
    }

    static nothing () { }

    constructor(character: Character) {

        const scaleFactor = TileRenderer.scaleFactor;

        // const geometry = new CapsuleGeometry(1, 2, 8); // Adjust these parameters as needed
        const geometry = new THREE.CapsuleGeometry(1, 1, 1);        
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            // side: THREE.DoubleSide
        }); // Banana yellow color
        this.mesh = new THREE.Mesh(geometry, material);        
        this.mesh.userData.character = character;
        this.mesh.layers.set(RendererLayers.Characters);
        // TODO: ... shadows?
        this.mesh.castShadow = true;
        // this.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        if(character.position) {
            this.mesh.position.set(character.position.x, character.position.y, character.position.z);
        }
        

        Renderer.addToScene(this.mesh);
    }
}
