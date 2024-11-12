import { NCS } from "@amodx/ncs/";
import type { Camera } from "@babylonjs/core";

export const CameraProviderComponent = NCS.registerComponent<
  {},
  {
    camera: Camera;
  }
>({
  type: "camera-provider",
});
