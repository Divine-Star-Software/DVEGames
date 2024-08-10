import { LocationData } from "@divinevoxel/core/Math";
import { ArchivedColumnData } from "@divinevoxel/foundation/Default/Archive";

export enum ArchiverTasksIds {
  ArchiveColumn = "archive-column",
  ImportColumn = "import-column",
}

export type ImportColumnTasks =ArchivedColumnData;

export type ArchiveColumnTasks = [location: LocationData];
