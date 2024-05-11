import Character from './gameObjects/Character';
import { Terrain } from './gameObjects/Terrain';
import Renderer from './rendering/Renderer';

const terrain = new Terrain(10, 10);
Renderer.addToScene(terrain.render());

Renderer.camera.position.set(0, 5, 0);
Renderer.camera.scale.set(.1, .1, .1);
Renderer.camera.lookAt(terrain.center);

const characterPosition = terrain.center.clone();
characterPosition.y += 1;
const character = new Character(characterPosition);
Renderer.addToScene(character.render());
