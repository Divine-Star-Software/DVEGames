import { frag } from "@amodx/elm";
import { ToolPanelViews } from "../../ToolPanelViews";
import { BooleanProp, Schema } from "@amodx/schemas";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Graph, Node, } from "@amodx/ncs/";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { CrossHairsComponent } from "@dvegames/vlox/Babylon/Interaction/CrossHairs.component";

export default function (graph: Graph) {
  const context = BabylonContext.getRequired(graph.root);
  const canvas = context.data.engine.getRenderingCanvas()!;

  const node = graph.addNode(Node("Controls")).cloneCursor();
  let listener: () => void;
  const setPointerLock = (locked: boolean) => {
    if (locked) {
      listener = () => {
        canvas.requestPointerLock();
      };
      canvas.addEventListener("click", listener);
    } else {
      document.exitPointerLock();
      canvas.removeEventListener("click", listener);
    }
  };
  const setCrossHairs = (enabled: boolean) => {
    if (enabled) {
      CrossHairsComponent.set(node);
    } else {
      CrossHairsComponent.remove(node);
    }
  };
  ToolPanelViews.registerView("Controls", (component) => {
    const schemaInstance = Schema.CreateInstance<{
      enablePointerLock: boolean;
    }>(
      BooleanProp("enablePointerLock", {
        name: "Enable Pointer Lock",
        value: false,
        initialize: (node) =>
          node.observers.set.subscribe(() => setPointerLock(node.get())),
      }),
      BooleanProp("enableCrossHairs", {
        name: "Enable Cross Hairs",
        value: false,
        initialize: (node) =>
          node.observers.set.subscribe(() => setCrossHairs(node.get())),
      })
    );

    return frag(
      SchemaEditor({
        schemaInstance,
      })
    );
  });
}
