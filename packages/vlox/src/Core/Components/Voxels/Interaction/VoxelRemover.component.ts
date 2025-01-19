import { NCS } from "@amodx/ncs/";
import { CoreTasks } from "../../../Tasks/CoreTasks";
import { Vec3Array } from "@amodx/math";
import { DimensionProviderComponent } from "../../Providers/DimensionProvider.component";

class Data {
  constructor(public component: (typeof VoxelRemoverComponent)["default"]) {}
  async removeArea(start: Vec3Array, end?: Vec3Array) {
    await CoreTasks.removeVoxelArea(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start,
      end || [start[0] + 1, start[1] + 1, start[2] + 1]
    );
  }
  async removeSingle(start: Vec3Array) {
    await CoreTasks.removeVoxel(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start
    );
  }
}

export const VoxelRemoverComponent = NCS.registerComponent<Data>({
  type: "voxel-remover",
  init: (component) => (component.data = new Data(component.cloneCursor())),
  dispose: (component) => component.data.component.returnCursor(),
});
