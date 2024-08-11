import {
  BuildVoxelTemplateTasks,
  PlaceVoxelAreaTasks,
  RemoveVoxelAreaTasks,
  CoreTasksIds,
} from "../CoreTasks.types";

import { WorldGeneration } from "@divinevoxel/foundation/Default/WorldGeneration/WorldGeneration";

import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
import { Threads } from "@amodx/threads";
export default function () {
  const brush = WorldGeneration.getBrush();

  brush.keepTrackOfChunksToBuild = true;
  Threads.registerTasks<PlaceVoxelAreaTasks>(
    CoreTasksIds.PlaceVoxelArea,
    async ([dim, [sx, sy, sz], [ex, ey, ez], data], onDone) => {
      console.warn(
        "place voxel area in constructor",
        brush.keepTrackOfChunksToBuild
      );
      brush.setDimension(dim);
      brush.setData(data);
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            brush.setXYZ(x, y, z).paint();
          }
        }
      }

      console.log("done now doing updates");
      await brush.runUpdates();
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            brush.setXYZ(x, y, z).update();
          }
        }
      }
      const buildeQueue = brush.getUpdatedChunks();
      console.log("all done return qeuue", buildeQueue);
      if (onDone) onDone(buildeQueue);
    },
    "deferred"
  );
  Threads.registerTasks<RemoveVoxelAreaTasks>(
    CoreTasksIds.RemoveVoxelArea,
     ([dim, [sx, sy, sz], [ex, ey, ez]], onDone) => {
      brush.setDimension(dim);
      console.warn(
        "place voxel area in constructor",
        dim,
        [sx, sy, sz],
        [ex, ey, ez],
        brush.keepTrackOfChunksToBuild
      );
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            if (!brush._dt.loadInAt(x, y, z) && brush._dt.isRenderable())
              continue;
            brush.setXYZ(x, y, z).erase();
          }
        }
      }
       brush.runUpdates();
      sx -= 1;
      sy -= 1;
      sz -= 1;
      ex += 1;
      ey += 1;
      ez += 1;
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            brush.setXYZ(x, y, z).update();
          }
        }
      }
      const buildeQueue = brush.getUpdatedChunks();
      console.log("all done return qeuue", buildeQueue);
      if (onDone) onDone(buildeQueue);
    },
    "deferred"
  );
  Threads.registerTasks<BuildVoxelTemplateTasks>(
    CoreTasksIds.BuildTemplate,
    async ([dim, [sx, sy, sz], templateData], onDone) => {
      const template = new VoxelTemplate(templateData);
      brush.setDimension(dim);

      for (const { raw, position } of template.traverse()) {
        raw[1] = 0;
        await brush
          .setRaw(raw)
          .setXYZ(position[0] + sx, position[1] + sy, position[2] + sz)
          .paint();
      }
      const buildeQueue = await brush.runUpdates();
      if (onDone) onDone(buildeQueue);
    },
    "deferred"
  );
}
