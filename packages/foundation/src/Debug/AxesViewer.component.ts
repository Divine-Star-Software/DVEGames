import { NCS, NodeInstance } from "@amodx/ncs";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";
import { RendererContext } from "../Core/Contexts/Renderer.context"
import { BabylonContext } from "../Babylon/Contexts/Babylon.context";
interface Schema {}
interface Data {
  parent: Mesh;
  viwer: AxesViewer;
}
export const AxesViewerComponent = NCS.registerComponent<Schema, Data>({
  type: "axes-viewer",
  schema: [],
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node)!.data;
    const axes = new AxesViewer(scene);
    const parent = new Mesh("", scene);
    parent.scaling.set(20, 20, 20);
    axes.xAxis.parent = parent;
    axes.yAxis.parent = parent;
    axes.zAxis.parent = parent;
    parent.renderingGroupId = -1;
    component.data.viwer = axes;
    component.data.parent = parent;
  },
  dispose(component) {
    component.data.viwer.dispose();
    component.data.parent.dispose();
  },
});
