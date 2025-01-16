import { RangePropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { ElementChildren, elm, useSignal } from "@amodx/elm";
import { SEInputBaseProps } from "UI/Schemas/SEInputElement";
SchemaEditorInputRegister.register(
  RangePropertyInput,
  RangePropertyInput.createPropertyRenderFC<ElementChildren, SEInputBaseProps>(
    (props) => {
      const updateInput = useSignal();
      const { node } = props;
      const input = node.input!.data.properties;
      node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
      return SEInputBase(
        props,
        elm("input", {
          className: "input",
          type: "range",
          min: String(input.min),
          max: String(input.max),
          step: String(input.step),
          defaultValue: String(node.get()),
          oninput({ target }) {
            node.update(parseFloat((target as HTMLInputElement).value));
          },
          signal: updateInput((elm) => {
            (elm as HTMLInputElement).value = String(node.get());
          }),
        })
      );
    }
  )
);
