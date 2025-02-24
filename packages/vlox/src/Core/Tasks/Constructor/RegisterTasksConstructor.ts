import {
  BuildVoxelTemplateTasks,
  PlaceVoxelAreaTasks,
  RemoveVoxelAreaTasks,
  CoreTasksIds,
} from "../CoreTasks.types";

import { WorldGeneration } from "@divinevoxel/vlox/Tasks/WorldGeneration/WorldGeneration";

import { VoxelTemplate } from "@divinevoxel/vlox/Templates/VoxelTemplate";
import { Threads } from "@amodx/threads";
export default function () {
  const brush = WorldGeneration.getBrush();

  Threads.registerTask<PlaceVoxelAreaTasks>(
    CoreTasksIds.PlaceVoxelArea,
    async ([dim, [sx, sy, sz], [ex, ey, ez], data]) => {
      brush.start(dim, sx, sy, sz);

      brush.setData(data);
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            if (!brush.dataCursor.inBounds(x, y, z)) continue;
            brush.setXYZ(x, y, z).paint();
          }
        }
      }

      brush.runUpdates();
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            if (!brush.dataCursor.inBounds(x, y, z)) continue;
            brush.setXYZ(x, y, z).update();
          }
        }
      }
      brush.runUpdates();
      const buildeQueue = brush.getUpdatedSections();
      brush.stop();
      return [buildeQueue];
    }
  );
  Threads.registerTask<RemoveVoxelAreaTasks>(
    CoreTasksIds.RemoveVoxelArea,
    ([dim, [sx, sy, sz], [ex, ey, ez]]) => {
      brush.start(dim, sx, sy, sz);
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            if (!brush.dataCursor.inBounds(x, y, z)) continue;
            if (!brush.dataCursor.getVoxel(x, y, z)?.isRenderable()) continue;
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
            if (!brush.dataCursor.inBounds(x, y, z)) continue;
            brush.setXYZ(x, y, z).update();
          }
        }
      }
      brush.runUpdates();
      const buildeQueue = brush.getUpdatedSections();
      brush.stop();
      return [buildeQueue];
    }
  );
  Threads.registerTask<BuildVoxelTemplateTasks>(
    CoreTasksIds.BuildTemplate,
    async ([dim, [sx, sy, sz], templateData], onDone) => {
      brush.start(dim, sx, sy, sz);
      const template = new VoxelTemplate(templateData);

      const ex = sx + template.size[0];
      const ey = sy + template.size[1];
      const ez = sz + template.size[2];

      await brush.worldAlloc([sx, sy, sz], [ex, ey, ez]);

      for (const { raw, position } of template.traverse()) {
        raw[1] = 0;
        brush
          .setRaw(raw)
          .setXYZ(position[0] + sx, position[1] + sy, position[2] + sz)
          .paint();
      }

      brush.runUpdates();

      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            if (!brush.dataCursor.inBounds(x, y, z)) continue;
            brush.setXYZ(x, y, z).update();
          }
        }
      }
      brush.runUpdates();
      const buildeQueue = brush.getUpdatedSections();
      brush.stop();
      await brush.worldDealloc([sx, sy, sz], [ex, ey, ez]);
      return [buildeQueue];
    }
  );
}
