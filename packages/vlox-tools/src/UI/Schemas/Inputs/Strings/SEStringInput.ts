import { StringPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";
SchemaEditorInputRegister.register<number, StringPropertyInput>(
  StringPropertyInput,
  (props) => {
    const { node } = props;
    const updateInput = useSignal();
    node.observers.updatedOrLoadedIn.subscribe(() =>
      updateInput.broadcast()
    );
    return SEInputBase(
      props,
      elm("input", {
        className: "input",
        type: "string",
        defaultValue: String(node.get()),
        oninput: ({ target }) => {
          node.update((target as HTMLInputElement).value);
        },
        signal: updateInput(
          (elm) => ((elm as HTMLInputElement).value = String(node.get()))
        ),
      })
    );
  }
);