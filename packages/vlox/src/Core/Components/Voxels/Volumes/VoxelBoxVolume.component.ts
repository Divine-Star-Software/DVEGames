import { Vec3Array, Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../Base/Transform.component";
type Schema = {};
class Logic {
  constructor(public component: (typeof VoxelBoxVolumeComponent)["default"]) {}
  getPoints(): [start: Vec3Array, end: Vec3Array] {
    const { position, scale } = TransformComponent.get(
      this.component.node
    )!.schema;
    return [
      [position.x, position.y, position.z],
      [position.x + scale.x, position.y + scale.y, position.z + scale.z],
    ];
  }

  setPoints([start, end]: [statrt: Vec3Array, end: Vec3Array]) {
    const transform = TransformComponent.get(this.component.node)!.schema;
    const size: Vec3Array = [
      Math.abs(end[0] - start[0]),
      Math.abs(end[1] - start[1]),
      Math.abs(end[2] - start[2]),
    ];
    transform.position = Vector3Like.FromArray(start);
    transform.scale = Vector3Like.FromArray(size);
  }

  inBounds(x: number, y: number, z: number) {
    const { position, scale } = TransformComponent.get(
      this.component.node
    )!.schema;

    if (x < position.x) return false;
    if (y < position.y) return false;
    if (z < position.z) return false;
    if (x > position.x + scale.x) return false;
    if (y > position.y + scale.y) return false;
    if (z > position.z + scale.z) return false;
    return true;
  }
}

export const VoxelBoxVolumeComponent = NCS.registerComponent<Schema, {}, Logic>(
  {
    type: "voxel-box-volume",
    
    init(component) {
      component.logic =  new Logic(component.cloneCursor());
    },
  }
);
