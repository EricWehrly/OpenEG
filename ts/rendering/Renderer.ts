import * as THREE from 'three';
import { Terrain } from '../gameObjects/Terrain';
import CameraController from './CameraController';
import { Diagnostics } from './Diagnostics';
import Events from '../core/Events';
import EventTypes from '../core/EventTypes';
import RendererLayers, { getLayerFromMask } from './RendererLayers';

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

    private renderMethods: Function[] = [];

    getCamera() {
        return this.camera;
    }

    constructor() {

        if(Renderer.instance != null) {
            throw new Error('Renderer is a singleton');
        }

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(RendererLayers.Terrain);
        this.raycaster.layers.enable(RendererLayers.Floors);
        this.raycaster.layers.enable(RendererLayers.Characters);
        this.raycaster.layers.enable(RendererLayers.Furniture);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.renderer.setSize(window.innerWidth, window.innerHeight, false); // Set the canvas size without preserving the aspect ratio

        const cameraController = new CameraController(this.renderer.domElement);
        this.camera = cameraController.getCamera();

        // TODO: if diagnostics is enabled
        this.diagnostics = new Diagnostics(this.renderer);
        
        window.addEventListener('mousedown', this.onMouseDown.bind(this), false);

        this.animate.bind(this)();
        
        Renderer.instance = this;

        this.renderLoop.bind(this)();
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
        if(intersects.length === 0) return; // No objects clicked
        const intersected = intersects[0];

        // TODO: Highlighting should work differently for different types of objects
        this.highlightObject(intersected);
        
        const layerMask = intersected.object.layers.mask;
        const layerNumber = getLayerFromMask(layerMask);
        if(layerNumber == RendererLayers.Floors) {
            const tile = intersected.object.userData.tile;
            Events.RaiseEvent(EventTypes.TileClicked, tile);
        }
        if(layerNumber == RendererLayers.Characters) {
            const character = intersected.object.userData.character;
            Events.RaiseEvent(EventTypes.CharacterClicked, character);
        }

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

    registerRenderMethod(method: Function) {
        this.renderMethods.push(method);
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

    private renderLoop() {

        for(var method of this.renderMethods) {
            method();
        }

        window.requestAnimationFrame(this.renderLoop.bind(this));
    }
}

export default Renderer.getRenderer();
