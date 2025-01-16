import { frag } from "@amodx/elm";
import { ToolPanelViews } from "../../DebugPanelViews";
import { BooleanProp, Schema } from "@amodx/schemas";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Controls } from "../Managers/Controls";

ToolPanelViews.registerView("Controls", (component) => {
  const schemaInstance = Schema.CreateInstance<{ enablePointerLock: boolean }>(
    BooleanProp("enablePointerLock", {
      name: "Enable Pointer Lock",
      value: false,
      initialize: (node) =>
        node.observers.set.subscribe(() => Controls.setPointerLock(node.get())),
    }),
    BooleanProp("enableCrossHairs", {
      name: "Enable Cross Hairs",
      value: false,
      initialize: (node) =>
        node.observers.set.subscribe(() => Controls.setCrossHairs(node.get())),
    })
  );

  return frag(
    SchemaEditor({
      schemaInstance,
    })
  );
});
