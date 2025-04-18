import { NCS } from "@amodx/ncs";
import { VoxelShapeTemplateProvider } from "./VoxelShapeTemplateProvider.component";
import { SphereVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/SphereVoxelTemplate";
export const SphereVoxelTemplateComponent = NCS.registerComponent({
  type: "sphere-voxel-template",
  schema: NCS.schema({
    radiusX: NCS.property(5),
    radiusY: NCS.property(5),
    radiusZ: NCS.property(5),
  }),
  init(component) {
    const provider = VoxelShapeTemplateProvider.getRequired(component.node);
    const template = new SphereVoxelTemplate(
      SphereVoxelTemplate.CreateNew({
        radiusX: component.schema.radiusX,
        radiusY: component.schema.radiusY,
        radiusZ: component.schema.radiusZ,
      })
    );
    provider.data = template;
    const cursor = component.schema.getCursor();
    const index = component.schema.getSchemaIndex();
    cursor.setProxy(index.radiusX, template, "radiusX");
    cursor.setProxy(index.radiusY, template, "radiusY");
    cursor.setProxy(index.radiusZ, template, "radiusZ");
  },
  dispose(component) {
    const provider = VoxelShapeTemplateProvider.get(component.node);
    if (!provider) return;
    if (component.data == provider.data) {
      (provider as any).data = null;
    }
  },
});
