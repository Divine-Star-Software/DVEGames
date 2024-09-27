import { NCS } from "@amodx/ncs/";
import { raw } from "@amodx/elm";
import ToolPanel from "./UI/DebugPanel";

const debugRoot = document.createElement("div");
debugRoot.id = "ddebug-root";
debugRoot.style.display = "none";
document.body.append(debugRoot);

const turnOnListener = ({ key }: KeyboardEvent) => {
  if (key == "F2") {
    debugRoot.style.display =
      debugRoot.style.display == "block" ? "none" : "block";
  }
};

export const ToolPanelComponent = NCS.registerComponent({
  type: "tool-panel",
  init(component) {
    raw(debugRoot, {}, ToolPanel(component));
    window.addEventListener("keydown", turnOnListener);
  },
  dispose() {
    for (const child of debugRoot.children) {
      child.remove();
    }
    debugRoot.innerHTML = "";
    window.removeEventListener("keydown", turnOnListener);
  },
});
