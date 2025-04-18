import { NCS } from "@amodx/ncs/";
import { IVoxelSelection } from "@divinevoxel/vlox/Templates/Selection/VoxelSelecton";
export const VoxelSelectionProvider = NCS.registerComponent({
  type: "voxel-selection-provider",
  data: NCS.data<IVoxelSelection>(),
});
