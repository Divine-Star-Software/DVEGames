import { DVEFWorldCore } from "@divinevoxel/foundation/Contexts/World/DVEFWorldCore";
import {
  CoreTasksIds,
  RunBuildQueue,
  PlaceVoxelTasks,
  RemoveVoxelTasks,
} from "../CoreTasks.types";
import { MesherTool } from "@divinevoxel/foundation/Default/Tools/Mesher/MesherTool";
import { AdvancedBrush } from "@divinevoxel/foundation/Default/Tools/Brush/AdvancedBrushTool";
export default function (core: DVEFWorldCore) {
  const brush = new AdvancedBrush();
  const mesher = new MesherTool();
  core.TC.registerTasks<RunBuildQueue>(
    CoreTasksIds.RunBuildQueue,
    async ([dim, chunks]) => {
      console.log("BUILD THE CHUNKS", dim, chunks);
      for (const position of chunks) {
        mesher.setLocation([dim, ...position]).buildChunk();
      }
    }
  );
  core.TC.registerTasks<PlaceVoxelTasks>(
    CoreTasksIds.PlaceVoxel,
    async ([dim, [x, y, z], data]) => {
      brush.setDimension(dim);
      brush.setData(data);
      console.warn("PAINT WORLD", x, y, z, dim);
      await brush.setXYZ(x, y, z).paintAndAwaitUpdate();
    }
  );
  core.TC.registerTasks<RemoveVoxelTasks>(
    CoreTasksIds.RemoveVoxel,
    async ([dim, [x, y, z]]) => {
      brush.setDimension(dim);
      await brush.setXYZ(x, y, z).eraseAndAwaitUpdate();
    }
  );
}
