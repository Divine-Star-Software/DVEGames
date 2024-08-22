import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { DimensionProviderComponent } from "@dvegames/foundation/Core/Components/Providers/DimensionProvider.component";
import { GenWorldMapComponent } from "@dvegames/foundation/Debug/GenMap/GenWorldMap.component";
export class Map {
  static node: NodeInstance;

  static init(graph: Graph) {
    this.node = graph.addNode(
      Node({}, [
        DimensionProviderComponent(),
        GenWorldMapComponent(),
      ])
    );
  }
}
