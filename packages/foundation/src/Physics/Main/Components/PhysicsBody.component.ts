import { NCS } from "@amodx/ncs/";
import { Vector3Like } from "@amodx/math";
import { Vec3Prop, FloatProp, CheckboxProp } from "@amodx/schemas";
import { CreateIndex } from "@amodx/binary/Struct/Functions/CreateIndex";
import { CreateInstance } from "@amodx/binary/Struct/Functions/CreateInstance";
import { BinaryNumberTypes, InstantiatedStruct } from "@amodx/binary";

type PhysicsBodySchema = {
  velocity: Vector3Like;
  mass: number;
  friction: number;
  acceleration: Vector3Like;
  angularVelocity: Vector3Like;
  angularAcceleration: Vector3Like;
  force: Vector3Like;
  torque: Vector3Like;
  damping: number;
  angularDamping: number;
  gravityScale: number;
  isKinematic: boolean;
};

const schema = [
  Vec3Prop("velocity"),
  FloatProp("mass", { value: 1 }),
  FloatProp("friction", { value: 0.5 }),
  Vec3Prop("acceleration"),
  Vec3Prop("angularVelocity"),
  Vec3Prop("angularAcceleration"),
  Vec3Prop("force"),
  Vec3Prop("torque"),
  FloatProp("damping", { value: 0.1 }),
  FloatProp("angularDamping", { value: 0.1 }),
  FloatProp("gravityScale", { value: 1 }),
  CheckboxProp("isKinematic", { value: false }),
];

const BufferIndex = CreateIndex(
  schema.map((_) => {
    if (_.input?.type == "vec3")
      return {
        id: _.id,
        type: "vector-3",
        numberType: BinaryNumberTypes.Float64,
      };
    if (_.input?.type == "float")
      return {
        id: _.id,
        type: "typed-number",
        numberType: BinaryNumberTypes.Float64,
      };
    if (_.input?.type == "checkbox")
      return {
        id: _.id,
        type: "boolean",
      };
    throw new Error("");
  })
);


type PhysicsBodyData = {
  buffer: SharedArrayBuffer;
  instance: InstantiatedStruct<PhysicsBodySchema>;
};
export const PhysicsBodyComponent = NCS.registerComponent<
  PhysicsBodySchema,
  PhysicsBodyData
>({
  type: "physics-body",
  schema,
  init(component) {
    const instance = CreateInstance<PhysicsBodySchema>(BufferIndex);

    component.schema.getSchema().traverse((node) => {
      if (typeof node.get() == "object") {
        node.enableProxy(
          () => (instance as any)[node.property.id],
          (value) =>
            Vector3Like.Copy((instance as any)[node.property.id], value)
        );
        return;
      }
      if (typeof node.get() == "number") {
        node.enableProxy(
          () => (instance as any)[node.property.id],
          (value) => ((instance as any)[node.property.id] = value)
        );
        return;
      }

      let buffer = new SharedArrayBuffer(instance.structSize);

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
    });
  },
});
