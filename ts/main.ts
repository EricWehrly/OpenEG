import * as THREE from 'three';
import { Terrain } from './Terrain';
import CameraController from "./CameraController"

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const terrain = new Terrain(10, 10);
scene.add(terrain.render());
renderer.setSize(window.innerWidth, window.innerHeight, false); // Set the canvas size without preserving the aspect ratio

const cameraController = new CameraController(renderer.domElement);

const center = terrain.center;
cameraController.camera.position.set(0, 90, 0);
const multipliedCenter = terrain.center.clone().multiplyScalar(30);
multipliedCenter.y = 1;
// cameraController.camera.lookAt(terrain.center);
cameraController.camera.lookAt(multipliedCenter);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, cameraController.camera);
}
animate();
