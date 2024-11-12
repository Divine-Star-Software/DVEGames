import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";

type Schema = {};
type Data = {
  dve: DivineVoxelEngineNexus;
};

export const NexusContext = NCS.registerContext<Schema, Data>({
  type: "dve-nexus",
});
