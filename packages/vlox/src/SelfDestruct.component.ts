import { NCS } from "@amodx/ncs/";
export const SelfDestructComponent = NCS.registerComponent({
  type: "self-destruct",
  schema: NCS.schema({
    time: NCS.property(0),
  }),
  data: NCS.data<number>(),
  init: (component) => (component.data = performance.now()),
  update(component) {
    const delta = performance.now() - component.data;
    if (delta >= component.schema.time) {
      component.node.dispose();
    }
  },
});
