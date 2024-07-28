import { NCS, NodeInstance } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../Interaction/VoxelMousePick.component";
import { VoxelRemoverComponent } from "../Interaction/VoxelRemover.component";
import { VoxelPlacerComponent } from "../Interaction/VoxelPlacer.component";
import { Vector3Like } from "@amodx/math";
interface Schema {
}
interface Data {
  readonly node: NodeInstance | null;
}
export const MouseVoxelBuilderComponent = NCS.registerComponent<Schema, Data>({
  type: "mouse-voxel-builder",
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
      ({ button, data: { pickedPosition, pickedNormal } }) => {
        if (!enabled) return;
        if (button == 0) {
          remover.logic.run(pickedPosition);
        }
        if (button == 2) {
          placer.logic.run(Vector3Like.AddArray(pickedPosition, pickedNormal));
        }
      }
    );

    component.observers.disposed.subscribeOnce(() => {

      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    });
  },
});
