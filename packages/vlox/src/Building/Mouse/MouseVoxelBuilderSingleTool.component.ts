import { NCS } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../Interaction/VoxelMousePick.component";
import { Vec3ArrayLike } from "@amodx/math";
import { VoxelPaintDataComponent } from "../../Voxels/VoxelPaintData.component";
import { VoxelUpdateProviderComponent } from "../../Providers/VoxelUpdateProvider.component";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";

export const MouseVoxelBuilderSingleToolComponent = NCS.registerComponent({
  type: "mouse-voxel-builder-signle-tool",
  data: NCS.data<() => void>(),
  init(component) {
    const { updater } = VoxelUpdateProviderComponent.getRequired(
      component.node
    ).data;
    const paintData = VoxelPaintDataComponent.getRequired(component.node);
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
      ({ button, picked }) => {
        if (!enabled) return;
        if (!picked.position || !picked.normal) return;
        const { position, normal } = picked;
        if (button == 2) {
          updater.erase([0, position.x, position.y, position.z], {});
        }
        if (button == 0) {
          updater.paint(
            [
              0,
              ...Vec3ArrayLike.Add(
                [position.x, position.y, position.z],
                [normal.x, normal.y, normal.z]
              ),
            ],
            PaintVoxelData.ToRaw(paintData.schema),
            {}
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
