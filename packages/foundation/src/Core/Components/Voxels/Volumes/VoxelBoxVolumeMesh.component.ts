import { ComponentData, NCS } from "@amodx/ncs/";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { StandardMaterial, VertexBuffer, type Mesh } from "@babylonjs/core";
import { TransformComponent } from "../../Base/Transform.component";
import { Vector3Like } from "@amodx/math";
import { BabylonContext } from "../../../../Babylon/Contexts/Babylon.context";

interface Schema {}
class Data {
  box: Mesh;
}

type Shared = {
  material: StandardMaterial | null;
  box: Mesh | null;
};

export const VoxelBoxVolumeMeshComponent = NCS.registerComponent<
  Schema,
  Data,
  {},
  Shared
>({
  type: "voxel-box-volume-mesh",
  schema: [],
  data: () => new Data(),
  shared: {
    material: null,
    box: null,
  },
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node).data;

    if (!component.shared.material) {
      component.shared.material = new StandardMaterial("", scene);
      component.shared.material.alpha = 0.7;
      component.shared.material.diffuseColor.set(0, 1, 0);
    }
    if (!component.shared.box) {
      const box = CreateBox("", {}, scene);
      const positions = box.getPositionData()!;

      const newPostions = new Float32Array(positions.length);

      for (let i = 0; i < positions.length; i++) {
        newPostions[i] = positions[i] + 0.5;
      }
      const buffer = new VertexBuffer(
        scene.getEngine(),
        newPostions,
        VertexBuffer.PositionKind
      );
      box.setVerticesBuffer(buffer);

      box.enableEdgesRendering();
      box.material = component.shared.material;
      component.shared.box = box;
    }
    const transformComponent = TransformComponent.get(component.node)!;
    const box = component.shared.box.clone();
    Vector3Like.Copy(box.position, transformComponent.schema.position);
    Vector3Like.Copy(box.scaling, transformComponent.schema.scale);
    transformComponent.schema.getSchema().traverse((node) => {
      if (node.property.id == "position") {
        node.enableProxy(
          () => box.position,
          (vec) => {
            Vector3Like.Copy(box.position, Vector3Like.FloorInPlace(vec));
          }
        );
      }
      if (node.property.id == "scale") {
        node.enableProxy(
          () => box.scaling,
          (vec) => Vector3Like.Copy(box.scaling, Vector3Like.FloorInPlace(vec))
        );
      }
    });

    box.material = component.shared.material;

    component.data.box = box;
  },
  dispose(component) {
    component.data.box.dispose();
  },
});
