import { BinaryObject } from "@amodx/binary";
import { Compressor } from "@amodx/core/Compression";
import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { ArchivedAreaData } from "@divinevoxel/vlox/Archive";
import { WorldArchiverComponent } from "@dvegames/vlox/Archive/Components/WorldArchiver.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Core/Components/Providers/DimensionProvider.component";
export class Archiver {
  static node: NodeInstance;

  static init(graph: Graph) {
    this.node = graph.addNode(
      Node({}, [
        DimensionProviderComponent({

        }),
        WorldArchiverComponent(),
      ])
    );
  }

  static async archiveWorld() {
    console.warn("Archive world");
    const archivedData = await WorldArchiverComponent.get(
      this.node
    )!.logic.archive();
    console.log(archivedData);

    const compressed = await Compressor.core.compressArrayBuffer(
      BinaryObject.objectToBuffer(archivedData)
    );
    console.log(compressed.byteLength);
    return compressed;
  }

  static async importWorld(rawFile: ArrayBuffer) {
    BinaryObject.setUseSharedMemory(true);
    const archive = BinaryObject.bufferToObject(
      (await Compressor.core.decompressArrayBuffer(rawFile)).buffer
    ) as any;
    BinaryObject.setUseSharedMemory(false);

    await WorldArchiverComponent.get(this.node)!.logic.load(archive);
  }
}
