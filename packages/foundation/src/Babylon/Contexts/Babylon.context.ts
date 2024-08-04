import { NCS } from "@amodx/ncs/";
import type { Scene, Engine, UtilityLayerRenderer } from "@babylonjs/core";

type Schema = {};
type Data = {
  scene: Scene;
  engine: Engine;
  utilLayer?: UtilityLayerRenderer;
};

export const BabylonContext = NCS.registerContext<Schema, Data>({
  type: "babylon",
});
