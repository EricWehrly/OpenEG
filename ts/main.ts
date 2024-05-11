import { Terrain } from './gameObjects/Terrain';
import Renderer from './rendering/Renderer';

const terrain = new Terrain(10, 10);
new Renderer(terrain);
