import { NCS } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { MouseVoxelBuilderBoxToolComponent } from "./Mouse/MouseVoxelBuilderBoxTool.component";
import { MouseVoxelBuilderSingleToolComponent } from "./Mouse/MouseVoxelBuilderSingleTool.component";
import { VoxelPaintDataComponent } from "../../Core/Components/Voxels/VoxelPaintData.component";
import { Observable } from "@amodx/core/Observers";

enum Tools {
  Single = "signle",
  Box = "box",
}

class ComponentSchema {
  tool: Tools = Tools.Single;
}
class Data {
  constructor(public _cleanUp: () => void) {}
}

class Logic {
  voxelPickedObserver = new Observable();
}
export const MouseVoxelBuilderComponent = NCS.registerComponent<
  ComponentSchema,
  {},
  Logic
>({
  type: "mouse-voxel-builder",
  schema: NCS.schemaFromObject(new ComponentSchema()),
  init(component) {
    component.logic = new Logic();
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

    component.schema
      .getCursor()
      .getOrCreateObserver(component.schema.getSchemaIndex().tool)
      .subscribe(() => {
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
          component.logic.voxelPickedObserver.notify();
        }
      }
    );
  },
});
