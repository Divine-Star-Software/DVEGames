import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";

export class TransformData {
  static Create(data: Partial<TransformData> = {}) {
    return new TransformData(data.position, data.rotation, data.scale);
  }
  constructor(
    public position: Vector3Like = Vector3Like.Create(),
    public rotation: Vector3Like = Vector3Like.Create(),
    public scale: Vector3Like = Vector3Like.Create(1, 1, 1)
  ) {}
}
export const TransformComponent = NCS.registerComponent<TransformData>({
  type: "transform",
  schema: NCS.schemaFromObject(new TransformData()),
});

export const createTransformProxy = (
  transformComponent: (typeof TransformComponent)["default"],
  position?: Vector3Like | null,
  rotation?: Vector3Like | null,
  scale?: Vector3Like | null
) => {
  const cursor = transformComponent.schema.getCursor();
  const index = transformComponent.schema.getSchemaIndex();
  if (position) {
    cursor.setProxy(index.position.x, position, "x");
    cursor.setProxy(index.position.y, position, "y");
    cursor.setProxy(index.position.z, position, "z");
  }
  if (rotation) {
    cursor.setProxy(index.rotation.x, rotation, "x");
    cursor.setProxy(index.rotation.y, rotation, "y");
    cursor.setProxy(index.rotation.z, rotation, "z");
  }

  if (scale) {
    cursor.setProxy(index.scale.x, scale, "x");
    cursor.setProxy(index.scale.y, scale, "y");
    cursor.setProxy(index.scale.z, scale, "z");
  }
};
