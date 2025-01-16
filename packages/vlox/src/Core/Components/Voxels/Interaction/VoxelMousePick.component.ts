import { NCS } from "@amodx/ncs/";
import { VoxelInersectionComponent } from "./VoxelIntersection.component";
import { Observable } from "@amodx/core/Observers";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { Vector3Like } from "@amodx/math";
import { BabylonContext } from "../../../../Babylon/Contexts/Babylon.context";

class Data {
  dimension: string;
  voxelPicked = new Observable<{
    button: number;
    data: (typeof VoxelInersectionComponent)["default"]["data"];
  }>();
  constructor(public _cleanUp: () => void) {}
}

export const VoxelMousePickComponent = NCS.registerComponent<{}, Data>({
  type: "voxel-mouse-pick",

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

      const picked = intersection.logic.pick(
        Vector3Like.ToArray(pickRay.origin),
        Vector3Like.ToArray(pickRay.direction),
        length
      );

      if (picked) {
        component.data.voxelPicked.notify({
          button: evt.button,
          data: intersection.data,
        });
      }
    };

    canvas.addEventListener("pointerdown", listener);

    component.data = new Data(() => {
      canvas.removeEventListener("pointerdown", listener);
    });
  },
  dispose(component) {
    component.data._cleanUp();

  },

});
