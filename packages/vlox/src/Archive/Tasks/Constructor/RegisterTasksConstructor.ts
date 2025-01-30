import { Threads } from "@amodx/threads";
import {
  ArchiveColumnTasks,
  ArchiverTasksIds,
  ImportColumnTasks,
} from "../Types/WorldTask.types";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import { DivineVoxelEngineConstructor } from "@divinevoxel/vlox/Contexts/Constructor/DivineVoxelEngineConstructor";
export default function () {
/*  
    ArchiverTasksIds.ArchiveColumn,
    async ([location]) => {
      WorldRegister.setDimension(location[0]);

      const sector = WorldRegister.sectors.get(
        location[1],
        location[2],
        location[3]
      );
      if (!sector)
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
      for (const section of archived.sections) {
        if (typeof section.buffers.id != "number")
          transfers.push(section.buffers.id.buffer);
        if (typeof section.buffers.light != "number")
          transfers.push(section.buffers.light.buffer);
        if (typeof section.buffers.state != "number")
          transfers.push(section.buffers.state.buffer);
        if (typeof section.buffers.secondary != "number")
          transfers.push(section.buffers.secondary.buffer);
        if (typeof section.buffers.mod != "number")
          transfers.push(section.buffers.mod.buffer);
        if (section.palettes.id) transfers.push(section.palettes.id.buffer);
        if (section.palettes.light) transfers.push(section.palettes.light.buffer);
        if (section.palettes.state) transfers.push(section.palettes.state.buffer);
        if (section.palettes.mod) transfers.push(section.palettes.mod.buffer);
        if (section.palettes.secondaryState)
          transfers.push(section.palettes.secondaryState.buffer);
        if (section.palettes.secondaryId)
          transfers.push(section.palettes.secondaryId.buffer);
      }

      return [archived, transfers];
    }
  );
  Threads.registerTask<ImportColumnTasks>(
    ArchiverTasksIds.ImportColumn,
    async (archived) => {
      const importedColumn = ImportColumn(archived, {});

      await DivineVoxelEngineConstructor.instance.threads.world.runTaskAsync(
        "load-sector",
        [archived.location, importedColumn]
      );
    }
  ); */
}
