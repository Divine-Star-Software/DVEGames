import { PasswordPropertyInput } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "../../SchemaEditorInputRegister";
import { SEInputBase } from "../../SEInputBase";
import { elm, useSignal } from "@amodx/elm";

SchemaEditorInputRegister.register<number, PasswordPropertyInput>(
  PasswordPropertyInput,
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
        type: "password",
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
