import { NCS } from "@amodx/ncs/";
class Schema {
  isGrounded = false;
  isInLiquid = false;
}
export const PhysicsColliderStateComponent = NCS.registerComponent<Schema>({
  type: "collider-state",
  schema: NCS.schemaFromObject(new Schema()),
});
