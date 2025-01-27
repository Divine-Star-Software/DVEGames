import { NexusTasksIds, RemoveColliderTasks } from "./NexusTask.types";
import { DVEPhysics } from "../Nexus/DVEPhysics";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";
import { CreateNodeData } from "@amodx/ncs/";

export default function (nexus: DivineVoxelEngineNexus) {
  nexus.TC.registerTask<CreateNodeData>(
    NexusTasksIds.RegisterCollider,
    (node) => {
      const newNode = DVEPhysics.graph.addNode(node);
      return [newNode.index];
    }
  );
  nexus.TC.registerTask<RemoveColliderTasks>(
    NexusTasksIds.RemoveCollider,
    ([id]) => {
      DVEPhysics.graph.removeNode(id);
    }
  );
}
