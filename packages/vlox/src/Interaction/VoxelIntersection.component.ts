import { Vec3Array } from "@amodx/math";
import { WorldCursor } from "@divinevoxel/vlox/World/Cursor/WorldCursor";
import { NCS } from "@amodx/ncs/";
import { DimensionProviderComponent } from "../Providers/DimensionProvider.component";
import PickVoxel from "@divinevoxel/vlox/Voxels/Interaction/Functions/PickVoxel";

class Data {
  origin: Vec3Array;
  originDirection: Vec3Array;
  pickedPosition: Vec3Array;
  pickedNormal: Vec3Array;
  dataTool = new WorldCursor();
  dimension: (typeof DimensionProviderComponent)["default"];

  constructor(public component: (typeof VoxelInersectionComponent)["default"]) {
    this.dimension = DimensionProviderComponent.getRequired(component.node);
  }

  pick(start: Vec3Array, direction: Vec3Array, length: number) {
    return PickVoxel(this.dataTool, start, direction, length);
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
