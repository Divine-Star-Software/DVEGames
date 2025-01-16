import {} from "@amodx/schemas/Inputs/PropertyInput";
import { SEInputElement } from "./SEInputElement";
import { RegisteredInput } from "@amodx/schemas/Inputs";
export class SchemaEditorInputRegister {
  private static _components = new Map<string, SEInputElement>();

  static get(id: string) {
    const component = this._components.get(id);
    if (!component)
      throw new Error(`SEInputElement with id [${id}] does not exist`);
    return component;
  }
  static register(input: RegisteredInput, component: SEInputElement) {
    this._components.set(input.id, component);
  }
}
