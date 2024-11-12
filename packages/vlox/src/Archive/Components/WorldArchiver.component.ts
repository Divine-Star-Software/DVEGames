import { NCS } from "@amodx/ncs/";
import { WorldRegister } from "@divinevoxel/vlox/Data/World/WorldRegister";
import {
  ArchivedAreaData,
  ArchivedColumnData,
} from "@divinevoxel/vlox/Archive";
import ArchiveArea, {
  CreateColumnsFromArea,
} from "@divinevoxel/vlox/Archive/Functions/ArchiveArea";
import { ArchiverTasks } from "../Tasks/ArchiverTasks";
import { DimensionProviderComponent } from "../../Core/Components/Providers/DimensionProvider.component";

class Logic {
  constructor(public component: (typeof WorldArchiverComponent)["default"]) {}
  async archive() {
    const proms: Promise<ArchivedColumnData>[] = [];
    const dimension = DimensionProviderComponent.get(this.component.node)!
      .schema.dimension;

    for (const [, regions] of WorldRegister.instance.dimensions.get(dimension)!
      .regions) {
      for (const [index, column] of regions.columns) {
        const positon = regions.getColumnPosition(index);

        proms.push(ArchiverTasks.archiveColumn(dimension, positon));
      }
    }

    const columns = await Promise.all(proms);
    const archivedArea = ArchiveArea({
      columns,
      dimension,
    });

    return archivedArea;
  }
  async load(data: ArchivedAreaData) {
    const proms: Promise<any>[] = [];
    for (const column of CreateColumnsFromArea(data)) {
      proms.push(ArchiverTasks.importColumn(column));
    }
    await Promise.all(proms);
  }
}

export const WorldArchiverComponent = NCS.registerComponent<{}, {}, Logic>({
  type: "world-archiver-component",
  logic: (component): Logic => new Logic(component),
});
