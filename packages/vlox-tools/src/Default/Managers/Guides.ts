import { Graph, Node, NodeCursor } from "@amodx/ncs/";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { AxesViewerComponent } from "@dvegames/vlox/Debug/AxesViewer.component";
import { VoxelPositionGuideComponent } from "@dvegames/vlox/Debug/VoxelPositionGuide.component";

export class Guides {
  static axesNode: NodeCursor;
  static guideNode: NodeCursor;
  static init(graph: Graph) {
    this.axesNode = graph
      .addNode(Node("Guides", [AxesViewerComponent()]))
      .cloneCursor();
    this.guideNode = graph
      .addNode(
        Node({}, [
          TransformComponent({
            position: { x: 0, y: 30, z: 0 },
          }),
          VoxelPositionGuideComponent(),
        ])
      )
      .cloneCursor();
  }
}
