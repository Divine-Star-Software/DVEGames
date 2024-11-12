import { NCS, NodeInstance } from "@amodx/ncs";
import { IntProp, StringProp } from "@amodx/schemas";
import { AddVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";

interface Schema extends AddVoxelData {}
interface Data {}
export const VoxelPaintDataComponent = NCS.registerComponent<Schema, Data>({
  type: "voxel-paint-data",
  schema: [
    StringProp("id"),
    StringProp("secondaryId"),
    IntProp("level"),
    IntProp("levelState"),
    IntProp("shapeState"),
    IntProp("mod"),
  ],
});
