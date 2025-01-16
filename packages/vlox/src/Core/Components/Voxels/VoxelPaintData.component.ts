import { NCS } from "@amodx/ncs";
import { PaintVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";

class Schema implements PaintVoxelData {
  id: string = "dve_air";
  mod: number = 0;
  shapeState: number = 0;
  level: number = 0;
  levelState: number = 0;
  secondaryVoxelId: string = "dve_air";
}
interface Data {}
export const VoxelPaintDataComponent = NCS.registerComponent<Schema, Data>({
  type: "voxel-paint-data",
  schema: NCS.schemaFromObject(new Schema()),
});
