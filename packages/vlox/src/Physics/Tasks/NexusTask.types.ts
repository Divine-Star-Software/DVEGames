export enum NexusTasksIds {
  RegisterCollider = "register-collider",
  RemoveCollider = "remove-collider",
}

export type RegisterColliderTasks = [
  data: any,
  sharedTransform: ArrayBufferLike,
  sharedPhysicsBody: ArrayBufferLike,
  sharedColliderState: ArrayBufferLike
];

export type RemoveColliderTasks = [id: number];
