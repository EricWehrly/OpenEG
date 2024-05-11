import { Terrain } from './gameObjects/Terrain';
import Renderer from './rendering/Renderer';

const terrain = new Terrain(10, 10);
Renderer.addToScene(terrain.render());

Renderer.camera.position.set(0, 90, 0);
const multipliedCenter = terrain.center.clone().multiplyScalar(30);
multipliedCenter.y = 1;
Renderer.camera.lookAt(multipliedCenter);
