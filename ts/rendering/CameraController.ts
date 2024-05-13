import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class CameraController {
    
    xSpeed: number = 0.1;
    zSpeed: number = 0.1;
    acceleration: number = 0.0035;
    initialSpeed: number = 0.1;
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
        // ...

        // TODO: bring in loop from hivemind
        // we can use a function that fractionalizes "elapsed" to smooth this out ...
        setInterval(() => {
            this.xSpeed += this.acceleration;
            this.zSpeed += this.acceleration;
        }, 10);

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'w':
            case 'W':
                this.camera.position.z -= this.zSpeed;
                break;
            case 's':
            case 'S':
                this.camera.position.z += this.zSpeed;
                break;
            case 'a':
            case 'A':
                this.camera.position.x -= this.xSpeed;
                break;
            case 'd':
            case 'D':
                this.camera.position.x += this.xSpeed;
                break;
        }
    }

    onKeyUp(event: KeyboardEvent) {
        this.xSpeed = this.initialSpeed;
        this.zSpeed = this.initialSpeed;
    }
}