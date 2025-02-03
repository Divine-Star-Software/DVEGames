import { DivineVoxelEngineWorld } from "@divinevoxel/vlox/Contexts/World/DivineVoxelEngineWorld";
import {
  CoreTasksIds,
  RunBuildQueue,
  PlaceVoxelTasks,
  RemoveVoxelTasks,
} from "../CoreTasks.types";
import { TaskTool } from "@divinevoxel/vlox/Tools/Tasks/TasksTool";
import { AdvancedBrush } from "@divinevoxel/vlox/Tools/Brush/AdvancedBrushTool";
import { Threads } from "@amodx/threads";
export default function (DVEW: DivineVoxelEngineWorld) {
  const tasks = new TaskTool(DVEW.threads.constructors);
  const brush = new AdvancedBrush(tasks);
  DVEW.TC.registerTask<RunBuildQueue>(
    CoreTasksIds.RunBuildQueue,
    async ([dim, sections]) => {
      for (const position of sections) {
        tasks.build.section.run([dim, ...position]);
      }
    }
  );
  DVEW.TC.registerTask<PlaceVoxelTasks>(
    CoreTasksIds.PlaceVoxel,
    async ([dim, [x, y, z], data]) => {
      brush.start(dim, x, y, z);
      console.warn("set the data", {...data});
 
      brush.setData(data);
      console.log(structuredClone(brush.getData()));
      await brush.setXYZ(x, y, z).paintAndAwaitUpdate();


      brush.stop();
    }
  );
  DVEW.TC.registerTask<RemoveVoxelTasks>(
    CoreTasksIds.RemoveVoxel,
    async ([dim, [x, y, z]]) => {
      brush.start(dim, x, y, z);
      await brush.setXYZ(x, y, z).eraseAndAwaitUpdate();
      brush.stop();
    }
  );
  DVEW.TC.registerTask<RunBuildQueue>(
    "build-queue",
    async ([dim, sections]) => {
      for (const position of sections) {
        tasks.build.section.run([dim, ...position]);
      }
    }
  );
}
