import { Observable } from "@amodx/core/Observers";
import { ElementChildren, Signal } from "@amodx/elm";
import { PropertyInputBase } from "@amodx/schemas/Inputs/PropertyInput";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import {
  PropertyRenderFC,
  PropertyRenderFCDefaultProps,
} from "@amodx/schemas/Property.types";
export class SchemaEditorObservers {
  validate = new Observable<void>();
  loadIn = new Observable<void>();
}

export class SchemaEditorNodeObservers {
  validate = new Observable<void>();
  loadIn = new Observable<void>();
}

export type SEInputBaseProps<
  Value = any,
  Input extends PropertyInputBase = any,
> = {
  schema: SchemaEditorObservers;
  observers: SchemaEditorNodeObservers;
};

export type SEProps<
  Value = any,
  Input extends PropertyInputBase = any,
> = PropertyRenderFCDefaultProps<Value, Input> & SEInputBaseProps;

export type SEInputElement<
  Value = any,
  Input extends PropertyInputBase = any,
> = PropertyRenderFC<ElementChildren, Value, Input, SEInputBaseProps>;
