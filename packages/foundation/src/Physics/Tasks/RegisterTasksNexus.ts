import {
  RegisterColliderTasks,
  NexusTasksIds,
  RemoveColliderTasks,
} from "./NexusTask.types";
import { DVEPhysics } from "../Nexus/DVEPhysics";
import { NodeId } from "@amodx/ncs/Nodes/NodeId";
import { SharedTransformComponent } from "../../Core/Components/Base/SharedTransform.component";
import { PhysicsBodyComponent } from "../Main/Components/PhysicsBody.component";
import { DivineVoxelEngineNexus } from "@divinevoxel/foundation/Contexts/Nexus/DivineVoxelEngineNexus";

export default function (nexus:DivineVoxelEngineNexus) {
  nexus.TC.registerTasks<RegisterColliderTasks>(
    NexusTasksIds.RegisterCollider,
    async ([node, sharedTransformBuffer, sharedBodyBuffer]) => {
      const newNode = await DVEPhysics.graph.addNode(node);
      const sharedTransform = SharedTransformComponent.get(newNode)!;
      sharedTransform.data.buffer = sharedTransformBuffer;
      const physicsBodyComponent = PhysicsBodyComponent.get(newNode)!;
      physicsBodyComponent.data.buffer = sharedBodyBuffer;
      console.log("GOT DATA DATA",node,)
      console.log(DVEPhysics.graph)
    }
  );
  nexus.TC.registerTasks<RemoveColliderTasks>(
    NexusTasksIds.RemoveCollider,
    async ([id]) => {
      await DVEPhysics.graph.removeNode(NodeId.Create(id));
    }
  );
}
