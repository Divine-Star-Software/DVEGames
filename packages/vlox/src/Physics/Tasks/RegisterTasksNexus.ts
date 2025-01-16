import {
  RegisterColliderTasks,
  NexusTasksIds,
  RemoveColliderTasks,
} from "./NexusTask.types";
import { DVEPhysics } from "../Nexus/DVEPhysics";

import { PhysicsBodyComponent } from "../Components/PhysicsBody.component";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";
import { TransformComponent } from "../../Core/Components/Base/Transform.component";
import { NodeId } from "@amodx/ncs/Nodes/NodeId";
import { PhysicsColliderStateComponent } from "../Components/PhysicsColliderState.component";

export default function (nexus: DivineVoxelEngineNexus) {
  nexus.TC.registerTasks<RegisterColliderTasks>(
    NexusTasksIds.RegisterCollider,
    async ([
      node,
      sharedTransformBuffer,
      sharedBodyBuffer,
      sharedColliderState,
    ]) => {
      const newNode = await DVEPhysics.graph.addNode(node);
      console.log(node);
      console.log("TRANSFOORM", TransformComponent.get(newNode));
/*       BufferSchemaTrait.get(TransformComponent.get(newNode)!)!.data.buffer =
        sharedTransformBuffer;
      BufferSchemaTrait.get(PhysicsBodyComponent.get(newNode)!)!.data.buffer =
        sharedBodyBuffer;
      BufferSchemaTrait.get(
        PhysicsColliderStateComponent.get(newNode)!
      )!.data.buffer = sharedColliderState; */

      console.log("GOT DATA DATA", node);
      console.log(DVEPhysics.graph);
    }
  );
  nexus.TC.registerTasks<RemoveColliderTasks>(
    NexusTasksIds.RemoveCollider,
    async ([id]) => {
      await DVEPhysics.graph.removeNode(id);
    }
  );
}
