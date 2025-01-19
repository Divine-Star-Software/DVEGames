import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
export const TransformComponent = NCS.registerComponent({
  type: "transform",
  schema: NCS.schema(
    {
      position: NCS.property(Vector3Like.Create(), {
        type: "vector-3",
        binary: "f32",
      }),
      rotation: NCS.property(Vector3Like.Create(), {
        type: "vector-3",
        binary: "f32",
      }),
      scale: NCS.property(Vector3Like.Create(1, 1, 1), {
        type: "vector-3",
        binary: "f32",
      }),
    },
    [
      {
        id: "shared-array",
        type: "typed-array",
        sharedMemory: true,
        arrayType: "f32",
      },
      {
        id: "array",
        type: "typed-array",
        arrayType: "f32",
      },
    ]
  ),
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
