import { NCS } from "@amodx/ncs/";
import { TransformNode, Node as BabylonNode } from "@babylonjs/core";
import { Vector3Like } from "@amodx/math";
import {
  createTransformProxy,
  TransformComponent,
} from "./Transform.component";
interface Data {
  transformNode: TransformNode;
}
interface Logic {
  parent(node: BabylonNode): void;
  getWorldPosition(): Vector3Like;
}

export const TransformNodeComponent = NCS.registerComponent<{}, Data, Logic>({
  type: "transform-node",
  schema: [],
  init(component) {
    const transformNode = new TransformNode(
      `transform-component-${component.node.id.idString}`,
      component.node.graph.dependencies.scene
    );

    const transformComponent = TransformComponent.get(component.node)!;
    Vector3Like.Copy(
      transformNode.position,
      transformComponent.schema.position
    );
    Vector3Like.Copy(
      transformNode.rotation,
      transformComponent.schema.rotation
    );
    Vector3Like.Copy(transformNode.scaling, transformComponent.schema.scale);
    createTransformProxy(
      transformComponent,
      transformNode.position,
      transformNode.rotation,
      transformNode.scaling
    );

    transformNode.computeWorldMatrix();
    component.data.transformNode = transformNode;
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
