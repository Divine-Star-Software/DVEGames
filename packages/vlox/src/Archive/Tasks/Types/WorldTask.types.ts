import { LocationData } from "@divinevoxel/vlox/Math";
import { ArchivedColumnData } from "@divinevoxel/vlox/World/Archive";

export enum ArchiverTasksIds {
  ArchiveColumn = "archive-column",
  ImportColumn = "import-column",
}

export type ImportColumnTasks =ArchivedColumnData;

export type ArchiveColumnTasks = [location: LocationData];
