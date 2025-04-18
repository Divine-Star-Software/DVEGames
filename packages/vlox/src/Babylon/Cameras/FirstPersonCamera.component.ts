import { NCS } from "@amodx/ncs/";
import { Tools, UniversalCamera, Vector3 } from "@babylonjs/core";
import { TransformNodeComponent } from "../TransformNode.component";
import { CameraProviderComponent } from "../Providers/CameraProvider.component";
import { BabylonContext } from "../Babylon.context";
import { TransformComponent } from "../../Transform.component";
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
    camera.maxZ = 600;
    camera.fov = Tools.ToRadians(70)
    camera.minZ = 0.1;

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
