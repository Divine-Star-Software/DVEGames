import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
import { Vec3Prop, FloatProp, CheckboxProp } from "@amodx/schemas";
import { InstantiatedStruct } from "@amodx/binary";

type PhysicsBodySchema = {
  velocity: Vector3Like;
  mass: number;
  friction: number;
  acceleration: Vector3Like;
  angularVelocity: Vector3Like;
  angularAcceleration: Vector3Like;
  force: Vector3Like;
  torque: Vector3Like;
  damping: Vector3Like;
  angularDamping: number;
  gravityScale: number;
  isKinematic: boolean;
};

class Logic {
  constructor(public component: (typeof PhysicsBodyComponent)["default"]) {}

  setForce(vector: Vector3Like) {
    Vector3Like.Copy(this.component.schema.force, vector);
    return vector;
  }

  getForce() {
    return this.component.schema.force;
  }

  setVelocity(vector: Vector3Like) {
    Vector3Like.Copy(this.component.schema.velocity, vector);
    return vector;
  }

  getVelocity() {
    return this.component.schema.velocity;
  }
}

export const PhysicsBodyComponent = NCS.registerComponent<
  PhysicsBodySchema,
  {},
  Logic
>({
  type: "physics-body",
  schema: [
    Vec3Prop("velocity"),
    FloatProp("mass", { value: 1 }),
    FloatProp("friction", { value: 0.5 }),
    Vec3Prop("acceleration"),
    Vec3Prop("angularVelocity"),
    Vec3Prop("angularAcceleration"),
    Vec3Prop("force"),
    Vec3Prop("torque"),
    Vec3Prop("damping", { value: { x: 0, y: 0, z: 0 } }),
    FloatProp("angularDamping", { value: 0.1 }),
    FloatProp("gravityScale", { value: 1 }),
    CheckboxProp("isKinematic", { value: false }),
  ],
  logic: (component): Logic => new Logic(component),
});
