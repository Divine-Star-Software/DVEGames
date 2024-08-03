import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
import { Vec3Prop } from "@amodx/schemas";

type BoxPhysicsBodyDataSchema = {
  offset: Vector3Like;
  size: Vector3Like;
};

type BoxPhysicsBodyData = {};

export const BoxColliderComponent =
  NCS.registerComponent<BoxPhysicsBodyDataSchema>({
    type: "box-collider",
    schema: [
      Vec3Prop("offset"),
      Vec3Prop("size", { value: Vector3Like.Create(1, 1, 1) }),
    ],
    init(component) {},
  });
