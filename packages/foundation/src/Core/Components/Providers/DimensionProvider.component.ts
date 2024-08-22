import { ComponentData, NCS } from "@amodx/ncs/";
import { StringProp } from "@amodx/schemas";
import { DimensionContext } from "../../../Core/Contexts/Dimension.context";
interface Schema {
  dimension: string;
}
export const DimensionProviderComponent = NCS.registerComponent<Schema, {}>({
  type: "dimension-provider",
  schema: [StringProp("dimension", { value: "main" })],
  init(comp) {
    const context = DimensionContext.get(comp.node);
    if (context) {
      comp.schema.getSchema().traverse((node) => {
        node.enableProxy(
          () => context.schema.dimension,
          (value) => (context.schema.dimension = value)
        );
      });
    }
  },
});
