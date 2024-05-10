import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class CameraController {
    camera: THREE.Camera;
    controls: OrbitControls;

    getCamera() {
        return this.camera;
    }

    constructor(canvas: HTMLCanvasElement) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const distance = 100;
        this.camera = new THREE.OrthographicCamera(-distance * aspectRatio, distance * aspectRatio, distance, -distance, 1, 1000);
        this.camera.position.set(2, 2, 2);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableRotate = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        };
    }
}
