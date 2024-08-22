import { elm, Signal, useSignal, wrap } from "@amodx/elm";

import {
  SchemaEditorNodeObservers,
  SchemaEditorObservers,
} from "./SEInputElement";
import { ObjectSchemaInstance } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "./SchemaEditorInputRegister";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import "./Inputs/index";


elm.css(/* css */`
 .schema-editor {
  .input {
    padding: 0;
    margin: 0;
    outline: none;
    width: 50%;
    color: var(--font-color);
  
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
    font-size: 16px;
    outline: none;
  
    &::foccus {
      border-color: #009ffd;
      box-shadow: 0 0 8px rgba(0, 159, 253, 0.5);
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    &:disabled {
      opacity: .5;
      background: rgba(10, 10, 10, 0.1);
    }
  }
  .checkbox-container {
    .checkbox {
      width: 20px;
      height: 20px;
      margin: auto;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .dropdown-list {
    padding: 0;
    margin: 0;
  
    width: 50%;
  
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
    color: var(--font-color);
    font-size: 16px;
    outline: none;
    .dropdown-list-option {
      color: black;
    }
  
    &::foccus {
      border-color: #009ffd;
      box-shadow: 0 0 8px rgba(0, 159, 253, 0.5);
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    &:disabled {
      opacity: .5;
      background: rgba(10, 10, 10, 0.1);
    }
  }
  .label {
    color: white;
    display: block;
    padding: 0;
    width: 50%;
    text-align: center;
  }
  .form-group {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: row;
  }
  .object-vector-property {
    display: flex;
    vertical-align: middle;
  
    font-size: var(--font-size-medium);
    .object-vector-property-label {
      display: block;
      color: white;
      flex-grow: 0;
      flex-shrink: 0;
      width: 20%;
      text-align: center;
      margin: auto;
    }
    .vector-inputs {
      display: flex;
      flex-direction: row;
      width: 80%;
      flex-grow: 0;
      flex-shrink: 0;
      .vector-input-node {
        flex-direction: row;
        display: flex;
        width: 100%;
        margin-left: 20px;
        .vector-input-label {
          display: block;
          color: var(--font-color);
          margin: auto;
        }
      }
    }
  }
} 
`);

export const SchemaEditor = wrap<
  { schemaInstance: ObjectSchemaInstance },
  "div"
>("div", (props) => {
  const observers = new SchemaEditorObservers();

  let activeProeprtyIndex = 0;
  let maxPropertyIndex = 0;
  const elements: HTMLElement[] = [];

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
