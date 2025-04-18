import { Vector3, Ray } from "@babylonjs/core";
import { NCS } from "@amodx/ncs/";
import { CameraProviderComponent } from "../Providers/CameraProvider.component";
import { Directions } from "@amodx/math/Directions";
import { Vector2Like } from "@amodx/math";

const forward = Vector3.Forward();
const right = Vector3.Right();
class Data {
  _cleanUp: () => void;
  forwardDirection = new Vector3();
  sideDirection = new Vector3();
  forwardXZDirection = new Vector3();
  forwardRay = new Ray(new Vector3(), new Vector3());
  private _direction = new Vector3();
  get camera() {
    return this._data.camera;
  }
  constructor(
    private _data: (typeof CameraProviderComponent)["default"]["data"]
  ) {}

  private get2dDirection(vector: Vector3) {
    vector.y = 0;
    vector.normalize();

    return Directions.FromVector(
      Vector2Like.Create(Math.round(vector.x), Math.round(vector.z))
    );
  }

  getForwardDirectionName() {
    this.camera.getDirectionToRef(Vector3.Forward(), this._direction);
    return this.get2dDirection(this._direction);
  }
  getBackwardDirectionName() {
    this.camera.getDirectionToRef(Vector3.Backward(), this._direction);
    return this.get2dDirection(this._direction);
  }
  getRightDirectionName() {
    this.camera.getDirectionToRef(Vector3.Right(), this._direction);
    return this.get2dDirection(this._direction);
  }
  getLeftDirectionName() {
    this.camera.getDirectionToRef(Vector3.Left(), this._direction);
    return this.get2dDirection(this._direction);
  }

  update() {
    if (!this.camera) return;
    const forwardDirection = this.forwardDirection;
    const sideDirection = this.sideDirection;
    const forwardXZDirection = this.forwardXZDirection;

    this.camera.getDirectionToRef(forward, forwardDirection);
    this.camera.getDirectionToRef(right, sideDirection);
    forwardXZDirection
      .set(forwardDirection.x, 0, forwardDirection.z)
      .normalize();
    sideDirection.set(sideDirection.x, 0, sideDirection.z).normalize();
    this.forwardRay.origin.set(
      this.camera.globalPosition.x,
      this.camera.globalPosition.y,
      this.camera.globalPosition.z
    );
    this.forwardRay.direction.set(
      forwardDirection.x,
      forwardDirection.y,
      forwardDirection.z
    );
  }
}

export const CameraDirectionComponent = NCS.registerComponent({
  type: "camera-direction",
  data: NCS.data<Data>(),
  init(component) {
    const cameraComponent = CameraProviderComponent.getRequired(
      component.node
    )!;
    const data = new Data(cameraComponent.data);
    component.data = data;
  },
  update(component) {
    component.data.update();
  },
  dispose(component) {
    component.data._cleanUp();
  },
});
