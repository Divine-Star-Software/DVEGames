import { NCS } from "@amodx/ncs/";
import type { Scene, Engine, UtilityLayerRenderer } from "@babylonjs/core";
export const BabylonContext = NCS.registerContext<
  {},
  {
    scene: Scene;
    engine: Engine;
    utilLayer?: UtilityLayerRenderer;
  }
>({
  type: "babylon",
});
