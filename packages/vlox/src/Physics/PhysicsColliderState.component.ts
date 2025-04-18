import { NCS } from "@amodx/ncs/";
export const PhysicsColliderStateComponent = NCS.registerComponent({
  type: "collider-state",
  schema: NCS.schema(
    {
      isGrounded: NCS.property(0, { binary: "ui8" }),
      isInLiquid: NCS.property(0, { binary: "ui8" }),
      wantsToJump: NCS.property(0, { binary: "ui8" }),
      jumpTime: NCS.property(0, { binary: "f32" }),
      coyoteTime: NCS.property(0, { binary: "f32" }),
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
});
