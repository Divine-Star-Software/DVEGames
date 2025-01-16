import { ElementChildren, elm, Signal, useSignal, wrap } from "@amodx/elm";

import {
  SchemaEditorNodeObservers,
  SchemaEditorObservers,
} from "./SEInputElement";
import { ObjectSchemaInstance } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "./SchemaEditorInputRegister";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import "./Inputs/index";

export const SchemaEditor = wrap<
  { schemaInstance: ObjectSchemaInstance },
  "div"
>("div", true, (props) => {
  const observers = new SchemaEditorObservers();

  let activeProeprtyIndex = 0;
  let maxPropertyIndex = 0;
  const elements: ElementChildren[] = [];

  const nodeObservers = new Map<SchemaNode, SchemaEditorNodeObservers>();
  let nodes: SchemaNode[] = [];
  let activeSignals: Signal<boolean>[] = [];

  let index = 0;
  props.schemaInstance.getSchema().traverse((node) => {
    if (
      (typeof node.property.editable !== "undefined" &&
        !node.property.editable) ||
      !node.input
    )
      return;

    const activeSignal = useSignal(index == activeProeprtyIndex);
    const nodeObserve = new SchemaEditorNodeObservers();
    const newElms = SchemaEditorInputRegister.get(node.input.data.type)({
      node,
      schema: observers,
      active: activeSignal,
      observers: nodeObserve,
    });

    index++;
    elements.push(newElms);
    nodes.push(node);
    activeSignals.push(activeSignal);
    nodeObservers.set(node, nodeObserve);
  });

  maxPropertyIndex = nodes.length - 1;

  return elm(
    "form",
    {
      className: "schema-editor",
    },
    ...elements
  );
});
