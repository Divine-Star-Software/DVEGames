import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render/DivineVoxelEngineRender";
import {
  ArchiverTasksIds,
  ArchiveColumnTasks,
  ImportColumnTasks,
} from "./Types/WorldTask.types";
import { ArchivedColumnData } from "@divinevoxel/vlox/Archive";
import { Vec3Array } from "@amodx/math";

export class ArchiverTasks {
  static async archiveColumn(
    dimension: string,
    position: Vec3Array
  ): Promise<ArchivedColumnData> {
    return DivineVoxelEngineRender.instance.threads.construcotrs.runAsyncTasks<
      ArchiveColumnTasks,
      ArchivedColumnData
    >(ArchiverTasksIds.ArchiveColumn, [[dimension, ...position]], []);
  }
  static async importColumn(archivedColumn: ArchivedColumnData): Promise<void> {
    return DivineVoxelEngineRender.instance.threads.construcotrs.runAsyncTasks<
      ImportColumnTasks,
      void
    >(ArchiverTasksIds.ImportColumn, archivedColumn, []);
  }
}
