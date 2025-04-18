import { NCS } from "@amodx/ncs";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";
import { BabylonContext } from "../Babylon/Babylon.context";
export const AxesViewerComponent = NCS.registerComponent({
  type: "axes-viewer",
  schema: NCS.schema({
    visible: NCS.property(true),
  }),
  data: NCS.data<{
    parent: Mesh;
    viewer: AxesViewer;
  }>(),
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node)!.data;
    const viewer = new AxesViewer(scene);
    const parent = new Mesh("", scene);
    parent.scaling.set(20, 20, 20);
    viewer.xAxis.parent = parent;
    viewer.yAxis.parent = parent;
    viewer.zAxis.parent = parent;
    parent.renderingGroupId = -1;
    component.data = {
      viewer,
      parent,
    };
    component.schema
      .getCursor()
      .getOrCreateObserver(component.schema.getSchemaIndex().visible)
      .subscribe((value) => {
        parent.setEnabled(Boolean(value));
      });
  },
  dispose(component) {
    component.data.viewer.dispose();
    component.data.parent.dispose();
  },
});
