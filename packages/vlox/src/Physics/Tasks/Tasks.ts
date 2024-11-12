import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render/DivineVoxelEngineRender";
import {
  RegisterColliderTasks,
  NexusTasksIds,
  RemoveColliderTasks,
} from "./NexusTask.types";
import { NodeData } from "@amodx/ncs/";

export class NexusTasks {
  static async registerBody(
    node: NodeData,
    sharedTransformBuffer: ArrayBufferLike,
    sharedPhysicsBody: ArrayBufferLike,
    sharedColliderState: ArrayBufferLike
  ) {
    await DivineVoxelEngineRender.instance.threads.nexus.runTasks<RegisterColliderTasks>(
      NexusTasksIds.RegisterCollider,
      [node, sharedTransformBuffer, sharedPhysicsBody, sharedColliderState]
    );
  }
  static async removeBody(id: string) {
    await DivineVoxelEngineRender.instance.threads.nexus.runTasks<RemoveColliderTasks>(
      NexusTasksIds.RemoveCollider,
      [id]
    );
  }
}
