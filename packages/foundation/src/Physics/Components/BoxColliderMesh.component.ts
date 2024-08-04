import { NCS } from "@amodx/ncs/";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { StandardMaterial, type Mesh } from "@babylonjs/core";
import { RendererContext } from "../../Core/Contexts/Renderer.context";
import { SyncTransformTrait } from "../../Core/Traits/Base/SyncTransform.trait";
import { BoxColliderComponent } from "./BoxCollider.component";
import { BabylonContext } from "../../Babylon/Contexts/Babylon.context";

interface Schema {}
class Data {
  box: Mesh;
}

type Shared = {
  material: StandardMaterial | null;
  box: Mesh | null;
};

export const BoxColliderMeshComponent = NCS.registerComponent<
  Schema,
  Data,
  {},
  Shared
>({
  type: "box-collider-mesh",
  schema: [],
  data: () => new Data(),
  shared: {
    material: null,
    box: null,
  },
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node).data;

    if (!component.shared.material) {
      component.shared.material = new StandardMaterial("", scene);
      component.shared.material.alpha = 0.7;
      component.shared.material.diffuseColor.set(0, 0, 1);
    }
    if (!component.shared.box) {
      const box = CreateBox("", {}, scene);
      box.enableEdgesRendering();
      box.material = component.shared.material;
      component.shared.box = box;
    }
    const collider = BoxColliderComponent.get(component.node)!;
    const box = component.shared.box.clone();
    box.scaling.set(
      collider.schema.size.x,
      collider.schema.size.y,
      collider.schema.size.z
    );
    const trait = SyncTransformTrait.set(component);
    trait.data.position = box.position;

    box.material = component.shared.material;

    component.data.box = box;
  },
  dispose(component) {
    component.data.box.dispose();
  },
});
