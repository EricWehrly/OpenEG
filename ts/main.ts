import * as THREE from 'three';
import { Terrain } from './Terrain';
import { TileRenderer } from './TileRenderer';

console.log(`starting...`);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5 * TileRenderer.scaleFactor; // Adjust the camera's position based on the scale factor

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const terrain = new Terrain(10, 10);
scene.add(terrain.render());
renderer.setSize(window.innerWidth, window.innerHeight, false); // Set the canvas size without preserving the aspect ratio

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

console.log('...ending');
