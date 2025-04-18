import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph, Node } from "@amodx/ncs/";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { AxesViewerComponent } from "@dvegames/vlox/Debug/AxesViewer.component";
import { VoxelPositionGuideComponent } from "@dvegames/vlox/Debug/VoxelPositionGuide.component";
import { elm, frag } from "@amodx/elm";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
export default function (graph: Graph) {
  const axesNode = graph
    .addNode(Node("Guides", [AxesViewerComponent()]))
    .cloneCursor();
  const guideNode = graph
    .addNode(
      Node({}, [
        TransformComponent({
          position: { x: 0, y: 30, z: 0 },
        }),
        VoxelPositionGuideComponent(),
      ])
    )
    .cloneCursor();
  ToolPanelViews.registerView("Guides", () => {
    return frag(
      elm("p", {}, "World Axes"),
      SchemaEditor({
        schema: AxesViewerComponent.get(axesNode)!.schema,
      }),
      elm("p", {}, "Voxel Position Guide"),
      SchemaEditor({
        schema: TransformComponent.get(guideNode)!.schema,
      }),
      SchemaEditor({
        schema: VoxelPositionGuideComponent.get(guideNode)!.schema,
      })
    );
  });
}
