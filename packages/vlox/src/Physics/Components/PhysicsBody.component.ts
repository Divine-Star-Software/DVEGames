import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";

class PhysicsBodySchema {
  velocity = Vector3Like.Create();
  mass = 1;
  friction = 0.5;
  acceleration = Vector3Like.Create();
  angularVelocity = Vector3Like.Create();
  angularAcceleration = Vector3Like.Create();
  force = Vector3Like.Create();
  torque = Vector3Like.Create();
  damping = Vector3Like.Create();
  angularDamping = 0.1;
  gravityScale = 1;
  isKinematic = false;
}

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
  schema: NCS.schemaFromObject(new PhysicsBodySchema()),
  init(component) {
    component.logic = new Logic(component.cloneCursor());
  },
  dispose(component) {
    component.logic.component.returnCursor();
  },
});
