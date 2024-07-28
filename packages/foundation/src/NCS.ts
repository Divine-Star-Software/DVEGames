import type { Scene, Engine, UtilityLayerRenderer } from "@babylonjs/core";

declare module "@amodx/ncs/" {
  interface GraphDependencies {
    scene: Scene;
    engine: Engine;
    utilLayer: UtilityLayerRenderer;
  }
}
