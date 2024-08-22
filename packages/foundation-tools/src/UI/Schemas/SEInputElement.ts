import { Observable } from "@amodx/core/Observers";
import { Signal } from "@amodx/elm";
import { PropertyInputBase } from "@amodx/schemas/Inputs/PropertyInput";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";

export class SchemaEditorObservers {
  validate = new Observable<void>();
  loadIn = new Observable<void>();
  activeUpdate = new Observable<void>();
}

export class SchemaEditorNodeObservers {
  validate = new Observable<void>();
  loadIn = new Observable<void>();
  activeUpdate = new Observable<void>();
}

export type SEInputBaseProps<
  Value = any,
  Input extends PropertyInputBase = any
> = {
  node: SchemaNode<Value, Input>;
  schema: SchemaEditorObservers;
  observers: SchemaEditorNodeObservers;
  active: Signal<boolean>;
};

export type SEInputElement<
  Value = any,
  Input extends PropertyInputBase = any
> = (props: SEInputBaseProps<Value, Input>) => HTMLElement;
