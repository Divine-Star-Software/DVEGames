import { NCS } from "@amodx/ncs/";
import { DimensionContext } from "../../../Core/Contexts/Dimension.context";
class Schema {
  dimension: string;
}
export const DimensionProviderComponent = NCS.registerComponent<Schema, {}>({
  type: "dimension-provider",
  schema: NCS.schemaFromObject(new Schema()),
  init(comp) {
    const context = DimensionContext.get(comp.node);
    if (context) {
      comp.schema
        .getCursor()
        .setProxy(
          comp.schema.getSchemaIndex().dimension,
          context.schema,
          "dimension"
        );
    }
  },
});
