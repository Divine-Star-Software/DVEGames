import { Vector3 } from "@babylonjs/core";
import { NCS } from "@amodx/ncs/";
import { CameraProviderComponent } from "../../Babylon/Components/Providers/CameraProvider.component";
import { BabylonContext } from "../../Babylon/Contexts/Babylon.context";
import { Directions } from "@amodx/math/Directions";
import { Vector2Like } from "@amodx/math";
class Data {
  forwardDirection = new Vector3();
  sideDirection = new Vector3();
  forwardXZDirection = new Vector3();
}
interface CameraDirectionTraitSchema {
  meshId?: string;
}

class Logic {
  private _direction = new Vector3();
  constructor(public component: (typeof CameraDirectionTrait)["default"]) {}

  private get2dDirection(vector: Vector3) {
    vector.y = 0;
    vector.normalize();

    return Directions.FromVector(
      Vector2Like.Create(Math.round(vector.x), Math.round(vector.z))
    );
  }

  getForwardDirectionName() {
    const cameraComponent = CameraProviderComponent.get(
      this.component.getNode()
    )!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Forward(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
  getBackwardDirectionName() {
    const cameraComponent = CameraProviderComponent.get(
      this.component.getNode()
    )!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Backward(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
  getRightDirectionName() {
    const cameraComponent = CameraProviderComponent.get(
      this.component.getNode()
    )!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Right(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
  getLeftDirectionName() {
    const cameraComponent = CameraProviderComponent.get(
      this.component.getNode()
    )!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Left(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
}

export const CameraDirectionTrait = NCS.registerTrait<
  CameraDirectionTraitSchema,
  Data,
  Logic
>({
  type: "camera-direction",
  data: () => new Data(),
  logic: (component): Logic => new Logic(component),
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
