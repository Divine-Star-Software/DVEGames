import { Graph, Node, NodeCursor } from "@amodx/ncs/";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
import { GenWorldMapComponent } from "@dvegames/vlox/Debug/GenMap/GenWorldMap.component";
export default function (graph: Graph) {
  const node = graph
    .addNode(
      Node("Map", [DimensionProviderComponent(), GenWorldMapComponent()])
    )
    .cloneCursor();
}
