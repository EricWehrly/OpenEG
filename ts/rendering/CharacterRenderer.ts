import * as THREE from 'three';
import { TileRenderer } from './TileRenderer';
import Events from '../core/Events';
import Character from '../gameObjects/Character';
import EventTypes from '../core/EventTypes';
import Renderer from './Renderer';
import RendererLayers from './RendererLayers';
import GameObject from '../gameObjects/GameObject';
import ObjectRenderer from './ObjectRenderer';

export default class CharacterRenderer extends ObjectRenderer {
    mesh: THREE.Mesh;

    static {
        Events.Subscribe(EventTypes.GameObjectCreated, (gameObject: any) => {
            if(gameObject instanceof Character) {
                const character = gameObject as Character;
                new CharacterRenderer(character);
            }
        });

        Renderer.registerRenderMethod(CharacterRenderer.renderLoop);
    }

    // eventually we'll want to rework this some
    static renderLoop() {

        const characters = GameObject.getAllByType(Character);
        for(var character of characters) {
            const renderer = character.renderer as CharacterRenderer;
            if(renderer) {
                const position = character.position;
                if(position) {
                    renderer.mesh.position.set(position.x, position.y, position.z);
                }
            }
        }
    }

    static nothing () { }

    constructor(character: Character) {

        super();
        
        character.renderer = this;

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
