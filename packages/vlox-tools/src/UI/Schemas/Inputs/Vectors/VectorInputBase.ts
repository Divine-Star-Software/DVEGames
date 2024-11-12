import { elm, frag, useSignal, wrap } from "@amodx/elm";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
export const VectorInputBase = wrap<
  { node: SchemaNode; property: string },
  "div"
>("div", (props) => {
  const node = props.node;
  props.className = "vector-input-node";
  const updateInput = useSignal();
  node.observers.updatedOrLoadedIn.subscribe(() => {
    updateInput.broadcast();
  });
  node.observers.set.subscribe(() => {
    updateInput.broadcast();
  });
  return frag(
    elm(
      "label",
      {
        className: "vector-input-label ",
      },
      props.property
    ),
    elm("input", {
      className: "input",
      type: "number",
      defaultValue: String(node.get()[props.property]),
      oninput: ({ target }) => {
        const vector = node.get();
        vector[props.property] = parseFloat((target as HTMLInputElement).value);
        node.update(vector);
      },
      signal: updateInput((elm) => {
        const vector = node.get();
        (elm as HTMLInputElement).value = String(vector[props.property]);
      }),
    })
  );
});
