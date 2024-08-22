import {
    PropertyInputBase,
    PropertyInputConstructor,
  } from "@amodx/schemas/Inputs/PropertyInput";
  import { SEInputElement } from "./SEInputElement";
  export class SchemaEditorInputRegister {
    private static _components = new Map<string, SEInputElement>();
  
    static get(id: string) {
      const component = this._components.get(id);
      if (!component)
        throw new Error(`SEInputElement with id [${id}] does not exist`);
      return component;
    }
    static register<Value = any, Input extends PropertyInputBase = any>(
      input: PropertyInputConstructor,
      component: SEInputElement<Value, Input>
    ) {
      this._components.set(input.Meta.id, component);
    }
  }
  