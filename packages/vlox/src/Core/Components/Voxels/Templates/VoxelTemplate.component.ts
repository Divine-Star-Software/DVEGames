import { NCS } from "@amodx/ncs/";
import CreateTemplate from "@divinevoxel/vlox/Templates/Functions/CreateTemplate";
import RotateTemplate, {
  TemplateRotationAngles,
  TemplateRotationAxes,
} from "@divinevoxel/vlox/Templates/Functions/RotateTemplate";
import FlipTemplate, {
  TemplateFlipDirections,
} from "@divinevoxel/vlox/Templates/Functions/FlipTemplate";
import { VoxelTemplate } from "@divinevoxel/vlox/Templates/VoxelTemplate";

import { CoreTasks } from "../../../Tasks/CoreTasks";
import { VoxelBoxVolumeComponent } from "../Volumes/VoxelBoxVolume.component";
import { DimensionProviderComponent } from "../../Providers/DimensionProvider.component";
import { TransformComponent } from "../../../../Core/Components/Base/Transform.component";


class Data {
  template: VoxelTemplate;
}

class Logic {
  constructor(public component: (typeof VoxelTemplateComponent)["default"]) {}
  store() {
    this.component.data.template = CreateTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      ...VoxelBoxVolumeComponent.get(this.component.node)!.logic.getPoints()
    );
  }
  async build() {
    const volume = VoxelBoxVolumeComponent.get(this.component.node)!;
    await CoreTasks.buildTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      volume.logic.getPoints()[0],
      this.component.data.template.toJSON()
    );
  }
  rotate(
    angles: TemplateRotationAngles = 90,
    axes: TemplateRotationAxes = "y"
  ) {
    const transform = TransformComponent.get(this.component.node)!;
    RotateTemplate(this.component.data.template, angles, axes);
    transform.schema.scale.x = this.component.data.template.size[0];
    transform.schema.scale.y = this.component.data.template.size[1];
    transform.schema.scale.z = this.component.data.template.size[2];
  }
  flip(direction: TemplateFlipDirections) {
    FlipTemplate(this.component.data.template, direction);
  }
  async clear() {
    await CoreTasks.removeVoxelArea(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      ...VoxelBoxVolumeComponent.get(this.component.node)!.logic.getPoints()
    );
  }
}

export const VoxelTemplateComponent = NCS.registerComponent<
  {},
  Data,
  Logic
>({
  type: "voxel-template",
  
  init(component) {
    component.logic = new Logic(component.cloneCursor());
  },
});
