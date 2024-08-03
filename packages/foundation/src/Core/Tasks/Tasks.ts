import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render/DivineVoxelEngineRender";
import { Vec3Array } from "@amodx/math";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
import {
  BuildVoxelTemplateTasks,
  PlaceVoxelWorldTasks,
  RemoveVoxelWorldTasks,
  WorldTasks,
} from "./Types/WorldTask.types";
import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
import { VoxelTemplateData } from "@divinevoxel/foundation/Default/Templates/VoxelTemplates.types";

export class Tasks {
  static async placeVoxel(
    dimension: string,
    start: Vec3Array,
    end: Vec3Array,
    data: Partial<AddVoxelData>
  ) {
    await DivineVoxelEngineRender.instance.threads.world.runTasks<PlaceVoxelWorldTasks>(
      WorldTasks.PlaceVoxel,
      [dimension, start, end, data]
    );
  }
  static async removeVoxel(
    dimension: string,
    start: Vec3Array,
    end: Vec3Array
  ) {
    await DivineVoxelEngineRender.instance.threads.world.runTasks<RemoveVoxelWorldTasks>(
      WorldTasks.RemoveVoxel,
      [dimension, start, end]
    );
  }
  static async buildTemplate(
    dimension: string,
    start: Vec3Array,
    template: VoxelTemplateData
  ) {
    await DivineVoxelEngineRender.instance.threads.world.runTasks<BuildVoxelTemplateTasks>(
      WorldTasks.BuildTemplate,
      [dimension, start, template]
    );
  }
}
