import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render/DivineVoxelEngineRender";
import {
  RegisterColliderTasks,
  NexusTasksIds,
  RemoveColliderTasks,
} from "./NexusTask.types";
import { NodeData } from "@amodx/ncs/";
import { DVEFBRCore } from "@divinevoxel/babylon-renderer/Defaults/Foundation/DVEFBRCore";

export class NexusTasks {
  static async registerBody(
    node: NodeData,
    sharedTransformBuffer: SharedArrayBuffer,
    sharedPhysicsBody: SharedArrayBuffer
  ) {
    await DVEFBRCore.instance.threads.nexus.runTasks<RegisterColliderTasks>(
      NexusTasksIds.RegisterCollider,
      [node, sharedTransformBuffer, sharedPhysicsBody]
    );
  }
  static async removeBody(id: string) {
    await DVEFBRCore.instance.threads.nexus.runTasks<RemoveColliderTasks>(
      NexusTasksIds.RemoveCollider,
      [id]
    );
  }
}