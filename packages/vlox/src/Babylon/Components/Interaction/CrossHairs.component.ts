import { NCS } from "@amodx/ncs/";
import { BabylonContext } from "../../Contexts/Babylon.context";
import { CreateBox, StandardMaterial, TransformNode } from "@babylonjs/core";

export const CrossHairsComponent = NCS.registerComponent({
  type: "cross-hairs",
  init(comp) {
    const context = BabylonContext.getRequired(comp.node);

    const camera = context.data.scene.activeCamera!;

    const node = new TransformNode(
      `${comp.node.id.idString}-cross-hairs-node`,
      context.data.scene
    );
  
    node.position.z = 10;
    node.parent = camera;
    const mat = new StandardMaterial(
      `${comp.node.id.idString}-cross-hairs-mat`,
      context.data.scene
    );
    mat.diffuseColor.set(1, 1, 1);
    const vertical = CreateBox(
      `${comp.node.id.idString}-cross-hairs-vertical`,
      { width: 0.1, height: 1, depth: 1 },
      context.data.scene
    );
    vertical.renderingGroupId = 3;
    const horizontal = CreateBox(
      `${comp.node.id.idString}-cross-hairs-horizonatal`,
      { width: 1, height: 0.1, depth: 1 },
      context.data.scene
    );
    horizontal.renderingGroupId = 3;
    horizontal.material = mat;
    vertical.material = mat;
    horizontal.parent = node;
    vertical.parent = node;

    comp.observers.disposed.subscribeOnce(() => {
      node.dispose();
    });
  },
});
