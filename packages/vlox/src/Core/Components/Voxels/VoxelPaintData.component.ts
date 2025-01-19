import { NCS } from "@amodx/ncs";
import { PaintVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";
export const VoxelPaintDataComponent = NCS.registerComponent<PaintVoxelData>({
  type: "voxel-paint-data",
  schema: NCS.schema({
    id: NCS.property("dve_air"),
    mod: NCS.property(0),
    shapeState: NCS.property(0),
    level: NCS.property(0),
    levelState: NCS.property(0),
    secondaryVoxelId: NCS.property("dve_air"),
  }),
});
