import { NCS, NodeInstance } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../../Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { VoxelRemoverComponent } from "../../../Core/Components/Voxels/Interaction/VoxelRemover.component";
import { VoxelPlacerComponent } from "../../../Core/Components/Voxels/Interaction/VoxelPlacer.component";
import { Vector3Like } from "@amodx/math";
interface Schema {}
interface Data {
  readonly node: NodeInstance | null;
}
export const MouseVoxelBuilderSingleToolComponent = NCS.registerComponent<
  Schema,
  Data
>({
  type: "mouse-voxel-builder-signle-tool",
  schema: [],

  init(component) {
    const remover = VoxelRemoverComponent.get(component.node)!;
    const placer = VoxelPlacerComponent.get(component.node)!;

    let enabled = false;

    const keydown = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        enabled = true;
        document.body.style.cursor = "crosshair";
      }
    };

    const keyup = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        enabled = false;
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    VoxelMousePickComponent.get(component.node)!.data.voxelPicked.subscribe(
      component,
      ({ button, data: { pickedPosition, pickedNormal } }) => {
        if (!enabled) return;
        if (button == 0) {
          remover.logic.removeSingle(pickedPosition);
        }
        if (button == 2) {
          placer.logic.placeSingle(
            Vector3Like.AddArray(pickedPosition, pickedNormal)
          );
        }
      }
    );

    component.observers.disposed.subscribeOnce(() => {
      VoxelMousePickComponent.get(component.node)!.data.voxelPicked.unsubscribe(
        component
      );
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    });
  },
});
