import { ComponentData, NCS } from "@amodx/ncs/";
import { VoxelTemplator } from "@divinevoxel/foundation/Default/Templates/VoxelTemplator";
import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
import { Tasks } from "../../../Tasks/Tasks";
import { VoxelCubeVolumeComponent } from "../Volumes/VoxelCubeVolume.component";
import { DimensionProviderComponent } from "../../Base/DimensionProvider.component";

type Schema = {};
class Data {
  template: VoxelTemplate;
}

class Logic {
  constructor(public component: (typeof VoxelTemplateComponent)["default"]) {}

  store() {
    const volume = VoxelCubeVolumeComponent.get(this.component.node)!;
    this.component.data.template = VoxelTemplator.createTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      ...volume.logic.getPoints()
    );
  }
  async build(template: VoxelTemplate) {
    const volume = VoxelCubeVolumeComponent.get(this.component.node)!;
    await Tasks.buildTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      volume.logic.getPoints()[0],
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
  data: () => new Data(),
  logic: (component): Logic => new Logic(component),
});