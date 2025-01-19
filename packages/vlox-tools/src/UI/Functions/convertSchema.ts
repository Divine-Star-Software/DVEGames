import {
  Schema,
  Property,
  StringProp,
  BooleanProp,
  FloatProp,
  Vec2Prop,
  Vec3Prop,
  ObjectProp,
  SelectProp,
} from "@amodx/schemas";
import { Property as NCSProperty } from "@amodx/ncs";
import { SchemaCursor } from "@amodx/ncs/Schema/Schema.types";

export const traverseTransform = (
  parent: NCSProperty,
  property: Property<any, any>,
  target: any
) => {
  property.children ??= [];
  for (const child of parent.children!) {
    if (!child.children) {
      let valueType = typeof child.value;
      if (child.meta?.options) {
        property.children!.push(
          SelectProp(child.id, {
            value: String(child.value),
            name: child.name,
            options: child.meta.options,
            initialize(node) {
              node.enableProxy(
                () => target[child.id],
                (value) => (target[child.id] = value)
              );
            },
          })
        );
        continue;
      }
      if (valueType == "string") {
        property.children!.push(
          StringProp(child.id, {
            value: String(child.value),
            name: child.name,
            initialize(node) {
              node.enableProxy(
                () => target[child.id],
                (value) => (target[child.id] = value)
              );
            },
          })
        );
      }
      if (valueType == "boolean") {
        property.children!.push(
          BooleanProp(child.id, {
            value: Boolean(child.value),
            name: child.name,
            initialize(node) {
              node.enableProxy(
                () => target[child.id],
                (value) => (target[child.id] = value)
              );
            },
          })
        );
      }
      if (valueType == "number") {
        property.children!.push(
          FloatProp(child.id, {
            value: Number(child.value),
            name: child.name,
            initialize(node) {
              node.enableProxy(
                () => target[child.id],
                (value) => (target[child.id] = value)
              );
            },
          })
        );
      }
      continue;
    } else {
      if (child.meta?.type == "vector-3") {
        property.children!.push(
          Vec3Prop(child.id, {
            value: child.value as any,
            name: child.name,
            initialize(node) {
              node.enableProxy(
                () => target[child.id],
                (value) => {
                  target[child.id].x = value.x;
                  target[child.id].y = value.y;
                  target[child.id].z = value.z;
                }
              );
            },
          })
        );
        continue;
      }
      if (child.meta?.type == "vector-2") {
        property.children!.push(
          Vec2Prop(child.id, {
            value: child.value as any,
            name: child.name,
            initialize(node) {
              node.enableProxy(
                () => target[child.id],
                (value) => {
                  target[child.id].x = value.x;
                  target[child.id].y = value.y;
                }
              );
            },
          })
        );
        continue;
      }
      const prop = ObjectProp(child.id, child.name || child.id);
      prop.children = [];
      traverseTransform(child!, prop, target[child.id]);
    }
  }
  return property;
};
/** Convert a NCS component schema into a a form schema for an UI. */
export default function convertSchema(schema: SchemaCursor) {
  return Schema.CreateInstance(
    ...traverseTransform(
      schema.__view.schema.root,
      ObjectProp("root", "root"),
      schema
    ).children!
  );
}
