import { elm, frag } from "@amodx/elm";
import { TransformComponent } from "@dvegames/foundation/Core/Components/Base/Transform.component";
import { AxesViewerComponent } from "@dvegames/foundation/Debug/AxesViewer.component";
import { VoxelPositionGuideComponent } from "@dvegames/foundation/Debug/VoxelPositionGuide.component";
import { ToolPanelViews } from "../../DebugPanelViews";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Guides } from "../Managers/Guides";

ToolPanelViews.registerView("Guides", () => {
  return frag(
    elm("p", {}, "World Axes"),
    SchemaEditor({
      schemaInstance: AxesViewerComponent.get(Guides.axesNode)!.schema,
    }),
    elm("p", {}, "Voxel Position Guide"),
    SchemaEditor({
      schemaInstance: TransformComponent.get(Guides.guideNode)!.schema,
    }),
    SchemaEditor({
      schemaInstance: VoxelPositionGuideComponent.get(Guides.guideNode)!.schema,
    })
  );
});
