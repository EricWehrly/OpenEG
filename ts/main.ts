import * as THREE from 'three';
import { Terrain } from './Terrain';
import CameraController from "./CameraController"

console.log(`starting...`);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const terrain = new Terrain(10, 10);
scene.add(terrain.render());
renderer.setSize(window.innerWidth, window.innerHeight, false); // Set the canvas size without preserving the aspect ratio

const cameraController = new CameraController(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, cameraController.camera);
}
animate();

console.log('...ending');
