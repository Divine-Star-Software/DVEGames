import { FloatPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";
SchemaEditorInputRegister.register(
  FloatPropertyInput,
  FloatPropertyInput.createPropertyRenderFC((props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(
      props,
      elm("input", {
        className: "input",
        type: "number",
        defaultValue: String(node.get()),
        oninput: ({ target }) => {
          const value = parseFloat((target as HTMLInputElement).value);
          node.update(Number.isNaN(value) ? 0 : value);
        },
        signal: updateInput((elm) => {
          (elm as HTMLInputElement).value = String(node.get());
        }),
      })
    );
  })
);
