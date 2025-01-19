import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
export const BoxColliderComponent = NCS.registerComponent({
  type: "box-collider",
  schema: NCS.schema(
    {
      offset: NCS.property(Vector3Like.Create(), {
        type: "vector-3",
        binary: "f32",
      }),
      size: NCS.property(Vector3Like.Create(), {
        type: "vector-3",
        binary: "f32",
      }),
    },
    [
      {
        id: "shared-binary-object",
        type: "binary-object",
        sharedMemory: true,
      },
      {
        id: "shared-binary-object",
        type: "binary-object",
      },
    ]
  ),
});
