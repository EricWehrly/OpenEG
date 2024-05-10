import * as THREE from 'three';
import { Tile } from './Tile';
import { TileRenderer } from './TileRenderer';

export class Terrain {
  tiles: Tile[][];

  constructor(width: number, height: number) {
    this.tiles = Array.from({ length: height }, () => Array.from({ length: width }, () => new Tile()));
  }

  render(): THREE.Group {
    const group = new THREE.Group();
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        const tile = this.tiles[y][x];
        const mesh = TileRenderer.render(tile);
        mesh.position.set(x, 0, y);
        group.add(mesh);
      }
    }
    return group;
  }
}
