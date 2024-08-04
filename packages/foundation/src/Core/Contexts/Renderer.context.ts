import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render";
import { DVEFBRCore } from "@divinevoxel/babylon-renderer/Defaults/Foundation/DVEFBRCore";

type Schema = {};
type Data = {
  dve: DivineVoxelEngineRender;
  dveCore: DVEFBRCore;
};

export const RendererContext = NCS.registerContext<Schema, Data>({
  type: "dve-renderer",
});
