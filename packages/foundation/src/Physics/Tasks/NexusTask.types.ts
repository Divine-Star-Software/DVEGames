import { NodeData } from "@amodx/ncs/";

export enum NexusTasksIds {
  RegisterCollider = "register-collider",
  RemoveCollider = "remove-collider",
}

export type RegisterColliderTasks = [
  data: NodeData,
  sharedTransform: SharedArrayBuffer,
  sharedPhysicsBody: SharedArrayBuffer
];

export type RemoveColliderTasks = [id: string];