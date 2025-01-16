import { NCS, NodeCursor } from "@amodx/ncs";
import { NexusTasks } from "../Tasks/Tasks";
import { TransformComponent } from "../../Core/Components/Base/Transform.component";
import { PhysicsBodyComponent } from "./PhysicsBody.component";
import { BoxColliderComponent } from "./BoxCollider.component";
import { DimensionProviderComponent } from "../../Core/Components/Providers/DimensionProvider.component";
import { PhysicsColliderStateComponent } from "./PhysicsColliderState.component";
interface Schema {
  nodeId: string;
}
interface Data {
  readonly node: NodeCursor | null;
}
export const NexusPhysicsLinkComponent = NCS.registerComponent<Schema, Data>({
  type: "nexus-physics-link",
  
/*   init(component) {
    console.error("WHAT IS UP");

    const sharedTransform = BufferSchemaTrait.set(
      TransformComponent.get(component.node)!,
      { shared: true }
    )!.data.buffer;
    const sharedBody = BufferSchemaTrait.set(
      PhysicsBodyComponent.get(component.node)!,
      { shared: true }
    )!.data.buffer;
    const sharedBodyState = BufferSchemaTrait.set(
      PhysicsColliderStateComponent.get(component.node)!,
      { shared: true }
    )!.data.buffer;

    const nodeData = component.node.toJSON();
    const include: string[] = [
      DimensionProviderComponent.type,
      TransformComponent.type,
      PhysicsBodyComponent.type,
      PhysicsColliderStateComponent.type,
      BoxColliderComponent.type,
    ];
    nodeData.components! = nodeData.components!.filter((_) =>
      include.includes(_.type)
    );
    console.log(nodeData);
    nodeData.children = [];

    NexusTasks.registerBody(
      nodeData,
      sharedTransform,
      sharedBody,
      sharedBodyState
    );
  },
  dispose(component) {
    NexusTasks.removeBody(component.node.id.idString);
  }, */
});
