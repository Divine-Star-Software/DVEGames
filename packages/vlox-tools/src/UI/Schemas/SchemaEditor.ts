import { ElementChildren, elm, Signal, useSignal, wrap } from "@amodx/elm";
import {
  SchemaEditorNodeObservers,
  SchemaEditorObservers,
} from "./SEInputElement";
import { ObjectSchemaInstance } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "./SchemaEditorInputRegister";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import "./Inputs/index";
import convertSchema from "../Functions/convertSchema";
import { SchemaCursor } from "@amodx/ncs/Schema/Schema.types";

function traverseCreate(
  node: SchemaNode,
  observers: SchemaEditorObservers,
  elements: ElementChildren[],
  nodeObservers: Map<SchemaNode, SchemaEditorNodeObservers>
) {
  if (node.children) {
    const children: HTMLElement[] = [];

    for (const child of node.children) {
      traverseCreate(child, observers, children, nodeObservers);
    }
    elements.push(
      elm(
        "div",
        "schema-editor-group",
        elm(
          "p",
          "schema-editor-group-title",
          node.property.name || node.property.id
        ),
        children
      )
    );
    return;
  }
  if (
    (typeof node.property.editable !== "undefined" &&
      !node.property.editable) ||
    !node.input
  )
    return;

  const nodeObserve = new SchemaEditorNodeObservers();
  const newElms = SchemaEditorInputRegister.get(node.input.data.type)({
    node,
    schema: observers,
    observers: nodeObserve,
  });

  elements.push(newElms);

  nodeObservers.set(node, nodeObserve);
}

export const SchemaEditor = wrap<
  { schemaInstance?: ObjectSchemaInstance; schema?: SchemaCursor<any> },
  "div"
>("div", true, (props) => {
  let schemaInstance = props.schemaInstance;
  if (props.schema) {
    schemaInstance = convertSchema(props.schema);
  }
  if (!schemaInstance)
    throw new Error(
      `Schema editor must have either schemaInstance or schema set`
    );

  const observers = new SchemaEditorObservers();
  const elements: ElementChildren[] = [];
  const nodeObservers = new Map<SchemaNode, SchemaEditorNodeObservers>();
  const root = schemaInstance.getSchema().getRoot();
  console.warn("CREATE", root, root.children);
  if (root.children) {
    for (const child of root.children) {
      traverseCreate(child, observers, elements, nodeObservers);
    }
  }

  return elm(
    "form",
    {
      className: "schema-editor",
    },
    ...elements
  );
});
