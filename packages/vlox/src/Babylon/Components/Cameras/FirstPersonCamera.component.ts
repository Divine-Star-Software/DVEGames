import { NCS } from "@amodx/ncs/";
import { UniversalCamera, Vector3 } from "@babylonjs/core";
import { Vec3Array } from "@amodx/math";

import { Vec3Prop } from "@amodx/schemas";
import { TransformNodeComponent } from "../Base/TransformNode.component";
import { CameraProviderComponent } from "../Providers/CameraProvider.component";
import { BabylonContext } from "../../Contexts/Babylon.context";
import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
interface Data {
  camera: UniversalCamera;
}
interface FirstPersonCameraData {
  position: Vec3Array;
  rotation: Vec3Array;
}
export const FirstPersonCameraComponent = NCS.registerComponent<
  FirstPersonCameraData,
  Data
>({
  type: "first-person-camera",
  schema: [Vec3Prop("position"), Vec3Prop("rotation")],
  init(component) {
    const position = TransformComponent.get(component.node)!.schema.position;
    const tranformNodeComponent = TransformNodeComponent.get(component.node)!;
    const { scene } = BabylonContext.getRequired(component.node)!.data;
    const camera = new UniversalCamera(
      "",
      new Vector3(position.x, position.y, position.z),
      scene
    );
    camera.setTarget(Vector3.Zero());
    camera.maxZ = 1000;
    camera.fov = 1.8;
    camera.minZ = 0.01;

    scene.activeCamera = camera;
    camera.attachControl(scene, true);

    component.data = {
      camera,
    };

    tranformNodeComponent.logic.parent(camera);

    camera.computeWorldMatrix();

    const provider = CameraProviderComponent.get(component.node);
    if (provider)
      provider.data = {
        camera,
      };
  },
  dispose(component) {
    component.data.camera.dispose();
  },

});
