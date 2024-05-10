import * as THREE from 'three';

export enum TileMaterial {
    Grass,
    Water,
    Stone,
}

export class Tile {
    material: TileMaterial;
    borderColor: THREE.Color;

    constructor(material: TileMaterial = TileMaterial.Grass, borderColor?: THREE.Color) {
        this.material = material;
        this.borderColor = borderColor || new THREE.Color(0x000000); // Default to black if no color is provided
    }

    getMaterialColor(): THREE.Color {
        switch (this.material) {
            case TileMaterial.Grass:
                return new THREE.Color(0x228B22); // Forest Green
            case TileMaterial.Water:
                return new THREE.Color(0x0000ff); // Blue
            case TileMaterial.Stone:
                return new THREE.Color(0x808080); // Gray
        }
    }
}
