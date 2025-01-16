import { Vec3Array } from "@amodx/math";
import { PaintVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";
import { VoxelTemplateData } from "@divinevoxel/vlox/Templates/VoxelTemplates.types";

export enum CoreTasksIds {
  RunBuildQueue = "run-build-queue-for-tasks",
  PlaceVoxel = "place-voxel",
  RemoveVoxel = "remove-voxel",
  PlaceVoxelArea = "place-voxel-area",
  RemoveVoxelArea = "remove-voxel-area",
  BuildTemplate = "build-template",
}

export type PlaceVoxelAreaTasks = [
  dimension: string,
  start: Vec3Array,
  end: Vec3Array,
  voxelData: Partial<PaintVoxelData>
];

export type RemoveVoxelAreaTasks = [
  dimension: string,
  start: Vec3Array,
  end: Vec3Array
];
export type RunBuildQueue = [dimension: string, chunks: Vec3Array[]];
export type PlaceVoxelTasks = [
  dimension: string,
  position: Vec3Array,
  voxelData: Partial<PaintVoxelData>
];

export type RemoveVoxelTasks = [dimension: string, start: Vec3Array];
export type BuildVoxelTemplateTasks = [
  dimension: string,
  start: Vec3Array,
  template: VoxelTemplateData
];
