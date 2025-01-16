import { Vec3PropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { elm } from "@amodx/elm";
import { VectorInputBase } from "./VectorInputBase";
SchemaEditorInputRegister.register(
  Vec3PropertyInput,
  Vec3PropertyInput.createPropertyRenderFC((props) => {
    const { node } = props;
    return elm(
      "div",
      "object-vector-property",
      elm(
        "p",
        "object-vector-property-label",
        props.node.property.name || props.node.property.id
      ),
      elm(
        "div",
        "vector-inputs",
        VectorInputBase({
          node: node,
          property: "x",
        }),
        VectorInputBase({
          node: node,
          property: "y",
        }),
        VectorInputBase({
          node: node,
          property: "z",
        })
      )
    );
  })
);
