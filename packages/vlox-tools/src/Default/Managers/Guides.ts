import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { AxesViewerComponent } from "@dvegames/vlox/Debug/AxesViewer.component";
import { VoxelPositionGuideComponent } from "@dvegames/vlox/Debug/VoxelPositionGuide.component";

export class Guides {
  static axesNode: NodeInstance;
  static guideNode: NodeInstance;
  static init(graph: Graph) {
    this.axesNode = graph.addNode(Node({}, [AxesViewerComponent()]));
    this.guideNode = graph.addNode(
      Node({}, [
        TransformComponent({
          position: { x: 0, y: 30, z: 0 },
        }),
        VoxelPositionGuideComponent(),
      ])
    );
  }
}
