import { NCS } from "@amodx/ncs/";
import { TransformNode, Node as BabylonNode, Vector3 } from "@babylonjs/core";
import { Vector3Like } from "@amodx/math";
import { Vec3Prop } from "@amodx/schemas";
interface Data {
  transformNode: TransformNode;
}
interface Logic {
  parent(node: BabylonNode): void;
  getWorldPosition(): Vector3;
}
export class TransformData {
  static Create(data: Partial<TransformData> = {}) {
    return new TransformData(data.position, data.rotation, data.scale);
  }
  protected constructor(
    public position: Vector3Like = Vector3Like.Create(),
    public rotation: Vector3Like = Vector3Like.Create(),
    public scale: Vector3Like = Vector3Like.Create(1, 1, 1)
  ) {}
}
export const TransformComponent = NCS.registerComponent<
  TransformData,
  Data,
  Logic
>({
  type: "transform",
  schema: [
    Vec3Prop("position"),
    Vec3Prop("rotation"),
    Vec3Prop("scale", { value: Vector3Like.Create(1, 1, 1) }),
  ],
});

export const createTransformProxy = (
  transformComponent: (typeof TransformComponent)["default"],
  position?: Vector3Like | null,
  rotation?: Vector3Like | null,
  scale?: Vector3Like | null
) => {
  transformComponent.schema.getSchema().traverse((node) => {
    if (node.property.id == "position" && position) {
      node.enableProxy(
        () => position,
        (vec) => Vector3Like.Copy(position, vec)
      );
    }
    if (node.property.id == "rotation" && rotation) {
      node.enableProxy(
        () => rotation,
        (vec) => Vector3Like.Copy(rotation, vec)
      );
    }
    if (node.property.id == "scale" && scale) {
      node.enableProxy(
        () => scale,
        (vec) => Vector3Like.Copy(scale, vec)
      );
    }
  });
};
