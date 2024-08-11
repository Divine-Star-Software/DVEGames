import { NCS } from "@amodx/ncs/";
import { VoxelTemplator } from "@divinevoxel/foundation/Default/Templates/VoxelTemplator";
import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
import { CoreTasks } from "../../../Tasks/CoreTasks";
import { VoxelBoxVolumeComponent } from "../Volumes/VoxelBoxVolume.component";
import { DimensionProviderComponent } from "../../Providers/DimensionProvider.component";

type Schema = {};
class Data {
  template: VoxelTemplate;
}

class Logic {
  constructor(public component: (typeof VoxelTemplateComponent)["default"]) {}

  store() {
    const volume = VoxelBoxVolumeComponent.get(this.component.node)!;
    this.component.data.template = VoxelTemplator.createTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      ...volume.logic.getPoints()
    );
  }
  async build(template: VoxelTemplate) {
    const volume = VoxelBoxVolumeComponent.get(this.component.node)!;
    await CoreTasks.buildTemplate(
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
