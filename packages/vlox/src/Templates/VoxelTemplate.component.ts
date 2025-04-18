import { NCS } from "@amodx/ncs/";
import CreateTemplate from "@divinevoxel/vlox/Templates/Archive/Functions/CreateArchivedTemplate";
import RotateTemplate, {
  TemplateRotationAngles,
  TemplateRotationAxes,
} from "@divinevoxel/vlox/Templates/Functions/RotateTemplate";
import FlipTemplate, {
  TemplateFlipDirections,
} from "@divinevoxel/vlox/Templates/Functions/FlipTemplate";
import { VoxelBoxVolumeComponent } from "../Voxels/Volumes/VoxelBoxVolume.component";
import { TransformComponent } from "../Transform.component";
import { FullVoxelTemplate } from "@divinevoxel/vlox/Templates/Full/FullVoxelTemplate";

class Data {
  template: FullVoxelTemplate;
  constructor(public component: (typeof VoxelTemplateComponent)["default"]) {}
  store() {
    /*     FullVoxelTemplate.CreateNewFromArea()
    this.component.data.template = CreateTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        0,
      ...VoxelBoxVolumeComponent.get(this.component.node)!.data.getPoints()
    ); */
  }
  async build() {
    const volume = VoxelBoxVolumeComponent.get(this.component.node)!;
    /*     await CoreTasks.buildTemplate(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        0,
      volume.data.getPoints()[0],
      this.component.data.template.toJSON()
    ); */
  }
  rotate(
    angles: TemplateRotationAngles = 90,
    axes: TemplateRotationAxes = "y"
  ) {
    const transform = TransformComponent.get(this.component.node)!;
    RotateTemplate(this.component.data.template, angles, axes);
    transform.schema.scale.x = this.component.data.template.bounds[0];
    transform.schema.scale.y = this.component.data.template.bounds[1];
    transform.schema.scale.z = this.component.data.template.bounds[2];
  }
  flip(direction: TemplateFlipDirections) {
    FlipTemplate(this.component.data.template, direction);
  }
  async clear() {
    /*     await CoreTasks.removeVoxelArea(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        0,
      ...VoxelBoxVolumeComponent.get(this.component.node)!.data.getPoints()
    ); */
  }
}

export const VoxelTemplateComponent = NCS.registerComponent<Data>({
  type: "voxel-template",
  init: (component) => (component.data = new Data(component.cloneCursor())),
  dispose: (component) => component.data.component.returnCursor(),
});
