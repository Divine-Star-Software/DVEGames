import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../Components/Base/Transform.component";

class Data {
  _position: Vector3Like | null = null;
  get position() {
    return this._position;
  }
  set position(position: Vector3Like | null) {
    position && Vector3Like.Copy(position, this.transform.schema.position);
    this._position = position;
  }
  _rotation: Vector3Like | null = null;
  get rotation() {
    return this._rotation;
  }
  set rotation(rotation: Vector3Like | null) {
    rotation && Vector3Like.Copy(rotation, this.transform.schema.rotation);
    this._rotation = rotation;
  }
  _scale: Vector3Like | null = null;
  get scale() {
    return this._scale;
  }
  set scale(scale: Vector3Like | null) {
    scale && Vector3Like.Copy(scale, this.transform.schema.scale);
    this._scale = scale;
  }
  constructor(public transform: (typeof TransformComponent)["default"]) {}
}

export const SyncTransformTrait = NCS.registerTrait<{}, Data>({
  type: "sync-transform",
  init(trait) {
    const node = trait.getNode();
    const transform = TransformComponent.get(node)!;
    trait.data = new Data(transform);
  },
  update(trait) {
    trait.data.position &&
      Vector3Like.Copy(
        trait.data.position,
        trait.data.transform.schema.position
      );
    trait.data.rotation &&
      Vector3Like.Copy(
        trait.data.rotation,
        trait.data.transform.schema.rotation
      );
    trait.data.scale &&
      Vector3Like.Copy(trait.data.scale, trait.data.transform.schema.scale);
  },
});
