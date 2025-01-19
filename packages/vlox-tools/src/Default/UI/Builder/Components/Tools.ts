import { elm, frag, useSignal } from "@amodx/elm";

import { ToolPanelViews } from "../../../../DebugPanelViews";
import { Builder } from "../../../Managers/Builder";
import { SchemaEditor } from "../../../../UI/Schemas/SchemaEditor";

import { MouseVoxelBuilderComponent } from "@dvegames/vlox/Building/Components/MouseVoxelBuilder.component";
import { MouseVoxelBuilderBoxToolComponent } from "@dvegames/vlox/Building/Components/Mouse/MouseVoxelBuilderBoxTool.component";

export default function Tools() {
  const updated = useSignal();
  const builder = MouseVoxelBuilderComponent.getRequired(Builder.node);
  //  builder.addOnSchemaUpdate(["tool"], () => updated.broadcast());
  return frag(
    SchemaEditor({
      schema: builder!.schema,
    }),
    elm("div", {
      signal: updated((elm) => {
        elm.innerHTML = "";
        if (MouseVoxelBuilderBoxToolComponent.get(Builder.node)) {
          elm.append(
            SchemaEditor({
              schema: MouseVoxelBuilderBoxToolComponent.get(Builder.node)!
                .schema,
            })
          );
        }
      }),
    })
  );
}
