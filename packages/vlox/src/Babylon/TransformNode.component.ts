import { ComponentCursor, NCS } from "@amodx/ncs/";
import { TransformNode, Node as BabylonNode } from "@babylonjs/core";
import { Vector3Like } from "@amodx/math";

import {
  createTransformProxy,
  TransformComponent,
} from "../Transform.component";
import { BabylonContext } from "./Babylon.context";

class Data {
  transformNode: TransformNode;
  constructor(public component: (typeof TransformNodeComponent)["default"]) {}
  getWorldPosition() {
    return this.component.data.transformNode.getAbsolutePosition();
  }
  parent(node: BabylonNode) {
    if (!node) return;
    node.parent = this.component.data.transformNode;
    const traverse = (node: BabylonNode) => {
      node.computeWorldMatrix();
      for (const child of node.getChildren()) {
        traverse(child);
      }
    };
    traverse(node);
  }
}

export const TransformNodeComponent = NCS.registerComponent({
  type: "transform-node",
  schema: NCS.schema({
    mode: NCS.property(""),
  }),
  data: NCS.data<Data>(),
  init(component) {
    component.data = new Data(component.cloneCursor());
    const context = BabylonContext.getRequired(component.node).data;
    const transformNode = new TransformNode(
      `transform-component-${component.node.index}`,
      context.scene
    );
    component.data.transformNode = transformNode;
    const tranform = TransformComponent.getRequired(component.node);
    Vector3Like.Copy(transformNode.position, tranform.schema.position);
    Vector3Like.Copy(transformNode.rotation, tranform.schema.rotation);
    Vector3Like.Copy(transformNode.scaling, tranform.schema.scale);

    if (component.schema.mode == "proxy") {
      createTransformProxy(
        tranform,
        transformNode.position,
        transformNode.rotation,
        transformNode.scaling
      );
    }
    if (component.schema.mode == "sync") {
    }

    transformNode.computeWorldMatrix();

    const parent = TransformNodeComponent.getParent(component.node);
    if (parent) {
      component.data.transformNode.parent = parent.data.transformNode;
      component.data.transformNode.computeWorldMatrix();
    }
    tranform.returnCursor();
  },
  dispose(component) {
    const children = component.data.transformNode.getChildren();
    for (let i = 0; i < children.length; i++) {
      children[i].parent = null;
    }
    component.data.transformNode.dispose();
    component.data.component.returnCursor();
  },
});
