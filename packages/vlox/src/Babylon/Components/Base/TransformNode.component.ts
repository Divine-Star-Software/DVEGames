import { NCS } from "@amodx/ncs/";
import { TransformNode, Node as BabylonNode } from "@babylonjs/core";
import { Vector3Like } from "@amodx/math";

import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
import { BabylonContext } from "Babylon/Contexts/Babylon.context";

class ComponentSchema {
  mode: "proxy" | "sync" | "none" = "none";
}

interface Data {
  transformNode: TransformNode;
}
interface Logic {
  parent(node: BabylonNode): void;
  getWorldPosition(): Vector3Like;
}

class Logic {
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

export const TransformNodeComponent = NCS.registerComponent<
  ComponentSchema,
  Data,
  Logic
>({
  type: "transform-node",
  schema: NCS.schemaFromObject(new ComponentSchema()),
  init(component) {
    component.logic = new Logic(component.cloneCursor());
    const context = BabylonContext.getRequired(component.node).data;
    const transformNode = new TransformNode(
      `transform-component-${component.node.index}`,
      context.scene
    );
    const tranform = TransformComponent.getRequired(component.node);
    Vector3Like.Copy(transformNode.position, tranform.schema.position);
    Vector3Like.Copy(transformNode.rotation, tranform.schema.rotation);
    Vector3Like.Copy(transformNode.scaling, tranform.schema.scale);

    if (component.schema.mode == "proxy") {
    }
    if (component.schema.mode == "sync") {
    }

    transformNode.computeWorldMatrix();
    component.data = {
      transformNode,
    };
    const parent = TransformNodeComponent.getParent(component.node);
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
    component.logic.component.returnCursor();
  },
});
