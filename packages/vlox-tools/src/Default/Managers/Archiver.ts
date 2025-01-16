import { BinaryObject } from "@amodx/binary";
import { Compressor } from "@amodx/core/Compression";
import { Graph, Node, NodeCursor } from "@amodx/ncs/";
import { ArchivedAreaData } from "@divinevoxel/vlox/Archive";
import { WorldArchiverComponent } from "@dvegames/vlox/Archive/Components/WorldArchiver.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Core/Components/Providers/DimensionProvider.component";
import { CacheManager } from "@divinevoxel/vlox/Cache/CacheManager";
export class Archiver {
  static node: NodeCursor;

  static init(graph: Graph) {
    this.node = graph.addNode(
      Node({}, [DimensionProviderComponent({}), WorldArchiverComponent()])
    );
  }
  static async archiveCache() {
    console.warn("Archive cached");
    const archivedData = CacheManager.getCachedData();


    const compressed = await Compressor.core.compressArrayBuffer(
      BinaryObject.objectToBuffer(archivedData)
    );
    console.log(compressed.byteLength);
    return compressed;
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
      (await Compressor.core.decompressArrayBuffer(rawFile)).buffer as any
    ) as any;
    BinaryObject.setUseSharedMemory(false);

    await WorldArchiverComponent.get(this.node)!.logic.load(archive);
  }
}
