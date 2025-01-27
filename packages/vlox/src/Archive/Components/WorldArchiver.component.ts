import { NCS } from "@amodx/ncs/";
import { WorldRegister } from "@divinevoxel/vlox/World/WorldRegister";
import {
  ArchivedAreaData,
  ArchivedColumnData,
} from "@divinevoxel/vlox/World/Archive";
import ArchiveArea, {
  CreateColumnsFromArea,
} from "@divinevoxel/vlox/World/Archive/Functions/ArchiveArea";
import { ArchiverTasks } from "../Tasks/ArchiverTasks";
import { DimensionProviderComponent } from "../../Core/Components/Providers/DimensionProvider.component";

class Data {
  constructor(public component: (typeof WorldArchiverComponent)["default"]) {}
  async archive() {
    const proms: Promise<ArchivedColumnData>[] = [];
    const dimension = DimensionProviderComponent.get(this.component.node)!
      .schema.dimension;

    for (const [, column] of WorldRegister.dimensions.get(dimension)!
      .columns) {
      proms.push(ArchiverTasks.archiveColumn(dimension, column.position));
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

export const WorldArchiverComponent = NCS.registerComponent({
  type: "world-archiver-component",
  data: NCS.data<Data>(),
  init: (component) => (component.data = new Data(component.cloneCursor())),
  dispose: (component) => component.data.component.returnCursor(),
});
