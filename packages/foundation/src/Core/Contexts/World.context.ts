import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineWorld } from "@divinevoxel/core/Contexts/World/DivineVoxelEngineWorld";
import { DVEFWorldCore } from "@divinevoxel/foundation/Contexts/World/DVEFWorldCore";

type Schema = {};
type Data = {
  dve: DivineVoxelEngineWorld;
  dveCore: DVEFWorldCore;
};

export const WorldContext = NCS.registerContext<Schema, Data>({
  type: "dve-world",
});
