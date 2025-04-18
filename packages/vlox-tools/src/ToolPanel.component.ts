import { NCS } from "@amodx/ncs/";
import { raw } from "@amodx/elm";
import ToolPanel from "./UI/ToolPanel";

export const ToolPanelComponent = NCS.registerComponent<() => void>({
  type: "tool-panel",
  init(component) {
    const debugRoot = document.createElement("div");
    debugRoot.id = "debug-root";
    debugRoot.style.display = "none";
    document.body.append(debugRoot);
    const turnOnListener = ({ key }: KeyboardEvent) => {
      if (key == "F2") {
        debugRoot.style.display =
          debugRoot.style.display == "block" ? "none" : "block";
      }
    };
    raw(debugRoot, {}, ToolPanel(component));
    window.addEventListener("keydown", turnOnListener);
    component.data = () => {
      for (const child of debugRoot.children) {
        child.remove();
      }
      debugRoot.innerHTML = "";
      window.removeEventListener("keydown", turnOnListener);
    };
  },
  dispose: (component) => component.data(),
});
