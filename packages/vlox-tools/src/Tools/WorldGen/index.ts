import { elm, frag } from "@amodx/elm";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph } from "@amodx/ncs";
export default function (graph: Graph) {
  ToolPanelViews.registerView("World Gen", (component) => {
    return frag(
      elm(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
          },
        },
        elm(
          "button",
          {
            async onclick() {
              DivineVoxelEngineRender.instance.threads.world.runTask(
                "start-world",
                ["main", 0, 0, 0]
              );
            },
          },
          "Start World Generation"
        )
      ),
      elm(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
          },
        },
        elm(
          "button",
          {
            async onclick() {
              DivineVoxelEngineRender.instance.threads.world.runTask(
                "start-world-gen",
                ["main", 0, 0, 0]
              );
            },
          },
          "Start World Building"
        )
      )
    );
  });
}
