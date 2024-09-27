import { NCS, NodeInstance } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { SelectProp } from "@amodx/schemas";
import { MouseVoxelBuilderBoxToolComponent } from "./Mouse/MouseVoxelBuilderBoxTool.component";
import { MouseVoxelBuilderSingleToolComponent } from "./Mouse/MouseVoxelBuilderSingleTool.component";
import { VoxelPaintDataComponent } from "../../Core/Components/Voxels/VoxelPaintData.component";

enum Tools {
  Single = "signle",
  Box = "box",
}

interface Schema {
  tool: Tools;
}
interface Data {
  readonly node: NodeInstance | null;
}
export const MouseVoxelBuilderComponent = NCS.registerComponent<Schema, Data>({
  type: "mouse-voxel-builder",
  schema: [
    SelectProp("tool", {
      value: Tools.Single,
      options: [Tools.Single, Tools.Box],
    }),
  ],

  init(component) {
    const update = () => {
      if (component.schema.tool == Tools.Single) {
        if (MouseVoxelBuilderBoxToolComponent.get(component.node)) {
          MouseVoxelBuilderBoxToolComponent.remove(component.node);
        }
        MouseVoxelBuilderSingleToolComponent.set(component.node);
      }
      if (component.schema.tool == Tools.Box) {
        if (MouseVoxelBuilderSingleToolComponent.get(component.node)) {
          MouseVoxelBuilderSingleToolComponent.remove(component.node);
        }
        MouseVoxelBuilderBoxToolComponent.set(component.node);
      }
    };

    update();

    component.addOnSchemaUpdate(["tool"], () => {
      update();
    });

    const paintData = VoxelPaintDataComponent.get(component.node)!;

    VoxelMousePickComponent.get(component.node)!.data.voxelPicked.subscribe(
      component,
      ({ button, data: { dataTool } }) => {
        if (button == 1) {
          if (!dataTool.isRenderable()) return;
          paintData.schema.id = dataTool.getStringId();
          paintData.schema.shapeState = dataTool.getShapeState();
          paintData.schema.mod = dataTool.getMod();
        }
      }
    );
  },
});
