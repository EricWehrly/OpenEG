import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class CameraController {
    camera: THREE.Camera;
    controls: OrbitControls;
    distance: number = 90; // Declare distance as a class-level variable

    getCamera() {
        return this.camera;
    }

    getDistance() {
        return this.distance;
    }

    constructor(canvas: HTMLCanvasElement) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        
        this.camera = new THREE.OrthographicCamera(-this.distance * aspectRatio, this.distance * aspectRatio, this.distance, -this.distance, 1, 1000);
        this.camera.position.set(2, 2, 2);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableRotate = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        };
        
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        const speed = 1; // Adjust speed as needed

        switch (event.key) {
            case 'w':
            case 'W':
                this.camera.position.z -= speed;
                break;
            case 's':
            case 'S':
                this.camera.position.z += speed;
                break;
            case 'a':
            case 'A':
                this.camera.position.x -= speed;
                break;
            case 'd':
            case 'D':
                this.camera.position.x += speed;
                break;
        }
    }
}
