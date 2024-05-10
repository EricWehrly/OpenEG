import * as THREE from 'three';

export class Diagnostics {
    renderer: THREE.WebGLRenderer;
    infoElement: HTMLDivElement;
    frameTime: number;
    frameCount: number;
    lastTime: number;
    fps: number;

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.frameTime = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;

        // Create an HTML element to display the information
        this.infoElement = document.createElement('div');
        this.infoElement.style.position = 'absolute';
        this.infoElement.style.left = '0px';
        this.infoElement.style.top = '0px';
        this.infoElement.style.color = 'white';
        document.body.appendChild(this.infoElement);
    }

    setFrameTime(frameTime: number) {
        this.frameTime = frameTime;
    }

    update(frameTime: number) {
        // Increment the frame count
        this.frameCount++;

        // Calculate the elapsed time since the last update
        const now = performance.now();
        const elapsed = now - this.lastTime;

        // If more than a second has passed, calculate the FPS
        if (elapsed > 1000) {
            this.fps = this.frameCount / (elapsed / 1000);
            this.frameCount = 0;
            this.lastTime = now;
        }

        // Get the rendering info
        const info = this.renderer.info;
        const formattedFrameTime = frameTime.toFixed(3);

        // Update the info element
        this.infoElement.innerHTML = `
            Draw calls: ${info.render.calls}<br>
            Triangles: ${info.render.triangles}<br>
            Lines: ${info.render.lines}<br>
            Points: ${info.render.points}<br>
            Geometries in memory: ${info.memory.geometries}<br>
            Textures in memory: ${info.memory.textures}<br>
            Last frame time: ${formattedFrameTime} ms<br>
            FPS: ${this.fps.toFixed(2)}<br>
        `;
    }
}