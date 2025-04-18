import { elm, frag, useSignal } from "@amodx/elm";
import VoxelDisplay from "./Components/VoxelDisplay";
import VoxelSelect from "./Components/Select/VoxelSelect";
import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph, Node } from "@amodx/ncs/";
import { VoxelInersectionComponent } from "@dvegames/vlox/Interaction/VoxelIntersection.component";
import { VoxelMousePickComponent } from "@dvegames/vlox/Interaction/VoxelMousePick.component";
import { VoxelUpdateProviderComponent } from "@dvegames/vlox/Providers/VoxelUpdateProvider.component";
import { MouseVoxelBuilderComponent } from "@dvegames/vlox/Building/MouseVoxelBuilder.component";
import { VoxelPaintDataComponent } from "@dvegames/vlox/Voxels/VoxelPaintData.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
import { BuilderState } from "./BuilderState";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { MouseVoxelBuilderBoxToolComponent } from "@dvegames/vlox/Building/Mouse/MouseVoxelBuilderBoxTool.component";

elm.css(/* css */ `
.builder {
  display: flex;
  flex-direction: column;
  overflow: hidden;


  hr {
    width: 100%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

}
  `);
export default function (graph: Graph) {
  const node = graph
    .addNode(
      Node("Builder", [
        VoxelInersectionComponent(),
        VoxelMousePickComponent(),
        VoxelUpdateProviderComponent(),
        VoxelPaintDataComponent(),
        DimensionProviderComponent(),
      ])
    )
    .cloneCursor();
  MouseVoxelBuilderComponent.set(node);
  const mouseBuilder = MouseVoxelBuilderComponent.get(node)!;
  mouseBuilder.data.voxelPickedObserver.subscribe(() => {
    BuilderState.voxelUpdated.notify();
  });

  BuilderState.paintData = VoxelPaintDataComponent.getRequired(node);
  ToolPanelViews.registerView("Build", (component) => {
    const updated = useSignal();

    return elm(
      "div",
      {
        className: "builder",
      },
      frag(
        SchemaEditor({
          schema: mouseBuilder!.schema,
        }),
        elm("div", {
          signal: updated((elm) => {
            elm.innerHTML = "";
            if (MouseVoxelBuilderBoxToolComponent.get(node)) {
              elm.append(
                SchemaEditor({
                  schema: MouseVoxelBuilderBoxToolComponent.get(node)!.schema,
                })
              );
            }
          }),
        })
      ),
      elm("hr"),
      VoxelDisplay(),
      VoxelSelect()
    );
  });
}
