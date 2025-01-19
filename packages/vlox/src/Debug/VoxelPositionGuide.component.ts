import { NCS } from "@amodx/ncs";
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
export const VoxelPositionGuideComponent = NCS.registerComponent({
  type: "voxel-position-guide",
  schema: NCS.schema({
    visible: NCS.property(true),
  }),
  data: NCS.data<{
    parent: TransformNode;
    positionGizmo: PositionGizmo;
  }>(),
  init(component) {
    const context = BabylonContext.getRequired(component.node).data;

    const { scene } = context;
    if (!context.utilLayer) {
      context.utilLayer = new UtilityLayerRenderer(scene);
    }
    const box = createVoxelBoxVolumneMesh(scene);
    const transformComponent = TransformComponent.get(component.node)!;
    const parent = new TransformNode("", scene);
    box.parent = parent;
    const oldPosition = parent.position.clone();
    const nodeStartPosition = parent.position.clone();

    createTransformProxy(
      transformComponent,
      parent.position,
      parent.rotation,
      parent.scaling
    );

    const positionGizmo = new PositionGizmo(context.utilLayer);
    positionGizmo.snapDistance = 1;
    positionGizmo.attachedNode = parent;
    positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
    positionGizmo.onDragStartObservable.add(() => {
      nodeStartPosition.copyFrom(parent.position);
      oldPosition.set(
        transformComponent.schema.position.x,
        transformComponent.schema.position.y,
        transformComponent.schema.position.z
      );
    });
    positionGizmo.onDragEndObservable.add(() => {
      nodeStartPosition.copyFrom(parent.position);
    });
    positionGizmo.onDragObservable.add(() => {
      const transform = nodeStartPosition.subtract(parent.position).floor();
      transformComponent.schema.position = {
        x: oldPosition.x - transform.x,
        y: oldPosition.y - transform.y,
        z: oldPosition.z - transform.z,
      };
    });
    component.data = {
      positionGizmo,
      parent,
    };

    const cursor = component.schema.getCursor();
    const index = component.schema.getSchemaIndex();
    cursor.getOrCreateObserver(index.visible).subscribe((isVisible) => {
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
