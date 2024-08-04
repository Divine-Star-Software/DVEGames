import { NCS } from "@amodx/ncs/";
import { CheckboxProp } from "@amodx/schemas";

type Schema = {
  isGrounded: boolean;
  isInLiquid: boolean;
};

export const PhysicsColliderStateComponent = NCS.registerComponent<Schema>({
  type: "collider-state",
  schema: [
    CheckboxProp("isGrounded", { value: false }),
    CheckboxProp("isInLiquid", { value: false }),
  ],
});
