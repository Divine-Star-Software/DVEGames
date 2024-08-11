import { ComponentData, NCS } from "@amodx/ncs/";
import { CoreTasks } from "../../../Tasks/CoreTasks";
import { Vec3Array } from "@amodx/math";
import { StringProp } from "@amodx/schemas";
import { VoxelPaintDataComponent } from "../VoxelPaintData.component";
import { DimensionProviderComponent } from "../../Providers/DimensionProvider.component";

interface Schema {}

class Logic {
  constructor(public component: (typeof VoxelPlacerComponent)["default"]) {}

  async placeArea(start: Vec3Array, end?: Vec3Array) {
    await CoreTasks.placeVoxelArea(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start,
      end || [start[0] + 1, start[1] + 1, start[2] + 1],
      VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
  }
  async placeSingle(start: Vec3Array) {
    await CoreTasks.placeVoxel(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start,
      VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
  }
}

export const VoxelPlacerComponent = NCS.registerComponent<Schema, {}, Logic>({
  type: "voxel-placer",
  schema: [StringProp("dimension")],
  logic: (component): Logic => new Logic(component),
});
