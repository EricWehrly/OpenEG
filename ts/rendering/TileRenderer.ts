import * as THREE from 'three';
import { Tile } from '../gameObjects/Tile';
import RendererLayers from './RendererLayers';

export class TileRenderer {
  static scaleFactor = 1;

  static render(tile: Tile): THREE.Group {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // TODO: Cache this
    const material = new THREE.MeshBasicMaterial({ color: tile.getMaterialColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.tile = tile;
    mesh.layers.set(RendererLayers.Floors);
    // mesh.scale.set(TileRenderer.scaleFactor, TileRenderer.scaleFactor, TileRenderer.scaleFactor);

    // Create an outline for the mesh
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: tile.borderColor });
    const outline = new THREE.LineSegments(edges, lineMaterial);
    // outline.scale.set(TileRenderer.scaleFactor, TileRenderer.scaleFactor, TileRenderer.scaleFactor);

    // Group the mesh and outline together
    const group = new THREE.Group();
    group.add(mesh);
    group.add(outline);

    return group;
  }
}
