import { NCS } from "@amodx/ncs/";
import { Mesh } from "@babylonjs/core";
import { TransformNodeComponent } from "./TransformNode.component";

type Schema = {};

interface Data {
  mesh: Mesh | null;
}
interface Logic {}

export const MeshComponent = NCS.registerComponent<Schema, Data, Logic>({
  type: "mesh",
  schema: [],
  data(component) {
    let componentMesh: Mesh | null = null;
    return {
      get mesh() {
        return componentMesh;
      },
      set mesh(mesh: Mesh | null) {
        componentMesh = mesh;
        const node = TransformNodeComponent.get(component.node);
        console.log("UPDATE COMPONENT MESH", mesh, node);
        if (node && mesh) {
          node.logic.parent(mesh);
        }
      },
    };
  },
  dispose(component) {
    if (component.data.mesh) component.data.mesh.dispose();
  },
});
