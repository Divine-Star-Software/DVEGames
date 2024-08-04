import { Vector3 } from "@babylonjs/core";
import { NCS } from "@amodx/ncs/";
import { StringProp } from "@amodx/schemas";
import { CameraProviderComponent } from "../../Babylon/Components/Providers/CameraProvider.component";
import { BabylonContext } from "../../Babylon/Contexts/Babylon.context";
class Data {
  forwardDirection = new Vector3();
  sideDirection = new Vector3();
  forwardXZDirection = new Vector3();
}
interface CameraDirectionTraitSchema {
  meshId?: string;
}
export const CameraDirectionTrait = NCS.registerTrait<
  CameraDirectionTraitSchema,
  Data
>({
  type: "camera-direction",
  schema: [StringProp("position")],
  data: () => new Data(),
  init(trait) {
    const node = trait.getNode();
    const { scene } = BabylonContext.getRequired(node)!.data;

    const cameraComponent = CameraProviderComponent.get(node)!;

    const forwardDirection = trait.data.forwardDirection;
    const sideDirection = trait.data.sideDirection;
    const forwardXZDirection = trait.data.forwardXZDirection;

    const forward = Vector3.Forward();
    const right = Vector3.Right();
    const directionUpdate = () => {
      const camera = cameraComponent.data.camera;
      if (!camera) return;
      camera.getDirectionToRef(forward, forwardDirection);
      camera.getDirectionToRef(right, sideDirection);
      forwardXZDirection
        .set(forwardDirection.x, 0, forwardDirection.z)
        .normalize();
      sideDirection.set(sideDirection.x, 0, sideDirection.z).normalize();
    };

    scene.registerBeforeRender(directionUpdate);

    trait.observers.disposed.subscribe(trait, () => {
      scene.unregisterBeforeRender(directionUpdate);
    });
  },
});
