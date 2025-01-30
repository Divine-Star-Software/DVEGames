import { LocationData } from "@divinevoxel/vlox/Math";
import { ArchivedSectorData } from "@divinevoxel/vlox/World/Archive";

export enum ArchiverTasksIds {
  ArchiveColumn = "archive-sector",
  ImportColumn = "import-sector",
}

export type ImportColumnTasks = ArchivedSectorData;

export type ArchiveColumnTasks = [location: LocationData];
