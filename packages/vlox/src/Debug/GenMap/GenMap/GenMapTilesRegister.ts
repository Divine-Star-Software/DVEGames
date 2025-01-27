import { Vector3Like } from "@amodx/math";
import type { Mesh } from "@babylonjs/core";
import { LocationData } from "@divinevoxel/vlox/Math";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
import { GenMapTile } from "./GenMapTile";
import { GenMap } from "./GenMap";
type WorldMapTileRegisterChunk = {
  mesh: Mesh;
};

export type WorldMapTilesRegisterColumn = {
  location: LocationData;
  tile: GenMapTile;
};

export type WorldMapTilesRegisterRegion = {
  columns: Map<number, GenMapTile>;
};
export type WorldMapTileRegisterDimensions = Map<
  string,
  Map<string, WorldMapTilesRegisterRegion>
>;

export class GenMapTilesRegister {
  _dimensions: WorldMapTileRegisterDimensions = new Map();

  constructor(public worldMap: GenMap) {
    this._dimensions.set("main", new Map());
  }

  clearAll() {
    for (const [dkey, dim] of this._dimensions) {
      this.dimensions.remove(dkey);
    }
    this._dimensions.set("main", new Map());
  }

  dimensions = {
    add: (id: string) => {
      const dimesnion = new Map();
      this._dimensions.set(id, dimesnion);
      return dimesnion;
    },
    get: (id: string) => {
      return this._dimensions.get(id);
    },
    remove: (id: string) => {
      const dimension = this._dimensions.get(id);
      if (!dimension) return false;
      dimension.forEach((region) => {
        region.columns.forEach((column) => {});
      });
      this._dimensions.delete(id);
      return true;
    },
  };

  region = {
    add: (location: LocationData) => {
      let dimension = this.dimensions.get(location[0]);
      if (!dimension) {
        dimension = this.dimensions.add(location[0]);
      }
      const region = this.region._getRegionData();
      dimension.set(
        WorldSpaces.region.getKeyXYZ(location[1], location[2], location[3]),
        region
      );
      return region;
    },
    remove: (location: LocationData) => {
      const region = this.region.get(location);
      if (!region) return false;
      const dimension = this.dimensions.get(location[0]);
      if (!dimension) return false;
      dimension.delete(
        WorldSpaces.region.getKeyXYZ(location[1], location[2], location[3])
      );
      region.columns.forEach((column) => {});
      return true;
    },
    _getRegionData: (): WorldMapTilesRegisterRegion => {
      return {
        columns: new Map(),
      };
    },
    get: (location: LocationData) => {
      const dimension = this.dimensions.get(location[0]);
      if (!dimension) return false;
      const region = dimension.get(
        WorldSpaces.region.getKeyXYZ(location[1], location[2], location[3])
      );
      if (!region) return false;
      return region;
    },
  };
  column = {
    add: (location: LocationData) => {
      let region = this.region.get(location);
      if (!region) {
        region = this.region.add(location);
      }
      const columnLocation: LocationData = [
        location[0],
        ...Vector3Like.ToArray(
          WorldSpaces.column.getPositionXYZ(
            location[1],
            location[2],
            location[3]
          )
        ),
      ] as LocationData;
      const column = new GenMapTile(this.worldMap, columnLocation);
      region.columns.set(
        WorldSpaces.column.getIndexXYZ(location[1], location[2], location[3]),
        column
      );
      return column;
    },
    remove: (location: LocationData) => {
      let region = this.region.get(location);
      if (!region) return false;
      const index = WorldSpaces.column.getIndexXYZ(
        location[1],
        location[2],
        location[3]
      );
      const column = region.columns.get(index);
      if (!column) return false;
      column.dispose();
      region.columns.delete(index);
      if (region.columns.size == 0) {
        this.region.remove(location);
      }
      return column;
    },
    get: (location: LocationData) => {
      const region = this.region.get(location);
      if (!region) return false;
      return region.columns.get(
        WorldSpaces.column.getIndexXYZ(location[1], location[2], location[3])
      );
    },
  };
}
