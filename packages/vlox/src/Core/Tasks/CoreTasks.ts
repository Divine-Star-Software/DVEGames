import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render/DivineVoxelEngineRender";
import { Vec3Array } from "@amodx/math";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";
import {
  BuildVoxelTemplateTasks,
  PlaceVoxelAreaTasks,
  RemoveVoxelAreaTasks,
  CoreTasksIds,
  PlaceVoxelTasks,
  RemoveVoxelTasks,
  RunBuildQueue,
} from "./CoreTasks.types";
import { VoxelTemplateData } from "@divinevoxel/vlox/Templates/VoxelTemplates.types";

export class CoreTasks {
  static async placeVoxelArea(
    dimension: string,
    start: Vec3Array,
    end: Vec3Array,
    data: Partial<PaintVoxelData>
  ) {
    const sections =
      await DivineVoxelEngineRender.instance.threads.construcotrs.runTaskAsync<
        PlaceVoxelAreaTasks,
        Vec3Array[]
      >(CoreTasksIds.PlaceVoxelArea, [dimension, start, end, data]);
    await this.runRebuildQueue(dimension, sections);
  }
  static async runRebuildQueue(dimension: string, sections: Vec3Array[]) {
    await DivineVoxelEngineRender.instance.threads.world.runTask<RunBuildQueue>(
      CoreTasksIds.RunBuildQueue,
      [dimension, sections]
    );
  }
  static async removeVoxelArea(
    dimension: string,
    start: Vec3Array,
    end: Vec3Array
  ) {
    const sections =
      await DivineVoxelEngineRender.instance.threads.construcotrs.runTaskAsync<
        RemoveVoxelAreaTasks,
        Vec3Array[]
      >(CoreTasksIds.RemoveVoxelArea, [dimension, start, end]);
    await this.runRebuildQueue(dimension, sections);
  }
  static async buildTemplate(
    dimension: string,
    start: Vec3Array,
    template: VoxelTemplateData
  ) {
    const sections =
      await DivineVoxelEngineRender.instance.threads.construcotrs.runTaskAsync<
        BuildVoxelTemplateTasks,
        Vec3Array[]
      >(CoreTasksIds.BuildTemplate, [dimension, start, template]);
    await this.runRebuildQueue(dimension, sections);
  }

  static async placeVoxel(
    dimension: string,
    position: Vec3Array,
    data: Partial<PaintVoxelData>
  ) {
    await DivineVoxelEngineRender.instance.threads.world.runTask<PlaceVoxelTasks>(
      CoreTasksIds.PlaceVoxel,
      [dimension, position, data]
    );
  }
  static async removeVoxel(dimension: string, position: Vec3Array) {
    await DivineVoxelEngineRender.instance.threads.world.runTask<RemoveVoxelTasks>(
      CoreTasksIds.RemoveVoxel,
      [dimension, position]
    );
  }
}
