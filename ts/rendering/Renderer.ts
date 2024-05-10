import * as THREE from 'three';
import { Terrain } from '../Terrain';
import CameraController from './CameraController';
import { Diagnostics } from './diagnostics';

// TODO: Make static & Singleton
export default class Renderer {
    renderer: THREE.WebGLRenderer;
    terrain: Terrain;
    scene: THREE.Scene;
    camera: THREE.Camera;
    diagnostics: Diagnostics;

    constructor(terrain: Terrain) {

        this.terrain = terrain;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.add(terrain.render());
        this.renderer.setSize(window.innerWidth, window.innerHeight, false); // Set the canvas size without preserving the aspect ratio

        const cameraController = new CameraController(this.renderer.domElement);
        this.camera = cameraController.camera;

        this.camera.position.set(0, 90, 0);
        const multipliedCenter = terrain.center.clone().multiplyScalar(30);
        multipliedCenter.y = 1;
        this.camera.lookAt(multipliedCenter);

        // TODO: if diagnostics is enabled
        this.diagnostics = new Diagnostics(this.renderer);

        this.animate.bind(this)();
        console.log(this.renderer.info)
    }

    animate() {
        const start = performance.now();
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        const elapsed = performance.now() - start;
        // TODO: if diagnostics is enabled
        // this.diagnostics.update(elapsed);
        this.diagnostics.update(elapsed);
    }
}