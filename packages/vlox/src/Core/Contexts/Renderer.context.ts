import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";

type Schema = {};
type Data = {
  dve: DivineVoxelEngineRender;
  dveCore: DVEBabylonRenderer;
};

export const RendererContext = NCS.registerContext<Schema, Data>({
  type: "dve-renderer",
});
