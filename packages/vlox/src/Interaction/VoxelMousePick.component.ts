import { NCS } from "@amodx/ncs/";
import { VoxelInersectionComponent } from "./VoxelIntersection.component";
import { Observable } from "@amodx/core/Observers";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { Vector3Like } from "@amodx/math";
import { BabylonContext } from "../Babylon/Babylon.context";
import { VoxelPickResult } from "@divinevoxel/vlox/Voxels/Interaction/VoxelPickResult";
export const VoxelMousePickComponent = NCS.registerComponent({
  type: "voxel-mouse-pick",
  data: NCS.data<{
    voxelPicked: Observable<{
      button: number;
      picked: VoxelPickResult;
    }>;
    _cleanUp: () => void;
  }>(),
  init(component) {
    const intersection = VoxelInersectionComponent.get(component.node)!;

    const { scene, engine } = BabylonContext.getRequired(component.node).data;

    const canvas = engine.getRenderingCanvas()!;

    const listener = (evt: MouseEvent) => {
      const camera = scene.activeCamera!;

      const pickRay = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        camera
      );

      const length = 100;

      const picked = intersection.data.pick(
        Vector3Like.ToArray(pickRay.origin),
        Vector3Like.ToArray(pickRay.direction),
        length
      );

      if (picked?.voxel) {
        component.data.voxelPicked.notify({
          button: evt.button,
          picked,
        });
      }
    };

    canvas.addEventListener("pointerdown", listener);

    component.data = {
      voxelPicked: new Observable(),
      _cleanUp: () => {
        canvas.removeEventListener("pointerdown", listener);
      },
    };
  },
  dispose: (component) => component.data._cleanUp(),
});
