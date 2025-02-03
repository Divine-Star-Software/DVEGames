import { NCS } from "@amodx/ncs/";
import { UniversalCamera, Vector3 } from "@babylonjs/core";
import { TransformNodeComponent } from "../Base/TransformNode.component";
import { CameraProviderComponent } from "../Providers/CameraProvider.component";
import { BabylonContext } from "../../Contexts/Babylon.context";
import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
export const FirstPersonCameraComponent = NCS.registerComponent({
  type: "first-person-camera",
  data: NCS.data<{
    camera: UniversalCamera;
  }>(),
  init(component) {
    const position = TransformComponent.getRequired(component.node).schema
      .position;
    const tranformNodeComponent = TransformNodeComponent.getRequiredParent(
      component.node
    )!;
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
    camera.attachControl(undefined, true);

    component.data = {
      camera,
    };

    tranformNodeComponent.data.parent(camera);

    camera.computeWorldMatrix();

    const provider = CameraProviderComponent.get(component.node);
    if (provider)
      provider.data = {
        camera,
      };
  },
  dispose: (component) => component.data.camera.dispose(),
});
