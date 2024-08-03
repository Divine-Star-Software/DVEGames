import { Vec3Array } from "@amodx/math";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
import { VoxelTemplateData } from "@divinevoxel/foundation/Default/Templates/VoxelTemplates.types";

export enum WorldTasks {
  PlaceVoxel = "place-voxel",
  RemoveVoxel = "remove-voxel",
  BuildTemplate = "build-template",
}

export type PlaceVoxelWorldTasks = [
  dimension: string,
  start: Vec3Array,
  end: Vec3Array,
  voxelData: Partial<AddVoxelData>
];

export type RemoveVoxelWorldTasks = [
  dimension: string,
  start: Vec3Array,
  end: Vec3Array
];

export type BuildVoxelTemplateTasks = [
  dimension: string,
  start: Vec3Array,
  template: VoxelTemplateData
];
