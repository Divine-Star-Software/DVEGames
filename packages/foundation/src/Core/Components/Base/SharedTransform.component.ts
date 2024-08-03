import { NCS } from "@amodx/ncs/";
import { TransformComponent, TransformData } from "./Transform.component";
import { CreateIndex } from "@amodx/binary/Struct/Functions/CreateIndex";
import { BinaryNumberTypes, InstantiatedStruct } from "@amodx/binary";
import { CreateInstance } from "@amodx/binary/Struct/Functions/CreateInstance";
import { Vector3Like } from "@amodx/math";

const BufferIndex = CreateIndex([
  {
    id: "position",
    type: "vector-3",
    numberType: BinaryNumberTypes.Float64,
  },
  {
    id: "rotation",
    type: "vector-3",
    numberType: BinaryNumberTypes.Float64,
  },
  {
    id: "scale",
    type: "vector-3",
    numberType: BinaryNumberTypes.Float64,
  },
]);
type SharedTransformData = {
  buffer: SharedArrayBuffer;
  instance: InstantiatedStruct<TransformData>;
};
export const SharedTransformComponent = NCS.registerComponent<
  {},
  SharedTransformData
>({
  type: "shared-transform",
  init(component) {
    const instance = CreateInstance<TransformData>(BufferIndex);
    let buffer = new SharedArrayBuffer(instance.structSize);
    instance.setBuffer(buffer);
    const transform = TransformComponent.get(component.node)!;

    Vector3Like.Copy(instance.position, transform.schema.position);
    Vector3Like.Copy(instance.rotation, transform.schema.rotation);
    Vector3Like.Copy(instance.scale, transform.schema.scale);
    transform.schema.getSchema().traverse((node) => {
      if (typeof node.get() == "object") {
        node.enableProxy(
          () => (instance as any)[node.property.id],
          (value) =>
            Vector3Like.Copy((instance as any)[node.property.id], value)
        );
        return;
      }
    });

    component.data = {
      get buffer() {
        return buffer;
      },
      set buffer(buffer: SharedArrayBuffer) {
        buffer = buffer;
        instance.setBuffer(buffer);
      },
      instance,
    };
  },
});
