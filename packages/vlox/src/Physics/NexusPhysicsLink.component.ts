import { NCS } from "@amodx/ncs";
import { NexusTasks } from "./Tasks/Tasks";
import { TransformComponent } from "../Transform.component";
import { PhysicsBodyComponent } from "./PhysicsBody.component";
import { BoxColliderComponent } from "./BoxCollider.component";
import { DimensionProviderComponent } from "../Providers/DimensionProvider.component";
import { PhysicsColliderStateComponent } from "./PhysicsColliderState.component";
import { TransformNodeComponent } from "../Babylon/TransformNode.component";
import { Vector3Like } from "@amodx/math";
export const NexusPhysicsLinkComponent = NCS.registerComponent<{
  node: number;
  transform: (typeof TransformComponent)["default"];
  transformNode: (typeof TransformNodeComponent)["default"];
}>({
  type: "nexus-physics-link",

  init(component) {
    const cursor = component.cloneCursor();
    const transform = TransformComponent.getRequired(component.node);
    const transformNode = TransformNodeComponent.getRequired(component.node);
    const remoteNode = NCS.createRemoteNode(component.node, false, [
      DimensionProviderComponent,
      TransformComponent,
      PhysicsBodyComponent,
      PhysicsColliderStateComponent,
      BoxColliderComponent,
    ]);
    NexusTasks.registerBody(remoteNode).then((value) => {
      cursor.data = { node: value, transform, transformNode };
      cursor.returnCursor();
    });
  },
  update(component) {
    if (!component.data) return;
    Vector3Like.Copy(
      component.data.transformNode.data.transformNode.position,
      component.data.transform.schema.position
    );
  },
  dispose(component) {
    component.data.transform.returnCursor();
    component.data.transformNode.returnCursor();

    NexusTasks.removeBody(component.data.node);
  },
});
