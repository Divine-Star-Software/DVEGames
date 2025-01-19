import { NexusTasksIds, RemoveColliderTasks } from "./NexusTask.types";
import { DVEPhysics } from "../Nexus/DVEPhysics";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";
import { CreateNodeData } from "@amodx/ncs/";

export default function (nexus: DivineVoxelEngineNexus) {
  nexus.TC.registerTasks<CreateNodeData>(
    NexusTasksIds.RegisterCollider,
    (node, onDone) => {
      const newNode = DVEPhysics.graph.addNode(node);
      if (onDone) onDone(newNode.index);
      return newNode.index;
    }
  );
  nexus.TC.registerTasks<RemoveColliderTasks>(
    NexusTasksIds.RemoveCollider,
    ([id]) => {
      DVEPhysics.graph.removeNode(id);
    }
  );
}
