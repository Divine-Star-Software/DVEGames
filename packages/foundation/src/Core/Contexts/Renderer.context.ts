import { NCS } from "@amodx/ncs/";
import type { Scene, Engine, UtilityLayerRenderer } from "@babylonjs/core";
import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render";
import { DVEFBRCore } from "@divinevoxel/babylon-renderer/Defaults/Foundation/DVEFBRCore";

type Schema = {};
type Data = {
  dve: DivineVoxelEngineRender;
  dveCore: DVEFBRCore;
  scene: Scene;
  engine: Engine;
  utilLayer?: UtilityLayerRenderer;
};

export const RendererContext = NCS.registerContext<Schema, Data>({
  type: "dve-renderer",
});
