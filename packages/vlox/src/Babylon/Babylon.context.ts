import { NCS } from "@amodx/ncs/";
import type { Scene, Engine, UtilityLayerRenderer } from "@babylonjs/core";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";
export const BabylonContext = NCS.registerContext<
  {},
  {
    scene: Scene;
    engine: Engine;
    renderer: DVEBabylonRenderer;
    utilLayer?: UtilityLayerRenderer;
  }
>({
  type: "babylon",
});
