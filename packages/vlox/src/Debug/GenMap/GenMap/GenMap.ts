import { GenMapTile } from "./GenMapTile";
import { GenMapTilesRegister } from "./GenMapTilesRegister";
import { EntityTool } from "@divinevoxel/vlox-babylon/Tools/EntityTool";
import {
  Scene,
  Mesh,
  VertexBuffer,
  StandardMaterial,
  ShaderMaterial,
} from "@babylonjs/core";
import { LocationData } from "@divinevoxel/vlox/Math";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { MooreNeighborhood2D } from "@divinevoxel/vlox/Math/CardinalNeighbors.js";
import { Distance3D, Vec3Array, Vector3Like } from "@amodx/math";
import { GenMapTileMaterial } from "./GenMapTileMaterial";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { Quad } from "./Quad";

const tempPosition = Vector3Like.Create();
export class GenMap {
  static Constants = {
    MAX_TILES: 2_000,
  };

  tilesRegister = new GenMapTilesRegister(this);

  tilesMaterial: ShaderMaterial;

  _colorBuffer: Float32Array;
  _instanceTool: EntityTool;
  _instanceMesh: Mesh;
  _previousLocation: LocationData;
  _searchQueue: number[] = [];
  _lastPosition = Vector3Like.Create(-Infinity, -Infinity, -Infinity);
  _visitedMap: Map<string, boolean> = new Map();
  constructor() {}

  init(scene: Scene) {
    const quadData = Quad.GetQuad();
    this._instanceMesh = new Mesh("world-map-tile-base", scene);
    this._instanceMesh.setVerticesData(
      VertexBuffer.PositionKind,
      quadData.positions
    );
    this._instanceMesh.setVerticesData(
      VertexBuffer.NormalKind,
      quadData.normals
    );
    this._instanceMesh.setVerticesData(VertexBuffer.UVKind, quadData.uvs);
    this._instanceMesh.setVerticesData(VertexBuffer.UVKind, quadData.uvs);
    this._instanceMesh.setIndices(quadData.indicies);
    this._instanceTool = new EntityTool(this._instanceMesh);
    this._instanceMesh.alwaysSelectAsActiveMesh = true;
    this.tilesMaterial = GenMapTileMaterial.create(scene);
    this._instanceMesh.material = this.tilesMaterial;
    this._instanceTool.setInstanceAmount(GenMap.Constants.MAX_TILES);

    const colorBuffer = new Float32Array(GenMap.Constants.MAX_TILES * 4);

    this._instanceTool.mesh.thinInstanceSetBuffer(
      "tileColor",
      colorBuffer,
      4,
      false
    );
    this._colorBuffer = colorBuffer;
  }

  _removed =  new Set<GenMapTile>();
  updateTiles(location: LocationData) {
    if (!this._previousLocation) {
      this._previousLocation = [...location];
    }

    WorldSpaces.sector.getPosition(location[1], 0, location[3], tempPosition);
    const worldColumnPOSX = tempPosition.x;
    const worldColumnPOSY = tempPosition.y;
    const worldColumnPOSZ = tempPosition.z;


    let needActiveUpdate = true;
    if (
      this._lastPosition.x == worldColumnPOSX &&
      this._lastPosition.y == worldColumnPOSY &&
      this._lastPosition.z == worldColumnPOSZ
    ) {
      needActiveUpdate = false;
    }
    this._lastPosition.x = worldColumnPOSX;
    this._lastPosition.y = worldColumnPOSY;
    this._lastPosition.z = worldColumnPOSZ;

    for (let i = 0; i < GenMapTile.Tiles.length; i++) {
      GenMapTile.Tiles[i].update();
      if (needActiveUpdate) {
        const distance = Distance3D(
          worldColumnPOSX,
          0,
          worldColumnPOSZ,
          ...GenMapTile.Tiles[i].position
        );
        if (distance > 300) {
          this._removed.add(GenMapTile.Tiles[i]);
        }
      }
    }

    if (!needActiveUpdate) {
      this._instanceTool.mesh.thinInstanceBufferUpdated("tileColor");
      return;
    }
    this._searchQueue.push(worldColumnPOSX, worldColumnPOSY, worldColumnPOSZ);

    while (this._searchQueue.length) {
      const cx = this._searchQueue.shift()!;
      const cy = this._searchQueue.shift()!;
      const cz = this._searchQueue.shift()!;

      const sectorKey = WorldSpaces.hash.hashXYZ(cx, cy, cz);
      if (this._visitedMap.has(sectorKey)) continue;
      this._visitedMap.set(sectorKey, true);

      const distance = Distance3D(
        worldColumnPOSX,
        worldColumnPOSY,
        worldColumnPOSZ,
        cx,
        cy,
        cz
      );
      if (distance > 300) continue;

      if (!this.tilesRegister.sectors.get(location[0], cx, cy, cz)) {
        this.tilesRegister.sectors.add(location[0], cx, cy, cz);
      }

      for (const n of MooreNeighborhood2D) {
        const nx = cx + n[0] * WorldSpaces.sector.bounds.x;
        const nz = cz + n[1] * WorldSpaces.sector.bounds.z;
        const columnPOS = WorldSpaces.sector.getPosition(
          nx,
          cy,
          nz,
          tempPosition
        );
        this._searchQueue.push(columnPOS.x, columnPOS.y, columnPOS.z);
      }
    }

    this._visitedMap.clear();

    if (GenMapTile.Tiles.length && this._removed.size) {
      for (let i = GenMapTile.Tiles.length - 1; i > -1; i--) {
        const tile = GenMapTile.Tiles[i];
        if (this._removed.has(tile)) {
          this.tilesRegister.sectors.remove(tile.dimensonId, ...tile.position);
          GenMapTile.Tiles.splice(i, 1);
        }
      }
    }

    this._removed.clear();
    this._instanceTool.mesh.thinInstanceBufferUpdated("tileColor");
    this._instanceTool.mesh.thinInstanceBufferUpdated("matrix");
  }
  dispose() {
    this._instanceMesh.dispose();
  }
}
