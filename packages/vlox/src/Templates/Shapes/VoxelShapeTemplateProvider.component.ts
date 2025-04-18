import { NCS } from "@amodx/ncs/";
import { IVoxelShapeTemplate } from "@divinevoxel/vlox/Templates/Shapes/VoxelShapeTemplate.types";
export const VoxelShapeTemplateProvider = NCS.registerComponent({
  type: "voxel-shape-template-provider",
  data: NCS.data<IVoxelShapeTemplate<any,any>>(),
});
