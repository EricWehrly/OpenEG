import * as THREE from 'three';
import GameObject from './GameObject';
import Vector3 from '../core/Vector3';

export enum TileMaterial {
    Dirt,
    Grass,
    Water,
    Stone
}

export class Tile extends GameObject {
    material: TileMaterial;
    borderColor: THREE.Color;

    constructor(material?: TileMaterial, borderColor?: THREE.Color, position?: Vector3) {
        super(position);

        this.material = material || TileMaterial.Dirt;
        this.borderColor = borderColor || new THREE.Color(0x000000); // Default to black if no color is provided
    }

    getMaterialColor(): THREE.Color {
        switch (this.material) {
            case TileMaterial.Dirt:
                return new THREE.Color(0x8B4513); // Saddle Brown
            case TileMaterial.Grass:
                return new THREE.Color(0x228B22); // Forest Green
            case TileMaterial.Water:
                return new THREE.Color(0x0000ff); // Blue
            case TileMaterial.Stone:
                return new THREE.Color(0x808080); // Gray
        }
    }
}
