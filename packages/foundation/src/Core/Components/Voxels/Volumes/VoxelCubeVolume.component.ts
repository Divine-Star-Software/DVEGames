import { Vec3Array, Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../Base/Transform.component";
type Schema = {};
class Logic {
  constructor(public component: (typeof VoxelCubeVolumeComponent)["default"]) {}
  getPoints(): [Vec3Array, Vec3Array] {
    const { position, scale } = TransformComponent.get(
      this.component.node
    )!.schema;
    return [
      [position.x, position.y, position.z],
      [position.x + scale.x, position.y + scale.y, position.z + scale.z],
    ];
  }

  setPoints([start, end]: [Vec3Array, Vec3Array]) {
    const transform = TransformComponent.get(this.component.node)!.schema;
    const size: Vec3Array = [
      Math.abs(end[0] - start[0]),
      Math.abs(end[1] - start[1]),
      Math.abs(end[2] - start[2]),
    ];
    transform.position = Vector3Like.FromArray(start);
    transform.scale = Vector3Like.FromArray(size);
  }
}

export const VoxelCubeVolumeComponent = NCS.registerComponent<
  Schema,
  {},
  Logic
>({
  type: "voxel-cube-volume",
  schema: [],
  logic: (component): Logic => new Logic(component),
});
