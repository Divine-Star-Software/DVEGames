import { NCS } from "@amodx/ncs/";
import { DivineVoxelEngineWorld } from "@divinevoxel/vlox/Contexts/World/DivineVoxelEngineWorld";

type Schema = {};
type Data = {
  dve: DivineVoxelEngineWorld;

};

export const WorldContext = NCS.registerContext<Schema, Data>({
  type: "dve-world",
});
