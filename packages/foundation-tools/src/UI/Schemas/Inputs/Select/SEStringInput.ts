import { SelectPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm } from "@amodx/elm";
SchemaEditorInputRegister.register<string, SelectPropertyInput>(
  SelectPropertyInput,
  (props) => {
    const { node } = props;
    const input = node.input?.data as SelectPropertyInput["data"];
    
    return SEInputBase(
      props,
      elm(
        "select",
        {
          className: "input",
          value: node.get(),
          onchange: ({ target }) => {
            node.update((target as HTMLInputElement).value);
          },
        },
        input.properties.options.map((item) => {
          return elm(
            "option",
            {
              value: String(Array.isArray(item) ? item[1] : item),
            },
            String(Array.isArray(item) ? item[0] : item)
          );
        })
      )
    );
  }
);
