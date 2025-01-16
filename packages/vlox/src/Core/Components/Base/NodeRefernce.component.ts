import { NCS, NodeCursor } from "@amodx/ncs";
class ComponentSchema {
  nodeId: bigint = 0n;
  nodeIndex: number = 0;
}
interface Data {
  readonly node: NodeCursor | null;
}
export const NodeRefernceComponent = NCS.registerComponent<
  ComponentSchema,
  Data
>({
  type: "node-refernce",
  schema: NCS.schemaFromObject(new ComponentSchema()),
  init(component) {
    const c = component.cloneCursor();
    component.data = {
      get node() {
        return (
          (c.schema.nodeIndex !== undefined &&
            c.node.graph.getNode(c.schema.nodeIndex)) ||
          null
        );
      },
    };
  },
});
