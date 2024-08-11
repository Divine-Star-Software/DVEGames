import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render/DivineVoxelEngineRender";
import { Vec3Array } from "@amodx/math";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
import {
  BuildVoxelTemplateTasks,
  PlaceVoxelAreaTasks,
  RemoveVoxelAreaTasks,
  CoreTasksIds,
  PlaceVoxelTasks,
  RemoveVoxelTasks,
  RunBuildQueue,
} from "./CoreTasks.types";
import { VoxelTemplateData } from "@divinevoxel/foundation/Default/Templates/VoxelTemplates.types";

export class CoreTasks {
  static async placeVoxelArea(
    dimension: string,
    start: Vec3Array,
    end: Vec3Array,
    data: Partial<AddVoxelData>
  ) {
    console.log("PLACING AREA ",dimension,start,end,data)
    const chunks =
      await DivineVoxelEngineRender.instance.threads.construcotrs.runAsyncTasks<
        PlaceVoxelAreaTasks,
        Vec3Array[]
      >(CoreTasksIds.PlaceVoxelArea, [dimension, start, end, data]);
      console.log("GOT CHUNKS",chunks)
    await this.runRebuildQueue(dimension, chunks);
  }
  static async runRebuildQueue(dimension: string, chunks: Vec3Array[]) {
    await DivineVoxelEngineRender.instance.threads.world.runTasks<RunBuildQueue>(
      CoreTasksIds.RunBuildQueue,
      [dimension, chunks]
    );
  }
  static async removeVoxelArea(
    dimension: string,
    start: Vec3Array,
    end: Vec3Array
  ) {
    const chunks =
      await DivineVoxelEngineRender.instance.threads.construcotrs.runAsyncTasks<
        RemoveVoxelAreaTasks,
        Vec3Array[]
      >(CoreTasksIds.RemoveVoxelArea, [dimension, start, end]);
    await this.runRebuildQueue(dimension, chunks);
  }
  static async buildTemplate(
    dimension: string,
    start: Vec3Array,
    template: VoxelTemplateData
  ) {
    const chunks =
      await DivineVoxelEngineRender.instance.threads.construcotrs.runAsyncTasks<
        BuildVoxelTemplateTasks,
        Vec3Array[]
      >(CoreTasksIds.BuildTemplate, [dimension, start, template]);
    await this.runRebuildQueue(dimension, chunks);
  }

  static async placeVoxel(
    dimension: string,
    position: Vec3Array,
    data: Partial<AddVoxelData>
  ) {
    await DivineVoxelEngineRender.instance.threads.world.runTasks<PlaceVoxelTasks>(
      CoreTasksIds.PlaceVoxel,
      [dimension, position, data]
    );
  }
  static async removeVoxel(dimension: string, position: Vec3Array) {
    await DivineVoxelEngineRender.instance.threads.world.runTasks<RemoveVoxelTasks>(
      CoreTasksIds.RemoveVoxel,
      [dimension, position]
    );
  }
}
