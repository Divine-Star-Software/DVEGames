import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render/DivineVoxelEngineRender";
import { NexusTasksIds } from "./NexusTask.types";
import { CreateNodeData } from "@amodx/ncs/";

export class NexusTasks {
  static async registerBody(node: CreateNodeData) {
    return await DivineVoxelEngineRender.instance.threads.nexus.runTaskAsync<
      CreateNodeData,
      number
    >(NexusTasksIds.RegisterCollider, node);
  }
  static async removeBody(id: number) {
    await DivineVoxelEngineRender.instance.threads.nexus.runTaskAsync<number>(
      NexusTasksIds.RemoveCollider,
      id
    );
  }
}
