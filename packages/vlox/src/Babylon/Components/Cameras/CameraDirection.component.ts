import { Vector3 } from "@babylonjs/core";
import { NCS } from "@amodx/ncs/";
import { CameraProviderComponent } from "../Providers/CameraProvider.component";
import { BabylonContext } from "../../Contexts/Babylon.context";
import { Directions } from "@amodx/math/Directions";
import { Vector2Like } from "@amodx/math";
class Data {
  _cleanUp: () => void;
  forwardDirection = new Vector3();
  sideDirection = new Vector3();
  forwardXZDirection = new Vector3();
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
    const cameraComponent = CameraProviderComponent.get(this.component.node)!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Forward(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
  getBackwardDirectionName() {
    const cameraComponent = CameraProviderComponent.get(this.component.node)!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Backward(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
  getRightDirectionName() {
    const cameraComponent = CameraProviderComponent.get(this.component.node)!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Right(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
  getLeftDirectionName() {
    const cameraComponent = CameraProviderComponent.get(this.component.node)!;

    cameraComponent.data.camera.getDirectionToRef(
      Vector3.Left(),
      this._direction
    );
    return this.get2dDirection(this._direction);
  }
}

export const CameraDirectionTrait = NCS.registerComponent<
  {},
  Data,
  Logic
>({
  type: "camera-direction",

  init(component) {
    component.data = new Data();
    component.logic =  new Logic(component.cloneCursor());

    const { scene } = BabylonContext.getRequired(component.node)!.data;

    const cameraComponent = CameraProviderComponent.get(component.node)!;

    const forwardDirection = component.data.forwardDirection;
    const sideDirection = component.data.sideDirection;
    const forwardXZDirection = component.data.forwardXZDirection;

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
    component.data._cleanUp = () => {
      scene.unregisterBeforeRender(directionUpdate);
    };
  },
  dispose(component) {
    component.data._cleanUp();
    component.logic.component.returnCursor();
  },
});
