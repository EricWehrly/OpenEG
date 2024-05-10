// Terrain.ts
import * as THREE from 'three';
import { Tile } from './Tile';
import { TileRenderer } from './TileRenderer';

export class Terrain {
  tiles: Tile[][];

  get center() {
    return new THREE.Vector3(this.tiles.length / 2, 1, this.tiles[0].length / 2);
  }

  constructor(width: number, height: number) {
    this.tiles = [];
    for (let i = 0; i < width; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < height; j++) {
        this.tiles[i][j] = new Tile(/* ... */);
      }
    }
  }

  render(): THREE.Group {
    const group = new THREE.Group();

    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        const tile = this.tiles[i][j];
        const tileGroup = TileRenderer.render(tile);

        // Position the tile in the grid
        tileGroup.position.set(i * TileRenderer.scaleFactor, 0, j * TileRenderer.scaleFactor);

        group.add(tileGroup);
      }
    }

    return group;
  }
}
