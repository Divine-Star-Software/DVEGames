import { NCS } from "@amodx/ncs";
import { VoxelShapeTemplateProvider } from "./VoxelShapeTemplateProvider.component";
import { PyramidVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/PyramidVoxelTemplate";
import { VoxelShapeTemplateShapeDirections } from "@divinevoxel/vlox/Templates/Shapes/VoxelShapeTemplate.types";
export const PyramidVoxelTemplateComponent = NCS.registerComponent({
  type: "pyramid-voxel-template",
  schema: NCS.schema({
    width: NCS.property(12),
    height: NCS.property(12),
    depth: NCS.property(12),
    direction: NCS.property<VoxelShapeTemplateShapeDirections>("+y"),
    fallOff: NCS.property(1),
  }),
  init(component) {
    const provider = VoxelShapeTemplateProvider.getRequired(component.node);
    const template = new PyramidVoxelTemplate(
      PyramidVoxelTemplate.CreateNew({
        width: component.schema.width,
        height: component.schema.height,
        depth: component.schema.depth,
        direction: component.schema.direction,
        fallOff: component.schema.fallOff,
      })
    );
    provider.data = template;
    const cursor = component.schema.getCursor();
    const index = component.schema.getSchemaIndex();
    cursor.setProxy(index.width, template, "width");
    cursor.setProxy(index.height, template, "height");
    cursor.setProxy(index.depth, template, "depth");
    cursor.setProxy(index.direction, template, "direction");
    cursor.setProxy(index.fallOff, template, "fallOff");
  },
  dispose(component) {
    const provider = VoxelShapeTemplateProvider.get(component.node);
    if (!provider) return;
    if (component.data == provider.data) {
      (provider as any).data = null;
    }
  },
});
