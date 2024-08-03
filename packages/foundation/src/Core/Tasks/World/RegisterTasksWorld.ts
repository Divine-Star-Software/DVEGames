import { DVEFWorldCore } from "@divinevoxel/foundation/Contexts/World/DVEFWorldCore";
import {
  BuildVoxelTemplateTasks,
  PlaceVoxelWorldTasks,
  RemoveVoxelWorldTasks,
  WorldTasks,
} from "../Types/WorldTask.types";

import { AdvancedBrush } from "@divinevoxel/foundation/Default/Tools/Brush/AdvancedBrushTool";
import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
export default function (core: DVEFWorldCore) {
  const brush = new AdvancedBrush();

  core.TC.registerTasks<PlaceVoxelWorldTasks>(
    WorldTasks.PlaceVoxel,
    async ([dim, [sx, sy, sz], [ex, ey, ez], data]) => {
      brush.setDimension(dim);
      brush.setData(data);
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            await brush.setXYZ(x, y, z).paintAndAwaitUpdate();
          }
        }
      }
    }
  );
  core.TC.registerTasks<RemoveVoxelWorldTasks>(
    WorldTasks.RemoveVoxel,
    async ([dim, [sx, sy, sz], [ex, ey, ez]]) => {
      brush.setDimension(dim);
      for (let x = sx; x < ex; x++) {
        for (let y = sy; y < ey; y++) {
          for (let z = sz; z < ez; z++) {
            await brush.setXYZ(x, y, z).eraseAndAwaitUpdate();
          }
        }
      }
    }
  );
  core.TC.registerTasks<BuildVoxelTemplateTasks>(
    WorldTasks.BuildTemplate,
    async ([dim, [sx, sy, sz], templateData]) => {

      const template = new VoxelTemplate(templateData);
      console.log("BUILD THE TEMPLATE",dim,template,[sx,sy,sz]);
      brush.setDimension(dim);

      for (const { raw, position } of template.traverse()) {
        raw[1] = 0;
        await brush
          .setRaw(raw)
          .setXYZ(position[0] + sx, position[1] + sy, position[2] + sz)
          .paintAndAwaitUpdate();
      }
    }
  );
}
