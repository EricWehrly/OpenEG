import * as THREE from 'three';
import { Terrain } from '../Terrain';
import CameraController from './CameraController';
import { Diagnostics } from './diagnostics';

// TODO: Make static & Singleton
export default class Renderer {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;    
    raycaster: THREE.Raycaster;
    
    terrain: Terrain;
    diagnostics: Diagnostics;

    constructor(terrain: Terrain) {

        this.terrain = terrain;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
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
        
        window.addEventListener('mousedown', this.onMouseDown.bind(this), false);

        this.animate.bind(this)();
        console.log(this.renderer.info)
    }

    animate() {
        const start = performance.now();
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        const elapsed = performance.now() - start;
        // TODO: if diagnostics is enabled
        this.diagnostics.update(elapsed);
    }

    // we can probly move this to an "interaction" class
    onMouseDown(event: MouseEvent) {

        if(event.button !== 0) return; // Only handle left clicks (button 0)
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Normalize the mouse position from -1 to 1
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
            // intersects[i].object is the intersected object
            // We need to use "parent" in order to get the group that controls the object positioning
            console.log(`Clicked on cube with position:`, intersects[i].object.parent.position);

            if (intersects[i].object instanceof THREE.LineSegments) {
                const lineSegments = intersects[i].object as THREE.LineSegments;
                (lineSegments.material as THREE.LineBasicMaterial).color.set('pink');
                
                // Create a line from the camera to the point of intersection
                const points = [this.camera.position, intersects[i].point];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                this.scene.add(line);
            }
        }
    }
}