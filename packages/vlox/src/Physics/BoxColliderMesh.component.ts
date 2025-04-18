import { NCS } from "@amodx/ncs/";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { StandardMaterial, type Mesh } from "@babylonjs/core";

import { BoxColliderComponent } from "./BoxCollider.component";
import { BabylonContext } from "../Babylon/Babylon.context";

export const BoxColliderMeshComponent = NCS.registerComponent({
  type: "box-collider-mesh",
  data: NCS.data<{ box: Mesh }>(),
  shared: {
    material: <StandardMaterial | null>null,
    box: <Mesh | null>null,
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

    //  const trait = SyncTransformTrait.set(component);
    //  trait.data.position = box.position;

    box.material = component.shared.material;

    component.data = { box };
  },
  dispose: (component) => component.data.box.dispose(),
});
