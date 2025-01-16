import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { DVEBabylonRenderer } from "@divinevoxel/vlox-babylon/Renderer/DVEBabylonRenderer";

type Data = {
  dve: DivineVoxelEngineRender;
  dveCore: DVEBabylonRenderer;
};

export const RendererContext = NCS.registerContext<{}, Data>({
  type: "dve-renderer",
});
