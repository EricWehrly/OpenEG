import * as THREE from 'three';
import { Terrain } from '../gameObjects/Terrain';
import CameraController from './CameraController';
import { Diagnostics } from './Diagnostics';

// TODO: Make static & Singleton
class Renderer {

    private static instance: Renderer = new Renderer();

    static getRenderer() {
        return Renderer.instance;
    }

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;    
    raycaster: THREE.Raycaster;
    
    terrain: Terrain;
    diagnostics: Diagnostics;

    constructor() {

        if(Renderer.instance != null) {
            throw new Error('Renderer is a singleton');
        }

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.renderer.setSize(window.innerWidth, window.innerHeight, false); // Set the canvas size without preserving the aspect ratio

        const cameraController = new CameraController(this.renderer.domElement);
        this.camera = cameraController.camera;

        this.camera.position.set(0, 90, 0);
        // const multipliedCenter = terrain.center.clone().multiplyScalar(30);
        // multipliedCenter.y = 1;
        // this.camera.lookAt(multipliedCenter);

        // TODO: if diagnostics is enabled
        this.diagnostics = new Diagnostics(this.renderer);
        
        window.addEventListener('mousedown', this.onMouseDown.bind(this), false);

        this.animate.bind(this)();
        
        Renderer.instance = this;
    }

    addToScene(object: THREE.Object3D) {
        this.scene.add(object);
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

        if(event.button !== 0) return; // Only handle left clicks

        const intersects = this.getClickedObjects(event);

        this.highlightObject(intersects[0]);
        // for (let i = 0; i < intersects.length; i++) {
            // this.objectClicked(intersects[i]);
        // }
    }

    getClickedObjects(event: MouseEvent) {

        // Normalize the mouse position from -1 to 1
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        // TODO: Raycaster needs to stop on first hit
        this.raycaster.setFromCamera(mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        return intersects;
    }

    private highlightObject(intersect: THREE.Intersection<THREE.Object3D>) {

        // We need to use "parent" in order to get the group that controls the object positioning
        console.log(`Clicked on cube with position:`, intersect.object.parent.position);
        
        // TODO: These need to be in some kind of general file
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        if (intersect.object instanceof THREE.LineSegments) {
            const lineSegments = intersect.object as THREE.LineSegments;
            (lineSegments.material as THREE.LineBasicMaterial).color.set('pink');
        }
        else if (intersect.object instanceof THREE.Mesh) {
            const mesh = intersect.object as THREE.Mesh;
            mesh.material = material;
            // (mesh.material as THREE.LineBasicMaterial).color.set('pink');
        }

        // Create a line from the camera to the point of intersection
        const points = [this.camera.position, intersect.point];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        this.scene.add(line);
    }
}

export default Renderer.getRenderer();
