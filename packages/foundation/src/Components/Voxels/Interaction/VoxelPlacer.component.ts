import { ComponentData, NCS } from "@amodx/ncs/";
import { Tasks } from "../../../Tasks/Tasks";
import { Vec3Array } from "@amodx/math";
import { StringProp } from "@amodx/schemas";
import { VoxelPaintDataComponent } from "../VoxelPaintData.component";
import { DimensionProviderComponent } from "../../Base/DimensionProvider.component";

interface Schema {}

class Logic {
  constructor(public component: (typeof VoxelPlacerComponent)["default"]) {}

  async run(position: Vec3Array) {
    console.log(
      VoxelPaintDataComponent.get(this.component.node)!.schema,
      VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
    await Tasks.placeVoxel(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      position,
      [position[0] + 1, position[1] + 1, position[2] + 1],
      VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
  }
}

export const VoxelPlacerComponent = NCS.registerComponent<Schema, {}, Logic>({
  type: "voxel-placer",
  schema: [StringProp("dimension")],
  logic: (component): Logic => new Logic(component),
});
