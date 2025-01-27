import { LocationData } from "@divinevoxel/vlox/Math";
import { GenMap } from "./GenMap";
import { EntityInstance } from "@divinevoxel/vlox-babylon/Tools/EntityInstance";
import { ColumnStructIds } from "@divinevoxel/vlox/World/Column/ColumnStructIds";
import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { Column } from "@divinevoxel/vlox/World/Column";
export class GenMapTile {
  static Tiles: GenMapTile[] = [];

  _instance: EntityInstance;
  _dispoed = false;

  constructor(
    public worldMap: GenMap,
    public location: LocationData
  ) {
    const instance = this.worldMap._instanceTool.getInstance();
    if (!instance) {
      console.warn(`Could not load tile instance for ${location}`);
    } else {
      this._instance = instance;
    }
    GenMapTile.Tiles.push(this);
    this._instance.position.set(location[1], location[2], location[3]);
    this._instance.scale.set(1, 1, 1);
    this.update();
  }

  update() {
    if (this._dispoed) return;
    WorldRegister.setDimension(this.location[0]);
    const colunn = WorldRegister.column.get(this.location[1],this.location[2],this.location[3]);
    if (!colunn) {
      this._dispoed = true;
      this.setColor(1.0, 0.0, 0.0, 1.0); // Red
      GenMapTile.Tiles = GenMapTile.Tiles.filter((_) => _ != this);
      setTimeout(() => {
        this._instance.destroy();
      }, 1_000);
      return;
    }

    Column.StateStruct.setData(colunn.columnState);
    if (
      Column.StateStruct.getProperty(ColumnStructIds.isWorldGenDone) &&
      Column.StateStruct.getProperty(ColumnStructIds.isWorldDecorDone) &&
      Column.StateStruct.getProperty(ColumnStructIds.isWorldSunDone) &&
      Column.StateStruct.getProperty(
        ColumnStructIds.isWorldPropagationDone
      ) &&
      DivineVoxelEngineRender.instance.meshRegister.column.get(this.location)
    ) {
      this.setColor(0.0, 1.0, 0.0, 1.0); // Green
      return;
    }
    if (
      Column.StateStruct.getProperty(
        ColumnStructIds.isWorldPropagationDone
      )
    ) {
      this.setColor(0.5, 0.0, 0.5, 1.0); // Purple
      return;
    }
    if (Column.StateStruct.getProperty(ColumnStructIds.isWorldSunDone)) {
      this.setColor(1.0, 1.0, 0.0, 1.0); // Yellow
      return;
    }
    if (
      Column.StateStruct.getProperty(ColumnStructIds.isWorldDecorDone)
    ) {
      this.setColor(0.0, 0.0, 1.0, 1.0); // Blue
      return;
    }
    if (Column.StateStruct.getProperty(ColumnStructIds.isWorldGenDone)) {
      this.setColor(0.0, 1.0, 1.0, 1.0); // Cyan
      return;
    }

    if (Column.StateStruct.getProperty(ColumnStructIds.isDirty)) {
      this.setColor(0.0, 0.0, 1.0, 1.0); // Blue
      return;
    }
  }

  setColor(r: number, g: number, b: number, a = 1) {
    let index = this._instance.index * 4;
    this.worldMap._colorBuffer[index] = r;
    this.worldMap._colorBuffer[index + 1] = g;
    this.worldMap._colorBuffer[index + 2] = b;
    this.worldMap._colorBuffer[index + 3] = a;
  }
  dispose() {
    this._dispoed = true;
    GenMapTile.Tiles = GenMapTile.Tiles.filter((_) => _ != this);
    this._instance.destroy();
  }
}

new SafeInterval(() => {
  for (let i = 0; i < GenMapTile.Tiles.length; i++) {
    GenMapTile.Tiles[i].update();
  }
}, 10).start();
