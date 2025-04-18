import { NCS } from "@amodx/ncs/";

export const DimensionContext = NCS.registerContext({
  type: "dve-dimension",
  schema: NCS.schemaFromObject({
    dimension: NCS.property("main"),
  }),
});
