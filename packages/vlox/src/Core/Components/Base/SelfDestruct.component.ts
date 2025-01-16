import { NCS } from "@amodx/ncs/";

class SelfDestructComponentSchema {
  time: number;
}
class Data {
  _done = false;
  constructor(public _cleanUp: () => void) {}
}
export const SelfDestructComponent = NCS.registerComponent<
  SelfDestructComponentSchema,
  Data
>({
  type: "self-destruct",
  schema: NCS.schemaFromObject(new SelfDestructComponentSchema()),
  init(component) {
    const timeout = setTimeout(() => {
      component.data._done = true;
      component.node.dispose();
    }, component.schema.time);
    component.data = new Data(() => {
      clearTimeout(timeout);
    });
  },
  dispose(component) {
    if (component.data._done) return;
    component.data._cleanUp();
  },
});
