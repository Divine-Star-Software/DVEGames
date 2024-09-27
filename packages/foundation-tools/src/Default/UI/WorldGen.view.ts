import { elm, frag } from "@amodx/elm";
import { DivineVoxelEngineRender } from "@divinevoxel/core/Contexts/Render";
import { ToolPanelViews } from "../../DebugPanelViews";

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
            DivineVoxelEngineRender.instance.core.threads.world.runTasks(
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
            DivineVoxelEngineRender.instance.core.threads.world.runTasks(
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
