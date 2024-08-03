import { NCS, NodeInstance } from "@amodx/ncs";
import { NexusTasks } from "../../Tasks/Tasks";
import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
import { PhysicsBodyComponent } from "./PhysicsBody.component";
import { BoxColliderComponent } from "./BoxCollider.component";
import { SharedTransformComponent } from "../../../Core/Components/Base/SharedTransform.component";
interface Schema {
  nodeId: string;
}
interface Data {
  readonly node: NodeInstance | null;
}
export const NexusPhysicsLinkComponent = NCS.registerComponent<Schema, Data>({
  type: "nexus-physics-link",
  schema: [],
  init(component) {
    console.log("INIT THE NEXUS LINK", component);
    const nodeData = component.node.toJSON();
    const include: string[] = [
      TransformComponent.type,
      SharedTransformComponent.type,
      PhysicsBodyComponent.type,
      BoxColliderComponent.type,
    ];
    nodeData.components! = nodeData.components!.filter((_) =>
      include.includes(_.type)
    );
    console.log(nodeData);

    const sharedTransform = SharedTransformComponent.get(component.node)!.data
      .buffer;
    const sharedBody = PhysicsBodyComponent.get(component.node)!.data.buffer;

    NexusTasks.registerBody(nodeData, sharedTransform, sharedBody);
  },
  dispose(component) {
    NexusTasks.removeBody(component.node.id.idString);
  },
});
