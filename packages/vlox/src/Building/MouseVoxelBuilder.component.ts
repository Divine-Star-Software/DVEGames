import { NCS } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../Interaction/VoxelMousePick.component";
import { MouseVoxelBuilderBoxToolComponent } from "./Mouse/MouseVoxelBuilderBoxTool.component";
import { MouseVoxelBuilderSingleToolComponent } from "./Mouse/MouseVoxelBuilderSingleTool.component";
import { VoxelPaintDataComponent } from "../Voxels/VoxelPaintData.component";
import { Observable } from "@amodx/core/Observers";
enum Tools {
  Single = "signle",
  Box = "box",
}
export const MouseVoxelBuilderComponent = NCS.registerComponent({
  type: "mouse-voxel-builder",
  schema: NCS.schema({
    tool: NCS.property(Tools.Single, { options: [Tools.Single, Tools.Box] }),
  }),
  data: NCS.data<{
    voxelPickedObserver: Observable;
  }>(),
  init(component) {
    component = component.cloneCursor();
    component.data = {
      voxelPickedObserver: new Observable(),
    };
    const update = () => {
      if (component.schema.tool == Tools.Single) {
        if (MouseVoxelBuilderBoxToolComponent.has(component.node)) {
          MouseVoxelBuilderBoxToolComponent.remove(component.node);
        }
        if (!MouseVoxelBuilderSingleToolComponent.has(component.node)) {
          MouseVoxelBuilderSingleToolComponent.set(component.node);
        }
        return;
      }
      if (component.schema.tool == Tools.Box) {
        if (MouseVoxelBuilderSingleToolComponent.has(component.node)) {
          MouseVoxelBuilderSingleToolComponent.remove(component.node);
        }
        if (!MouseVoxelBuilderBoxToolComponent.has(component.node)) {
          MouseVoxelBuilderBoxToolComponent.set(component.node);
        }
        return;
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
      component.index,
      ({ button, picked }) => {
        if (button == 1) {
          if (!picked.voxel?.isRenderable()) return;
          paintData.schema.id = picked.voxel.getStringId();
          paintData.schema.state = picked.voxel.getState();
          paintData.schema.mod = picked.voxel.getMod();
          component.data.voxelPickedObserver.notify();
        }
      }
    );
  },
});
