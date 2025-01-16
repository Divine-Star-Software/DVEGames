import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineWorld } from "@divinevoxel/vlox/Contexts/World/DivineVoxelEngineWorld";

type Data = {
  dve: DivineVoxelEngineWorld;
};

export const WorldContext = NCS.registerContext<{}, Data>({
  type: "dve-world",
});
