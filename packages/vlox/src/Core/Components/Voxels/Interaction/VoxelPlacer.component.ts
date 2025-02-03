import { NCS } from "@amodx/ncs/";
import { CoreTasks } from "../../../Tasks/CoreTasks";
import { Vec3Array } from "@amodx/math";
import { VoxelPaintDataComponent } from "../VoxelPaintData.component";
import { DimensionProviderComponent } from "../../Providers/DimensionProvider.component";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";

class Data {
  constructor(public component: (typeof VoxelPlacerComponent)["default"]) {}

  async placeArea(
    start: Vec3Array,
    end: Vec3Array,
    data?: Partial<PaintVoxelData>
  ) {
    await CoreTasks.placeVoxelArea(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start,
      end || [start[0] + 1, start[1] + 1, start[2] + 1],
      data || VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
  }
  async placeSingle(start: Vec3Array, data?: Partial<PaintVoxelData>) {
    console.error(
      "place voxel data",
      VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
    await CoreTasks.placeVoxel(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start,
      data || VoxelPaintDataComponent.get(this.component.node)!.schema.toJSON()
    );
  }
}

export const VoxelPlacerComponent = NCS.registerComponent({
  type: "voxel-placer",
  data: NCS.data<Data>(),
  init: (component) => (component.data = new Data(component.cloneCursor())),
  dispose: (component) => component.data.component.returnCursor(),
});
