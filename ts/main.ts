import Character from './gameObjects/Character';
import { Terrain } from './gameObjects/Terrain';
import Renderer from './rendering/Renderer';

const terrain = new Terrain(10, 10);
Renderer.addToScene(terrain.render());

Renderer.camera.position.set(0, 90, 0);
const multipliedCenter = terrain.center.clone();
multipliedCenter.y = 1;
Renderer.camera.lookAt(multipliedCenter);

const characterPosition = terrain.center.clone();
characterPosition.y = 40;
const character = new Character(characterPosition);
Renderer.addToScene(character.render());
