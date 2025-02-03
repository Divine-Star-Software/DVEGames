import { NCS } from "@amodx/ncs";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";

export const VoxelPaintDataComponent = NCS.registerComponent({
  type: "voxel-paint-data",
  schema: NCS.schemaFromObject(PaintVoxelData.Create({})),
});
