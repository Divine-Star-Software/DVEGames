import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render/DivineVoxelEngineRender";
import {
  ArchiverTasksIds,
  ArchiveColumnTasks,
  ImportColumnTasks,
} from "./Types/WorldTask.types";
import { ArchivedSectorData } from "@divinevoxel/vlox/World/Archive";
import { Vec3Array } from "@amodx/math";

export class ArchiverTasks {
  static async archiveColumn(
    dimension: string,
    position: Vec3Array
  ): Promise<ArchivedSectorData> {
    return DivineVoxelEngineRender.instance.threads.constructors.runTaskAsync<
      ArchiveColumnTasks,
      ArchivedSectorData
    >(ArchiverTasksIds.ArchiveColumn, [[dimension, ...position]], []);
  }
  static async importColumn(archivedColumn: ArchivedSectorData): Promise<void> {
    return DivineVoxelEngineRender.instance.threads.constructors.runTaskAsync<
      ImportColumnTasks,
      void
    >(ArchiverTasksIds.ImportColumn, archivedColumn, []);
  }
}
