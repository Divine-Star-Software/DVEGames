import { Threads } from "@amodx/threads";
import {
  ArchiveColumnTasks,
  ArchiverTasksIds,
  ImportColumnTasks,
} from "../Types/WorldTask.types";
import { WorldRegister } from "@divinevoxel/foundation/Data/World/WorldRegister";
import ArchiveColumn from "@divinevoxel/foundation/Default/Archive/Functions/ArchiveColumn";
import ImportColumn from "@divinevoxel/foundation/Default/Archive/Functions/ImportColumn";
import { DivineVoxelEngineConstructor } from "@divinevoxel/core/Contexts/Constructor/DivineVoxelEngineConstructor";
export default function () {
  Threads.registerTasks<ArchiveColumnTasks>(
    ArchiverTasksIds.ArchiveColumn,
    async ([location], onDone) => {
      WorldRegister.instance.setDimension(location[0]);

      const column = WorldRegister.instance.column.get(
        location[1],
        location[2],
        location[3]
      );
      if (!column)
        throw new Error(
          `Column at location ${location.toString()} does not exist`
        );

      const archived = ArchiveColumn({
        location: location,
      });
      const transfers: any[] = [];
      if (archived.palettes.light)
        transfers.push(archived.palettes.light.buffer);
      if (archived.palettes.state)
        transfers.push(archived.palettes.state.buffer);
      if (archived.palettes.secondaryState)
        transfers.push(archived.palettes.secondaryState.buffer);
      for (const chunk of archived.chunks) {
        if (typeof chunk.buffers.id != "number")
          transfers.push(chunk.buffers.id.buffer);
        if (typeof chunk.buffers.light != "number")
          transfers.push(chunk.buffers.light.buffer);
        if (typeof chunk.buffers.state != "number")
          transfers.push(chunk.buffers.state.buffer);
        if (typeof chunk.buffers.secondary != "number")
          transfers.push(chunk.buffers.secondary.buffer);
        if (typeof chunk.buffers.mod != "number")
          transfers.push(chunk.buffers.mod.buffer);
        if (chunk.palettes.id) transfers.push(chunk.palettes.id.buffer);
        if (chunk.palettes.light) transfers.push(chunk.palettes.light.buffer);
        if (chunk.palettes.state) transfers.push(chunk.palettes.state.buffer);
        if (chunk.palettes.mod) transfers.push(chunk.palettes.mod.buffer);
        if (chunk.palettes.secondaryState)
          transfers.push(chunk.palettes.secondaryState.buffer);
        if (chunk.palettes.secondaryId)
          transfers.push(chunk.palettes.secondaryId.buffer);
      }

      if (onDone) onDone(archived, transfers);
    },
    "deferred"
  );
  Threads.registerTasks<ImportColumnTasks>(
    ArchiverTasksIds.ImportColumn,
    async (archived) => {
      const importedColumn = ImportColumn(archived, {});
      await DivineVoxelEngineConstructor.instance.core.threads.world.runAsyncTasks(
        "load-column",
        [archived.location, importedColumn]
      );
    }
  );
}
