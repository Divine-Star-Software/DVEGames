import { NCS } from "@amodx/ncs/";
import { IVoxelTemplate } from "@divinevoxel/vlox/Templates/VoxelTemplates.types";
export const VoxelTemplateProvider = NCS.registerComponent({
  type: "voxel-template-provider",
  data: NCS.data<IVoxelTemplate<any, any>>(),
});
