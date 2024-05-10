import * as THREE from 'three';

export class Diagnostics {
    renderer: THREE.WebGLRenderer;
    infoElement: HTMLDivElement;

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;

        // Create an HTML element to display the information
        this.infoElement = document.createElement('div');
        this.infoElement.style.position = 'absolute';
        this.infoElement.style.left = '2px';
        this.infoElement.style.top = '2px';
        this.infoElement.style.color = 'white';
        document.body.appendChild(this.infoElement);
    }

    update(frameTime: number) {
        const info = this.renderer.info;
        const formattedFrameTime = frameTime.toFixed(3);

        this.infoElement.innerHTML = `
            Draw calls: ${info.render.calls}<br>
            Triangles: ${info.render.triangles}<br>
            Lines: ${info.render.lines}<br>
            Points: ${info.render.points}<br>
            Geometries in memory: ${info.memory.geometries}<br>
            Textures in memory: ${info.memory.textures}<br>
            Frame time: ${formattedFrameTime}
        `;
    }
}
