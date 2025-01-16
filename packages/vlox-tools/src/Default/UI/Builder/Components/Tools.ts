import { elm, frag, useSignal } from "@amodx/elm";

import { ToolPanelViews } from "../../../../DebugPanelViews";
import { Builder } from "../../../Managers/Builder";
import { SchemaEditor } from "../../../../UI/Schemas/SchemaEditor";

import { MouseVoxelBuilderComponent } from "@dvegames/vlox/Building/Components/MouseVoxelBuilder.component";
import { MouseVoxelBuilderBoxToolComponent } from "@dvegames/vlox/Building/Components/Mouse/MouseVoxelBuilderBoxTool.component";

export default function Tools() {
    const updated = useSignal();
    const builder = MouseVoxelBuilderComponent.get(Builder.node)!;
    builder.addOnSchemaUpdate(["tool"], () => updated.broadcast());
    return frag(
      SchemaEditor({
        schemaInstance: builder!.schema,
      }),
      elm("div", {
        signal: updated((elm) => {
          elm.innerHTML = "";
          if (MouseVoxelBuilderBoxToolComponent.get(Builder.node)) {
            elm.append(
              SchemaEditor({
                schemaInstance: MouseVoxelBuilderBoxToolComponent.get(
                  Builder.node
                )!.schema,
              })
            );
          }
        }),
      })
    );
  }