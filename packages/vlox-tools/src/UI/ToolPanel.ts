import { elm } from "@amodx/elm";
import { ToolPanelViews } from "../ToolPanelViews";
import { ToolPanelComponent } from "../ToolPanel.component";

elm.css(/* css */ `
#dve-tool-panel {
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
    button {

      --bg-opacity: 0.2;
      --border-opacity: 0.2;
      background-color: rgb(255 255 255 / var(--bg-opacity));
      border-width: 1px;
      border-style: solid;
      border-color: rgb(255 255 255 / var(--border-opacity));
      border-radius: 10px;

      padding-left: 5px;
      padding-right: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      text-decoration: none;
      color: inherit;

      font-weight: 500;


      font-family: var(--main-font-family);

      font-weight: bold;
      letter-spacing: 2px;
      transition: all 0.5s;
      &:hover {
        --bg-opacity: 0.4;
        --border-opacity: 0.4;
        cursor: pointer;
        transition: all 0.5s;

      }
      
}

.input option {
  color:black;
}
    .input {
    padding: 0;
    margin: 0;
    outline: none;
    width: 50%;
    color: var(--font-color);
  
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
    font-size: 16px;
    outline: none;
  
    &::foccus {
      border-color: #009ffd;
      box-shadow: 0 0 8px rgba(0, 159, 253, 0.5);
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    &:disabled {
      opacity: .5;
      background: rgba(10, 10, 10, 0.1);
    }
  }
  .checkbox-container {
    .checkbox {
      width: 20px;
      height: 20px;
      margin: auto;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .dropdown-list {
    padding: 0;
    margin: 0;
  
    width: 50%;
  
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
    color: var(--font-color);
    font-size: 16px;
    outline: none;
    .dropdown-list-option {
      color: black;
    }
  
    &::foccus {
      border-color: #009ffd;
      box-shadow: 0 0 8px rgba(0, 159, 253, 0.5);
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    &:disabled {
      opacity: .5;
      background: rgba(10, 10, 10, 0.1);
    }
  }
  .label {
    color: white;
    display: block;
    padding: 0;
    width: 50%;
    text-align: center;
  }
  .form-group {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: row;
  }
  .object-vector-property {
    display: flex;
    vertical-align: middle;
  
    font-size: var(--font-size-medium);
    .object-vector-property-label {
      display: block;
      color: white;
      flex-grow: 0;
      flex-shrink: 0;
      width: 20%;
      text-align: center;
      margin: auto;
    }
    .vector-inputs {
      display: flex;
      flex-direction: row;
      width: 80%;
      flex-grow: 0;
      flex-shrink: 0;
      .vector-input-node {
        flex-direction: row;
        display: flex;
        width: 100%;
        margin-left: 20px;
        .vector-input-label {
          display: block;
          color: var(--font-color);
          margin: auto;
        }
      }
    }
  }

}  

.view-select-container select {
    width: 100%;
    padding: 10px;
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
  width: 100%;
  overflow: hidden;
.view {
  overflow-y: scroll;
  height: 100%;
}

}


`);

export default function ToolPanel(
  component: (typeof ToolPanelComponent)["default"]
) {
  const viewContainer = elm("div", "view-container");

  function showView(viewId: string) {
    Array.from(viewContainer.children).forEach((child) => {
      (child as HTMLElement).style.display = "none";
    });
    if (!viewId) return;
    let view = viewContainer.querySelector(`[data-view-id="${viewId}"]`);
    if (view) {
      (view as HTMLDivElement).style.display = "block";
    } else {
      view = elm(
        "div",
        {
          className: "view",
          dataset: {
            viewId,
          },
        },
        ToolPanelViews.getView(viewId)(component)
      );
      viewContainer.appendChild(view);
    }
  }

  return elm(
    "div",
    {
      id: "dve-tool-panel",
      onclick(ev) {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
      },
    },

    elm(
      "div",
      "view-select-container",
      elm(
        "select",
        {
          value: "",
          onchange(event) {
            const selectedViewId = (event.target as HTMLSelectElement).value;
            showView(selectedViewId);
          },
        },
        elm("option", { value: "" }, ""),
        ToolPanelViews.getViews().map((viewId) =>
          elm("option", { value: viewId }, viewId)
        )
      )
    ),
    viewContainer
  );
}
