import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";

type Data = {
  dve: DivineVoxelEngineNexus;
};

export const NexusContext = NCS.registerContext<{}, Data>({
  type: "dve-nexus",
});
