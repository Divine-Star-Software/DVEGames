import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";

class BoxPhysicsBodyDataSchema {
  offset = Vector3Like.Create();
  size = Vector3Like.Create();
}

export const BoxColliderComponent =
  NCS.registerComponent<BoxPhysicsBodyDataSchema>({
    type: "box-collider",
    schema: NCS.schemaFromObject(new BoxPhysicsBodyDataSchema()),
  });
