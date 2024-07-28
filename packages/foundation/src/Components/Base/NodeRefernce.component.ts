import { NCS, NodeInstance } from "@amodx/ncs";
import { StringProp } from "@amodx/schemas";
interface Schema {
  nodeId: string;
}
interface Data {
  readonly node: NodeInstance | null;
}
export const NodeRefernceComponent = NCS.registerComponent<Schema, Data>({
  type: "node-refernce",
  data: (c) => {
    return {
      get node() {
        return (
          (c.schema.nodeId && c.node.graph.getNode(c.schema.nodeId)) || null
        );
      },
    };
  },
  schema: [StringProp("nodeId")],
});
