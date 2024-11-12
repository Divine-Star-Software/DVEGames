import { ElementChildren } from "@amodx/elm";
import { ToolPanelComponent } from "./ToolPanel.component";

type ViewRenderFunction = (component:typeof ToolPanelComponent["default"]) => ElementChildren;

export class ToolPanelViews {
  static views = new Map<string, ViewRenderFunction>();

  static registerView(id: string, view: ViewRenderFunction) {
    this.views.set(id, view);
  }

  static getView(id: string) {
    const view = this.views.get(id);
    if (!view) throw new Error(`View with ${id} does not exist`);
    return view;
  }

  static getViews() {
    return [...this.views.keys()];
  }
}
