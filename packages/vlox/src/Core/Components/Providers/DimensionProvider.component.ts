import { NCS } from "@amodx/ncs/";
import { DimensionContext } from "../../../Core/Contexts/Dimension.context";
export const DimensionProviderComponent = NCS.registerComponent({
  type: "dimension-provider",
  schema: NCS.schema({
    dimension: NCS.property("main"),
  }),
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
