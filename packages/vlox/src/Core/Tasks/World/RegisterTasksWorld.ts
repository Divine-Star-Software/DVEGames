import { DivineVoxelEngineWorld } from "@divinevoxel/vlox/Contexts/World/DivineVoxelEngineWorld";
import {
  CoreTasksIds,
  RunBuildQueue,
  PlaceVoxelTasks,
  RemoveVoxelTasks,
} from "../CoreTasks.types";
import { MesherTool } from "@divinevoxel/vlox/Tools/Mesher/MesherTool";
import { AdvancedBrush } from "@divinevoxel/vlox/Tools/Brush/AdvancedBrushTool";
export default function (core: DivineVoxelEngineWorld) {
  const brush = new AdvancedBrush();
  const mesher = new MesherTool();
  core.TC.registerTasks<RunBuildQueue>(
    CoreTasksIds.RunBuildQueue,
    async ([dim, chunks]) => {
      for (const position of chunks) {
        mesher.setLocation([dim, ...position]).buildChunk();
      }
    }
  );
  core.TC.registerTasks<PlaceVoxelTasks>(
    CoreTasksIds.PlaceVoxel,
    async ([dim, [x, y, z], data]) => {
      brush.start(dim, x, y, z);
      brush.setData(data);
      await brush.setXYZ(x, y, z).paintAndAwaitUpdate();
      brush.stop();
    }
  );
  core.TC.registerTasks<RemoveVoxelTasks>(
    CoreTasksIds.RemoveVoxel,
    async ([dim, [x, y, z]]) => {
      brush.start(dim, x, y, z);
      await brush.setXYZ(x, y, z).eraseAndAwaitUpdate();
      brush.stop();
    }
  );
}
