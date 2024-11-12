import { NCS } from "@amodx/ncs/";
import { StringProp } from "@amodx/schemas";

type Schema = {
    dimension:string
};
type Data = {

};

export const DimensionContext = NCS.registerContext<Schema, Data>({
  type: "dve-dimension",
  schema:[StringProp("dimension")]
});
