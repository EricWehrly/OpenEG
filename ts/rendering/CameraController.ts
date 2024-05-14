import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RegisterLoopMethod } from '../core/Loop';

export default class CameraController {
    
    private maxSpeed: number = 1.0;
    private acceleration: number = 0.0001;
    private camera: THREE.Camera;
    private controls: OrbitControls;
    private distance: number = 90; // Declare distance as a class-level variable
    private xVelocity: number = 0;
    private zVelocity: number = 0;
    private frictionMultiplier: number = 4.23;

    // TODO: We have an input handler somewhere. I think it handles all of this...
    private pressedKeys: string[] = [];
    private keyMap: { [key: string]: Function } = {
        'w': this.moveCameraUp,
        's': this.moveCameraDown,
        'a': this.moveCameraLeft,
        'd': this.moveCameraRight,
        'c': this.centerCamera,
    };

    getCamera() {
        return this.camera;
    }

    getDistance() {
        return this.distance;
    }

    moveCameraUp(elapsed: number) {
        this.zVelocity += this.acceleration * elapsed;
        this.zVelocity = Math.max(-this.maxSpeed, Math.min(this.zVelocity, this.maxSpeed));
    }

    moveCameraDown(elapsed: number) {
        this.zVelocity -= this.acceleration * elapsed;
        this.zVelocity = Math.max(-this.maxSpeed, Math.min(this.zVelocity, this.maxSpeed));
    }

    moveCameraLeft(elapsed: number) {
        this.xVelocity -= this.acceleration * elapsed;
        this.xVelocity = Math.max(-this.maxSpeed, Math.min(this.xVelocity, this.maxSpeed));
    }

    moveCameraRight(elapsed: number) {
        this.xVelocity += this.acceleration * elapsed;
        this.xVelocity = Math.max(-this.maxSpeed, Math.min(this.xVelocity, this.maxSpeed));
    }

    centerCamera() {

        this.zVelocity = 0;
        this.xVelocity = 0;
        this.camera.position.set(0, 0, 0);
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

        RegisterLoopMethod((elapsed: number) => {

            if(this.xVelocity > 0) {
                this.xVelocity -= (this.acceleration * this.frictionMultiplier);
            } else if(this.xVelocity < 0) { 
                this.xVelocity += (this.acceleration * this.frictionMultiplier);
            }
            if (this.zVelocity > 0) {
                this.zVelocity -= (this.acceleration * this.frictionMultiplier);
            } else if (this.zVelocity < 0) {
                this.zVelocity += (this.acceleration * this.frictionMultiplier);
            }

            for(var key of this.pressedKeys) {
                this.keyMap[key].call(this, elapsed);
            }
            this.camera.position.x += this.xVelocity;
            this.camera.position.z += this.zVelocity;
        }, true);

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if(!this.pressedKeys.includes(key)) {
            this.pressedKeys.push(key);
        }
    }

    onKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        const index = this.pressedKeys.indexOf(key);
        if (index !== -1) {
            this.pressedKeys.splice(index, 1);
        }
    }
}
