import { elm, frag } from "@amodx/elm";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { AxesViewerComponent } from "@dvegames/vlox/Debug/AxesViewer.component";
import { VoxelPositionGuideComponent } from "@dvegames/vlox/Debug/VoxelPositionGuide.component";
import { ToolPanelViews } from "../../DebugPanelViews";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Guides } from "../Managers/Guides";

ToolPanelViews.registerView("Guides", () => {
  return frag(
    elm("p", {}, "World Axes"),
    SchemaEditor({
      schema: AxesViewerComponent.get(Guides.axesNode)!.schema,
    }),
    elm("p", {}, "Voxel Position Guide"),
    SchemaEditor({
      schema: TransformComponent.get(Guides.guideNode)!.schema,
    }),
    SchemaEditor({
      schema: VoxelPositionGuideComponent.get(Guides.guideNode)!.schema,
    })
  );
});
