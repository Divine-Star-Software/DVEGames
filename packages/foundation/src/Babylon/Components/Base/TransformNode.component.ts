import { NCS } from "@amodx/ncs/";
import { TransformNode, Node as BabylonNode } from "@babylonjs/core";
import { Vector3Like } from "@amodx/math";
import { StringProp } from "@amodx/schemas";
import { ProxyTransformTrait } from "../../../Core/Traits/Base/ProxyTransform.trait";
import { SyncTransformTrait } from "../../../Core/Traits/Base/SyncTransform.trait";

type Schema = {
  mode: "proxy" | "sync";
};

interface Data {
  transformNode: TransformNode;
}
interface Logic {
  parent(node: BabylonNode): void;
  getWorldPosition(): Vector3Like;
}

export const TransformNodeComponent = NCS.registerComponent<
  Schema,
  Data,
  Logic
>({
  type: "transform-node",
  schema: [StringProp("mode", { value: "proxy" })],
  init(component) {
    const transformNode = new TransformNode(
      `transform-component-${component.node.id.idString}`,
      component.node.graph.dependencies.scene
    );

    if (component.schema.mode == "proxy") {
      const trait = ProxyTransformTrait.set(component);
      trait.data.position = transformNode.position;
      trait.data.rotation = transformNode.rotation;
      trait.data.scale = transformNode.scaling;
    }
    if (component.schema.mode == "sync") {
      const trait = SyncTransformTrait.set(component);
      trait.data.position = transformNode.position;
      trait.data.rotation = transformNode.rotation;
      trait.data.scale = transformNode.scaling;
    }
    console.log(component, component.data);

    transformNode.computeWorldMatrix();
    component.data = {
      transformNode,
    };
    const parent = TransformNodeComponent.get(component.node.parent);
    if (parent) {
      component.data.transformNode.parent = parent.data.transformNode;
      component.data.transformNode.computeWorldMatrix();
    }
  },
  dispose(component) {
    component.data.transformNode
      .getChildren()
      .forEach((_) => (_.parent = null));
    component.data.transformNode.dispose();
  },
  logic: (component) => {
    return {
      getWorldPosition() {
        return component.data.transformNode.getAbsolutePosition();
      },
      parent(node: BabylonNode) {
        if (!node) return;
        node.parent = component.data.transformNode;
        const traverse = (node: BabylonNode) => {
          node.computeWorldMatrix();
          for (const child of node.getChildren()) {
            traverse(child);
          }
        };
        traverse(node);
      },
    };
  },
});
