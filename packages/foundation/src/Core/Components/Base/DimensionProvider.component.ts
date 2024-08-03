import { ComponentData, NCS } from "@amodx/ncs/";
import { StringProp } from "@amodx/schemas";
interface Schema {
  dimension: string;
}
export const DimensionProviderComponent = NCS.registerComponent<Schema, {}>({
  type: "dimension-provider",
  schema: [StringProp("dimension")],
});
