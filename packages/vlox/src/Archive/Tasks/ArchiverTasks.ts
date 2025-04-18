import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render/DivineVoxelEngineRender";
import {
  ArchiverTasksIds,
  ArchiveColumnTasks,
  ImportColumnTasks,
} from "./Types/WorldTask.types";
import { ArchivedSectorData } from "@divinevoxel/vlox/World/Archive";
import { Vec3Array } from "@amodx/math";
import { LocationData } from "@divinevoxel/vlox/Math";

export class ArchiverTasks {
  static async archiveColumn(
    dimension: number,
    position: Vec3Array
  ): Promise<ArchivedSectorData> {
    return DivineVoxelEngineRender.instance.threads.generators.runTaskAsync<
      LocationData,
      ArchivedSectorData
    >(ArchiverTasksIds.ArchiveColumn, [dimension, ...position], []);
  }
  static async importColumn(archivedColumn: ArchivedSectorData): Promise<void> {
    return DivineVoxelEngineRender.instance.threads.generators.runTaskAsync<
      ImportColumnTasks,
      void
    >(ArchiverTasksIds.ImportColumn, archivedColumn, []);
  }
}
