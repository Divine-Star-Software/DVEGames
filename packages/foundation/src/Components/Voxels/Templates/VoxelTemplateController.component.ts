import { ComponentData, NCS } from "@amodx/ncs/";
import { StringProp, Vec3Prop } from "@amodx/schemas";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import {
  PositionGizmo,
  StandardMaterial,
  UtilityLayerRenderer,
  type Mesh,
} from "@babylonjs/core";
import { TransformComponent,createTransformProxy } from "../../Base/Transform.component";
import { Vector3Like, } from "@amodx/math";

interface Schema {}
class Data {
  box: Mesh;
  gizmo: PositionGizmo;
}

class Logic {
  constructor(
    public component: (typeof VoxelTemplateControllerComponent)["default"]
  ) {}
}

type Shared = {
  material: StandardMaterial | null;
  box: Mesh | null;
};

export const VoxelTemplateControllerComponent = NCS.registerComponent<
  Schema,
  Data,
  Logic,
  Shared
>({
  type: "voxel-template-controller",
  schema: [StringProp("dimension"), Vec3Prop("start"), Vec3Prop("end")],
  data: () => new Data(),
  logic: (component): Logic => new Logic(component),
  shared: {
    material: null,
    box: null,
  },
  init(component) {
    if (!component.getDependencies().utilLayer) {
      component.getDependencies().utilLayer = new UtilityLayerRenderer(
        component.getDependencies().scene
      );
    }
    if (!component.shared.material) {
      component.shared.material = new StandardMaterial(
        "",
        component.getDependencies().scene
      );
      component.shared.material.alpha = 0.7;
      component.shared.material.diffuseColor.set(0, 1, 0);
    }
    if (!component.shared.box) {
      component.shared.box = CreateBox("");
      component.shared.box.enableEdgesRendering();
      component.shared.box.material = component.shared.material;
    }
    const transformComponent = TransformComponent.get(component.node)!;
    const box = component.shared.box.clone();
    Vector3Like.Copy(box.position, transformComponent.schema.position);
    Vector3Like.Copy(box.rotation, transformComponent.schema.rotation);
    Vector3Like.Copy(box.scaling, transformComponent.schema.scale);
    createTransformProxy(
      transformComponent,
      box.position,
      box.rotation,
      box.scaling
    );
    box.material = component.shared.material;
    component.data.box = box;
 
    const gizmo = new PositionGizmo(component.getDependencies().utilLayer);
    gizmo.snapDistance = 1;

    gizmo.attachedMesh = box;

    gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    gizmo.onDragObservable.add(() => {});

    component.data.gizmo = gizmo;
  },
  dispose(component) {
    component.data.box.dispose();
    component.data.gizmo.dispose();
  },
});
