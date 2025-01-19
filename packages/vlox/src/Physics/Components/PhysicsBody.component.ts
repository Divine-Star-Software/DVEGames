import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
class Data {
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
export const PhysicsBodyComponent = NCS.registerComponent({
  type: "physics-body",
  data: NCS.data<Data>(),
  schema: NCS.schema(
    {
      velocity: NCS.property(Vector3Like.Create(), { binary: "f32" }),
      mass: NCS.property(1, { binary: "f32" }),
      friction: NCS.property(0.5, { binary: "f32" }),
      acceleration: NCS.property(Vector3Like.Create(), {
        binary: "f32",
      }),
      angularVelocity: NCS.property(Vector3Like.Create(), {
        binary: "f32",
      }),
      angularAcceleration: NCS.property(Vector3Like.Create(), {
        binary: "f32",
      }),
      force: NCS.property(Vector3Like.Create(), { binary: "f32" }),
      torque: NCS.property(Vector3Like.Create(), { binary: "f32" }),
      damping: NCS.property(Vector3Like.Create(), { binary: "f32" }),
      angularDamping: NCS.property(0.1, { binary: "f32" }),
      gravityScale: NCS.property(1, { binary: "f32" }),
      isKinematic: NCS.property(0, { binary: "ui8" }),
    },
    [
      {
        id: "shared-binary-object",
        type: "binary-object",
        sharedMemory: true,
      },
      {
        id: "binary-object",
        type: "binary-object",
      },
    ]
  ),
  init: (component) => (component.data = new Data(component.cloneCursor())),
  dispose: (component) => component.data.component.returnCursor(),
});
