import { LocationData } from "@divinevoxel/vlox/Math";
import { GenMap } from "./GenMap";
import { EntityInstance } from "@divinevoxel/vlox-babylon/Tools/EntityInstance";
import { ColumnDataTool } from "@divinevoxel/vlox/Tools/Data/WorldData/ColumnDataTool";
import { ColumnState } from "@divinevoxel/vlox/IWG/Constants/ColumnState";
import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
export class GenMapTile {
  static Tiles: GenMapTile[] = [];
  static columnTool = new ColumnDataTool();

  _instance: EntityInstance;

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
    this.update();
  }

  update() {
    if (!GenMapTile.columnTool.loadInAtLocation(this.location)) {
      this.setColor(1.0, 0.0, 0.0, 1.0); // Red
      setTimeout(() => {
        this.dispose();
      }, 1_000);
      return;
    }
    if (
      GenMapTile.columnTool.getStructValue(ColumnState.GenDone) &&
      GenMapTile.columnTool.getStructValue(ColumnState.DecorDone) &&
      GenMapTile.columnTool.getStructValue(ColumnState.SunDone) &&
      GenMapTile.columnTool.getStructValue(ColumnState.PropagationDone) &&
      DivineVoxelEngineRender.instance.meshRegister.column.get(this.location)
    ) {
      this.setColor(0.0, 1.0, 0.0, 1.0); // Green
      return;
    }
    if (GenMapTile.columnTool.getStructValue(ColumnState.PropagationDone)) {
      this.setColor(0.5, 0.0, 0.5, 1.0); // Purple
      return;
    }
    if (GenMapTile.columnTool.getStructValue(ColumnState.SunDone)) {
      this.setColor(1.0, 1.0, 0.0, 1.0); // Yellow
      return;
    }
    if (GenMapTile.columnTool.getStructValue(ColumnState.DecorDone)) {
      this.setColor(0.0, 0.0, 1.0, 1.0); // Blue
      return;
    }
    if (GenMapTile.columnTool.getStructValue(ColumnState.GenDone)) {
      this.setColor(0.0, 1.0, 1.0, 1.0); // Cyan
      return;
    }

    if (GenMapTile.columnTool.isDirty()) {
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
    GenMapTile.Tiles = GenMapTile.Tiles.filter((_) => _ != this);
    this._instance.destroy();
  }
}

new SafeInterval(() => {
  for (let i = 0; i < GenMapTile.Tiles.length; i++) {
    GenMapTile.Tiles[i].update();
  }
}, 10).start();
