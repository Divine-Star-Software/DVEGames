import { Vector3Like } from "@amodx/math";
import { ComponentInstance, NCS } from "@amodx/ncs/";
import { CreateIndex } from "@amodx/binary/Struct/Functions/CreateIndex";
import {
  BinaryNumberTypes,
  BinaryStructData,
  InstantiatedStruct,
} from "@amodx/binary";
import { ItemRegister } from "@amodx/ncs/Register/ItemRegister";
import { CreateInstance } from "@amodx/binary/Struct/Functions/CreateInstance";
import { CheckboxProp } from "@amodx/schemas";

class Shared {
  sharedStructs = new ItemRegister<BinaryStructData>("binary structs");

  getOrAddStruct(component: ComponentInstance<any, any, any, any>) {
    if (!component.proto.data.schema?.length) throw new Error("No schema");
    const namespace = component.proto.data.namespace || "main";
    if (this.sharedStructs.has(component.type, namespace))
      return this.sharedStructs.get(component.type, namespace);

    const bufferIndex = CreateIndex(
      component.proto.data.schema.map((_) => {
        if (_.input?.type == "vec3")
          return {
            id: _.id,
            type: "vector-3",
            numberType: BinaryNumberTypes.Float64,
            default: _.value as Vector3Like,
          };
        if (_.input?.type == "float")
          return {
            id: _.id,
            type: "typed-number",
            numberType: BinaryNumberTypes.Float64,
            default: _.value as number,
          };
        if (_.input?.type == "int")
          return {
            id: _.id,
            type: "typed-number",
            numberType: BinaryNumberTypes.Int32,
            default: _.value as number,
          };
        if (_.input?.type == "checkbox")
          return {
            id: _.id,
            type: "boolean",
          };

        console.error(_);
        throw new Error("Unsuppourted shared schema property.");
      })
    );
    this.sharedStructs.register(component.type, namespace, bufferIndex);
    return bufferIndex;
  }
}

type SharedSchemaData = {
  buffer: ArrayBufferLike;
  instance: InstantiatedStruct<any>;
};

type Sceham = {
  shared: boolean;
};
export const BufferSchemaTrait = NCS.registerTrait<
  Sceham,
  SharedSchemaData,
  {},
  Shared
>({
  type: "shared-schema",
  shared: new Shared(),
  schema: [CheckboxProp("shared", { value: false })],
  init(trait) {
    const component = trait.getComponent();
    const instance = CreateInstance<any>(
      trait.shared.getOrAddStruct(component)
    );
    let buffer = trait.schema.shared
      ? new SharedArrayBuffer(instance.structSize)
      : new ArrayBuffer(instance.structSize);
    instance.setBuffer(buffer);

    component.schema.getSchema().traverse((node) => {
      if (node.input!.data.type == "vec3") {
        Vector3Like.Copy((instance as any)[node.property.id], node.get());
        node.enableProxy(
          () => (instance as any)[node.property.id],
          (value) =>
            Vector3Like.Copy((instance as any)[node.property.id], value)
        );
        return;
      }
      if (node.input!.data.type == "checkbox") {
        (instance as any)[node.property.id] = node.get() ? 1 : 0;
        node.enableProxy(
          () => Boolean((instance as any)[node.property.id]),
          (value) => ((instance as any)[node.property.id] = value ? 1 : 0)
        );
        return;
      }
      if (node.input!.data.type == "int") {
        (instance as any)[node.property.id] = node.get();
        node.enableProxy(
          () => (instance as any)[node.property.id],
          (value) => ((instance as any)[node.property.id] = value)
        );
        return;
      }
      if (node.input!.data.type == "float") {
        (instance as any)[node.property.id] = node.get();
        node.enableProxy(
          () => (instance as any)[node.property.id],
          (value) => ((instance as any)[node.property.id] = value)
        );
        return;
      }
    });

    trait.data = {
      get buffer() {
        return buffer;
      },
      set buffer(buffer: ArrayBufferLike) {
        buffer = buffer;
        instance.setBuffer(buffer);
      },
      instance,
    };
  },
});
