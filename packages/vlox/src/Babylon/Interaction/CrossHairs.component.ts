import { NCS } from "@amodx/ncs/";
import { BabylonContext } from "../Babylon.context";
import {
  CreateBox,
  StandardMaterial,
  TransformNode,
  ShaderMaterial,
  Effect,
} from "@babylonjs/core";
Effect.ShadersStore["crossHairsVertexShader"] = /*glsl */ `
precision highp float;
attribute vec3 position;
uniform mat4 world;
uniform mat4 viewProjection;
void main(void) {
  gl_Position = viewProjection * world *  vec4( position, 1.0 );
}
`;

Effect.ShadersStore["crossHairsFragmentShader"] = /*glsl */ `
precision highp float;
void main(void) {
  gl_FragColor = vec4(1.);
}
`;
export const CrossHairsComponent = NCS.registerComponent<TransformNode>({
  type: "cross-hairs",
  init(comp) {
    const context = BabylonContext.getRequired(comp.node);

    const camera = context.data.scene.activeCamera!;

    const node = new TransformNode(
      `${comp.node.index}-cross-hairs-node`,
      context.data.scene
    );

    node.position.z = 10;
    node.parent = camera;
    const mat = new ShaderMaterial(
      "shader",
      context.data.scene,
      {
        vertex: "crossHairs",
        fragment: "crossHairs",
      },
      {
        attributes: ["position"],
        uniforms: ["world", "viewProjection"],
        needAlphaBlending: true,
      }
    );

    const vertical = CreateBox(
      `${comp.node.index}-cross-hairs-vertical`,
      { width: 0.05, height: 1, depth: 1 },
      context.data.scene
    );
    vertical.renderingGroupId = 3;
    const horizontal = CreateBox(
      `${comp.node.index}-cross-hairs-horizonatal`,
      { width: 1, height: 0.05, depth: 1 },
      context.data.scene
    );
    horizontal.renderingGroupId = 3;
    horizontal.material = mat;
    vertical.material = mat;
    horizontal.parent = node;
    vertical.parent = node;

    comp.data = node;
  },
  dispose: (component) => component.data.dispose(),
});
