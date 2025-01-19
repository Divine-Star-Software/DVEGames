import { NCS } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../../Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { VoxelRemoverComponent } from "../../../Core/Components/Voxels/Interaction/VoxelRemover.component";
import { VoxelPlacerComponent } from "../../../Core/Components/Voxels/Interaction/VoxelPlacer.component";
import { Vector3Like } from "@amodx/math";

export const MouseVoxelBuilderSingleToolComponent = NCS.registerComponent({
  type: "mouse-voxel-builder-signle-tool",
  data: NCS.data<() => void>(),
  init(component) {
    const remover = VoxelRemoverComponent.getRequired(component.node)!;
    const placer = VoxelPlacerComponent.getRequired(component.node)!;

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
    const mousePickComponent = VoxelMousePickComponent.getRequired(
      component.node
    );
    const listener = mousePickComponent.data.voxelPicked.listener(
      ({ button, data: { pickedPosition, pickedNormal } }) => {
        if (!enabled) return;
        if (button == 2) {
          remover.data.removeSingle(pickedPosition);
        }
        if (button == 0) {
          placer.data.placeSingle(
            Vector3Like.AddArray(pickedPosition, pickedNormal)
          );
        }
      }
    );
    mousePickComponent.data.voxelPicked.subscribe(listener);
    component.data = () => {
      mousePickComponent.data.voxelPicked.unsubscribe(listener);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  },
  dispose(component) {
    component.data();
  },
});
