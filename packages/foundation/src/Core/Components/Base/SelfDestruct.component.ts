import { NCS } from "@amodx/ncs/";
import { IntProp } from "@amodx/schemas";

type SelfDestructComponentSchema = {
  time: number;
};
export const SelfDestructComponent =
  NCS.registerComponent<SelfDestructComponentSchema>({
    type: "self-destruct",
    schema: [IntProp("time")],
    init(component) {
      const timeout = setTimeout(async () => {
        await component.node.dispose();
      }, component.schema.time);
      component.observers.disposed.subscribeOnce(() => {
        clearTimeout(timeout);
      });
    },
  });
