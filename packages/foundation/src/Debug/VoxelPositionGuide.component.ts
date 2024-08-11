import { NCS, NodeInstance } from "@amodx/ncs";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { CheckboxProp } from "@amodx/schemas";
import {
  PositionGizmo,
  TransformNode,
  UtilityLayerRenderer,
} from "@babylonjs/core";
import { BabylonContext } from "../Babylon/Contexts/Babylon.context";
import {
  createTransformProxy,
  TransformComponent,
} from "../Core/Components/Base/Transform.component";
import { createVoxelBoxVolumneMesh } from "../Core/Components/Voxels/Volumes/VoxelBoxVolumeMesh.component";
type Schema = {
  visible: boolean;
};
interface Data {
  parent: TransformNode;
  positionGizmo: PositionGizmo;
}
export const VoxelPositionGuideComponent = NCS.registerComponent<Schema, Data>({
  type: "voxel-position-guide",
  schema: [CheckboxProp("visible", { value: true })],
  init(component) {
    const context = BabylonContext.getRequired(component.node).data;

    const { scene } = context;
    if (!context.utilLayer) {
      context.utilLayer = new UtilityLayerRenderer(scene);
    }
    const box = createVoxelBoxVolumneMesh(scene);
    const transformComponent = TransformComponent.get(component.node)!;
    const node = new TransformNode("", scene);
    box.parent = node;
    const oldPosition = node.position.clone();
    const nodeStartPosition = node.position.clone();

    createTransformProxy(
      transformComponent,
      node.position,
      node.rotation,
      node.scaling
    );

    const positionGizmo = new PositionGizmo(context.utilLayer);
    positionGizmo.snapDistance = 1;
    positionGizmo.attachedNode = node;
    positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
    positionGizmo.onDragStartObservable.add(() => {
      nodeStartPosition.copyFrom(node.position);
      oldPosition.set(
        transformComponent.schema.position.x,
        transformComponent.schema.position.y,
        transformComponent.schema.position.z
      );
    });
    positionGizmo.onDragEndObservable.add(() => {
      nodeStartPosition.copyFrom(node.position);
    });
    positionGizmo.onDragObservable.add(() => {
      const transform = nodeStartPosition.subtract(node.position).floor();
      transformComponent.schema.position = {
        x: oldPosition.x - transform.x,
        y: oldPosition.y - transform.y,
        z: oldPosition.z - transform.z,
      };
    });
    component.data.positionGizmo = positionGizmo;
    component.data.parent = node;

    component.addOnSchemaUpdate(["visible"], (node) => {
      const isVisible = Boolean(node.get());
      component.data.positionGizmo.xGizmo.isEnabled = isVisible;
      component.data.positionGizmo.yGizmo.isEnabled = isVisible;
      component.data.positionGizmo.zGizmo.isEnabled = isVisible;
      component.data.parent.setEnabled(isVisible);
    });
  },
  dispose(component) {
    component.data.positionGizmo.dispose();
    component.data.parent.dispose();
  },
});
