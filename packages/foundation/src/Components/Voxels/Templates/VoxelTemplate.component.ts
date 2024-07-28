import { ComponentData, NCS } from "@amodx/ncs/";
import { StringProp } from "@amodx/schemas";
import { VoxelTemplator } from "@divinevoxel/foundation/Default/Templates/VoxelTemplator";
import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
import { TransformComponent } from "../../Base/Transform.component";
import { Tasks } from "../../../Tasks/Tasks";
import { Vec3Array } from "@amodx/math";

interface Schema {
  dimension: string;
}
class Data {
  template: VoxelTemplate;
}

class Logic {
  constructor(public component: (typeof VoxelTemplateComponent)["default"]) {}

  store() {
    const { position, scale } = TransformComponent.get(
      this.component.node
    )!.schema;
    const { dimension } = this.component.schema;
    this.component.data.template = VoxelTemplator.createTemplate(
      dimension,
      [
        position.x - scale.x / 2,
        position.y - scale.y / 2,
        position.z - scale.z / 2,
      ],
      [
        position.x + scale.x / 2,
        position.y + scale.y / 2,
        position.z + scale.z / 2,
      ]
    );
  }
  async build(template: VoxelTemplate) {
    const { position, scale } = TransformComponent.get(
      this.component.node
    )!.schema;
    await Tasks.buildTemplate(
      this.component.schema.dimension,
      [
        position.x - scale.x / 2,
        position.y - scale.y / 2,
        position.z - scale.z / 2,
      ],
      template.toJSON()
    );
  }
}

export const VoxelTemplateComponent = NCS.registerComponent<
  Schema,
  Data,
  Logic
>({
  type: "voxel-template",
  schema: [StringProp("dimension")],
  data: () => new Data(),
  logic: (component): Logic => new Logic(component),
});
