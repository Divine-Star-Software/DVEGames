import { ComponentData, NCS } from "@amodx/ncs/";
import {
  PositionGizmo,
  ScaleGizmo,
  StandardMaterial,
  TransformNode,
  UtilityLayerRenderer,
  type Mesh,
} from "@babylonjs/core";

import { TransformComponent } from "../../Base/Transform.component";
import { CheckboxProp, SelectProp } from "@amodx/schemas";
import { VoxelBoxVolumeMeshComponent } from "./VoxelBoxVolumeMesh.component";
import { RendererContext } from "../../../Contexts/Renderer.context";
import { BabylonContext } from "../../../../Babylon/Contexts/Babylon.context";

interface Schema {
  mode: "position" | "scale";
  visible: boolean;
}
class Data {
  node: TransformNode;
  positionGizmo: PositionGizmo | null;
  scaleGizmo: ScaleGizmo | null;
}

export const VoxelBoxVolumeControllerComponent = NCS.registerComponent<
  Schema,
  Data
>({
  type: "voxel-box-volume-controller",
  schema: [
    SelectProp("mode", {
      value: "position",
      options: ["position", "scale"],
    }),
    CheckboxProp("visible", { value: true }),
  ],
  data: () => new Data(),
  init(component) {
    const context = BabylonContext.getRequired(component.node).data;

    const { scene } = context;
    if (!context.utilLayer) {
      context.utilLayer = new UtilityLayerRenderer(scene);
    }
    const volumeMesh = VoxelBoxVolumeMeshComponent.get(component.node)!;
    const transformComponent = TransformComponent.get(component.node)!;

    const box = volumeMesh.data.box;

    const transformNode = new TransformNode("", scene);
    component.data.node = transformNode;
    component.addOnSchemaUpdate(["visible"], (node) =>
      transformNode.setEnabled(Boolean(node.get()))
    );

    transformNode.position.x = box.position.x + box.scaling.x / 2;
    transformNode.position.y = box.position.y + box.scaling.y / 2;
    transformNode.position.z = box.position.z + box.scaling.z / 2;

    const oldPosition = transformNode.position.clone();
    const nodeStartPosition = transformNode.position.clone();
    const oldScale = box.scaling.clone();
    const nodeStartScale = box.scaling.clone();

    const position = () => {
      const positionGizmo = new PositionGizmo(context.utilLayer);
      positionGizmo.snapDistance = 1;
      positionGizmo.attachedNode = transformNode;
      positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
      positionGizmo.onDragStartObservable.add(() => {
        nodeStartPosition.copyFrom(transformNode.position);
        oldPosition.set(
          transformComponent.schema.position.x,
          transformComponent.schema.position.y,
          transformComponent.schema.position.z
        );
      });
      positionGizmo.onDragEndObservable.add(() => {
        nodeStartPosition.copyFrom(transformNode.position);
      });
      positionGizmo.onDragObservable.add(() => {
        const transform = nodeStartPosition
          .subtract(transformNode.position)
          .floor();
        transformComponent.schema.position = {
          x: oldPosition.x - transform.x,
          y: oldPosition.y - transform.y,
          z: oldPosition.z - transform.z,
        };
      });
      component.data.positionGizmo = positionGizmo;
    };

    const scale = () => {
      const scaleGizmo = new ScaleGizmo(context.utilLayer);
      scaleGizmo.sensitivity = 2;
      scaleGizmo.attachedNode = transformNode;
      scaleGizmo.onDragStartObservable.add(() => {
        nodeStartScale.copyFrom(transformNode.scaling);
        oldScale.set(
          transformComponent.schema.scale.x,
          transformComponent.schema.scale.y,
          transformComponent.schema.scale.z
        );
      });
      scaleGizmo.onDragEndObservable.add(() => {
        nodeStartScale.copyFrom(transformNode.scaling);
      });
      scaleGizmo.onDragObservable.add(() => {
        if (transformNode.scaling.x <= 0) transformNode.scaling.x = 1;
        if (transformNode.scaling.y <= 0) transformNode.scaling.y = 1;
        if (transformNode.scaling.z <= 0) transformNode.scaling.z = 1;
        const transform = nodeStartScale
          .subtract(transformNode.scaling)
          .floor();

        const x = oldScale.x - transform.x;
        const y = oldScale.y - transform.y;
        const z = oldScale.z - transform.z;
        transformComponent.schema.scale = {
          x: x <= 0 ? 1 : x,
          y: y <= 0 ? 1 : y,
          z: z <= 0 ? 1 : z,
        };
      });
      component.data.scaleGizmo = scaleGizmo;
    };

    position();

    component.addOnSchemaUpdate(["mode"], (node) => {
      const mode = node.get();
      if (mode == "position") {
        component.data.scaleGizmo?.dispose();
        position();
      }
      if (mode == "scale") {
        component.data.positionGizmo?.dispose();
        scale();
      }
    });
  },
  dispose(component) {
    component.data.node.dispose();
    component.data.positionGizmo?.dispose();
    component.data.scaleGizmo?.dispose();
  },
});