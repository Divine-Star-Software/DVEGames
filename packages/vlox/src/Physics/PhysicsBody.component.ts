import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
class Data {
  constructor(public component: (typeof PhysicsBodyComponent)["default"]) {}
  setVelocity(vector: Vector3Like) {
    Vector3Like.Copy(this.component.schema.targetVelocity, vector);
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
      targetVelocity: NCS.property(Vector3Like.Create(), { binary: "f32" }),
      mass: NCS.property(1, { binary: "f32" }),
      friction: NCS.property(0.5, { binary: "f32" }),
      angularDamping: NCS.property(0.1, { binary: "f32" }),
      gravityScale: NCS.property(1, { binary: "f32" }),
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
