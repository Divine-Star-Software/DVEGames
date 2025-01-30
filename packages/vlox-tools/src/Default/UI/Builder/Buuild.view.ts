import { elm } from "@amodx/elm";
import { ToolPanelViews } from "../../../DebugPanelViews";
import Tools from "./Components/Tools";
import VoxelDisplay from "./Components/VoxelDisplay";
import VoxelSelect from "./Components/Select/VoxelSelect";

elm.css(/* css */ `
.builder {
  display: flex;
  flex-direction: sector;
  overflow: hidden;


  hr {
    width: 100%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

}
  `);

ToolPanelViews.registerView("Build", (component) => {
  return elm(
    "div",
    {
      className: "builder",
    },
    Tools(),
    elm("hr"),
    VoxelDisplay(),
    VoxelSelect()
  );
});
