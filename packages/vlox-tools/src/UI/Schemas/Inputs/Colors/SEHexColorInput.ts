import { HexColorPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { ElementChildren, elm, useSignal } from "@amodx/elm";
import { SEInputBaseProps } from "UI/Schemas/SEInputElement";
SchemaEditorInputRegister.register(
  HexColorPropertyInput,
  HexColorPropertyInput.createPropertyRenderFC<
    ElementChildren,
    SEInputBaseProps
  >((props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() => updateInput.broadcast());
    return SEInputBase(
      props,
      elm("input", {
        className: "input",
        type: "color",
        defaultValue: String(node.get()),
        oninput: ({ target }) => {
          node.update((target as HTMLInputElement).value);
        },
        signal: updateInput(
          (elm) => ((elm as HTMLInputElement).value = String(node.get()))
        ),
      })
    );
  })
);
