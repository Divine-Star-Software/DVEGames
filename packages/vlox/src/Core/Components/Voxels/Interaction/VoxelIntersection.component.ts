import { Vec3Array, Vector3Like } from "@amodx/math";
import { WorldCursor } from "@divinevoxel/vlox/World/Cursor/WorldCursor";
import { NCS } from "@amodx/ncs/";
import { DimensionProviderComponent } from "../../Providers/DimensionProvider.component";

class Data {
  pickedPosition: Vec3Array;
  pickedNormal: Vec3Array;
  dataTool = new WorldCursor();
  dimension: (typeof DimensionProviderComponent)["default"];

  constructor(public component: (typeof VoxelInersectionComponent)["default"]) {
    this.dimension = DimensionProviderComponent.getRequired(component.node);
  }
  calculateNormal(
    intersectPoint: Vec3Array,
    voxelMin: Vec3Array,
    voxelMax: Vec3Array
  ): Vec3Array {
    const epsilon = 1e-4;
    let normal: Vec3Array = [0, 0, 0];

    if (Math.abs(intersectPoint[0] - voxelMin[0]) < epsilon) normal = [1, 0, 0];
    else if (Math.abs(intersectPoint[0] - voxelMax[0]) < epsilon)
      normal = [-1, 0, 0];
    else if (Math.abs(intersectPoint[1] - voxelMin[1]) < epsilon)
      normal = [0, 1, 0];
    else if (Math.abs(intersectPoint[1] - voxelMax[1]) < epsilon)
      normal = [0, -1, 0];
    else if (Math.abs(intersectPoint[2] - voxelMin[2]) < epsilon)
      normal = [0, 0, 1];
    else if (Math.abs(intersectPoint[2] - voxelMax[2]) < epsilon)
      normal = [0, 0, -1];

    return normal;
  }

  pick(start: Vec3Array, direction: Vec3Array, length: number) {
    const invDir = direction.map((d) => 1 / d) as Vec3Array;
    const voxelSize = 1.0; // Assuming each voxel is 1x1x1

    this.dataTool.setFocalPoint(this.dimension.schema.dimension, ...start);
    const step = (val: number) => (val > 0 ? 1 : val < 0 ? -1 : 0);
    const tDelta = invDir.map((d) => Math.abs(d) * voxelSize) as Vec3Array;

    let tMax = [
      (Math.floor(start[0]) - start[0] + (direction[0] > 0 ? 1 : 0)) *
        invDir[0],
      (Math.floor(start[1]) - start[1] + (direction[1] > 0 ? 1 : 0)) *
        invDir[1],
      (Math.floor(start[2]) - start[2] + (direction[2] > 0 ? 1 : 0)) *
        invDir[2],
    ] as Vec3Array;

    let pos = start.map(Math.floor) as Vec3Array;
    const stepDir = direction.map(step) as Vec3Array;

    for (let i = 0; i < length; i++) {
      const [tx, ty, tz] = tMax;
      let axis = 0;

      if (tx < ty) {
        if (tx < tz) axis = 0;
        else axis = 2;
      } else {
        if (ty < tz) axis = 1;
        else axis = 2;
      }

      pos[axis] += stepDir[axis];
      tMax[axis] += tDelta[axis];
      const voxel = this.dataTool.getVoxel(...pos);
      if (voxel && voxel.isRenderable()) {
        const voxelMin = pos.map((v) => v * voxelSize) as Vec3Array;
        const voxelMax = voxelMin.map((v) => v + voxelSize) as Vec3Array;
        const intersectPoint = start.map(
          (s, idx) => s + direction[idx] * tMax[axis]
        ) as Vec3Array;

        this.component.data.pickedPosition = pos;
        this.component.data.pickedNormal = this.calculateNormal(
          intersectPoint,
          voxelMin,
          voxelMax
        );

        return {
          voxel: this.dataTool.getVoxel(...pos),
          position: Vector3Like.Create(...pos),
          normal: Vector3Like.Create(...this.component.data.pickedNormal),
        };
      }
    }

    return null;
  }
}

export const VoxelInersectionComponent = NCS.registerComponent({
  type: "voxel-intersection",
  data: NCS.data<Data>(),
  init(component) {
    component.data = new Data(component.cloneCursor());
  },
  dispose(component) {
    component.data.component.returnCursor();
  },
});
