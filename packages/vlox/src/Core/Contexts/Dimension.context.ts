import { NCS } from "@amodx/ncs/";

class Schema {
  dimension = "main";
}

export const DimensionContext = NCS.registerContext<Schema, {}>({
  type: "dve-dimension",
  schema: NCS.schemaFromObject(new Schema()),
});
