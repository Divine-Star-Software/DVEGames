import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";

type Data = {
  dve: DivineVoxelEngineRender;
};

export const RendererContext = NCS.registerContext<{}, Data>({
  type: "dve-renderer",
});
