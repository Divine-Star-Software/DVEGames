import { elm } from "@amodx/elm";
import { ToolPanelViews } from "../DebugPanelViews";
import { ToolPanelComponent } from "../ToolPanel.component";
elm.css(/* css */ `
.debug-panel {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
    background: rgba(0,0,0,.6);

    width: 30%;
    height: 100%;

    color: white;

    display: flex;
    flex-direction: column;

}  

.view-select-container select {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    font-size: 16px;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 5px;
}

.view-select-container option {
    background-color: #333;
    color: #fff;
}

.view-container {
  display: block;
  height: 100%;
  overflow-y: scroll;
}
`);

export default function ToolPanel(component:typeof ToolPanelComponent["default"]) {
  const viewContainer = elm("div", "view-container");
  return elm(
    "div",
    {
      className: "debug-panel",
      onclick(ev) {
        ev.stopPropagation();
        ev.stopImmediatePropagation;
      },
    },

    elm(
      "div",
      "view-select-container",
      elm(
        "select",
        {
          onchange(event) {
            viewContainer.innerHTML = "";
            elm.appendChildern(viewContainer, [
              ToolPanelViews.getView(
                (event.target as HTMLSelectElement).value
              )(component),
            ]);
          },
        },
        ToolPanelViews.getViews().map((_) => elm("option", { value: _ }, _))
      )
    ),
    viewContainer
  );
}
