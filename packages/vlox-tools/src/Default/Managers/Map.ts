import { Graph, Node, NodeCursor } from "@amodx/ncs/";
import { DimensionProviderComponent } from "@dvegames/vlox/Core/Components/Providers/DimensionProvider.component";
import { GenWorldMapComponent } from "@dvegames/vlox/Debug/GenMap/GenWorldMap.component";
export class Map {
  static node: NodeCursor;

  static init(graph: Graph) {
    this.node = graph.addNode(
      Node("Map", [DimensionProviderComponent(), GenWorldMapComponent()])
    ).cloneCursor();
  }
}
