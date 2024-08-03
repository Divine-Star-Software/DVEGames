import { NCS } from "@amodx/ncs/";

import { Tasks } from "../../../Tasks/Tasks";
import { Vec3Array } from "@amodx/math";
import { DimensionProviderComponent } from "../../Base/DimensionProvider.component";

interface Schema {}
class Data {}

class Logic {
  constructor(public component: (typeof VoxelRemoverComponent)["default"]) {}

  async run(start: Vec3Array, end?: Vec3Array) {
    await Tasks.removeVoxel(
      DimensionProviderComponent.get(this.component.node)?.schema.dimension ||
        "main",
      start,
      end || [start[0] + 1, start[1] + 1, start[2] + 1]
    );
  }
}

export const VoxelRemoverComponent = NCS.registerComponent<Schema, Data, Logic>(
  {
    type: "voxel-remover",
    schema: [],
    data: () => new Data(),
    logic: (component): Logic => new Logic(component),
  }
);
