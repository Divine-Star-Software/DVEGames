import { NCS } from "@amodx/ncs";
import { VoxelShapeTemplateProvider } from "./VoxelShapeTemplateProvider.component";
import { BoxVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/BoxVoxelTemplate";
export const BoxVoxelTemplateComponent = NCS.registerComponent({
  type: "box-voxel-template",
  schema: NCS.schema({
    width: NCS.property(5),
    height: NCS.property(5),
    depth: NCS.property(5),
  }),
  init(component) {
    const provider = VoxelShapeTemplateProvider.getRequired(component.node);
    const template = new BoxVoxelTemplate(
      BoxVoxelTemplate.CreateNew({
        width: component.schema.width,
        height: component.schema.height,
        depth: component.schema.depth,
      })
    );
    provider.data = template;
    const cursor = component.schema.getCursor();
    const index = component.schema.getSchemaIndex();
    cursor.setProxy(index.width, template, "width");
    cursor.setProxy(index.height, template, "height");
    cursor.setProxy(index.depth, template, "depth");
  },
  dispose(component) {
    const provider = VoxelShapeTemplateProvider.get(component.node);
    if (!provider) return;
    if (component.data == provider.data) {
      (provider as any).data = null;
    }
  },
});
