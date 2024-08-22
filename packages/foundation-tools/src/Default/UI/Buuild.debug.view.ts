import { elm, frag, Signal, useSignal } from "@amodx/elm";

import { ToolPanelViews } from "../../DebugPanelViews";
import { Builder } from "../Managers/Builder";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { VoxelPaintDataComponent } from "@dvegames/foundation/Core/Components/Voxels/VoxelPaintData.component";
import { Schema, StringProp } from "@amodx/schemas";
import { FuzzySearch } from "@amodx/core/Search/FuzzySearch";
import { VoxelData } from "@divinevoxel/core";
import { TextureManager } from "@divinevoxel/foundation/Textures/TextureManager";
import { ConstructorTextureData } from "@divinevoxel/foundation/Textures/Constructor.types";
import { MouseVoxelBuilderComponent } from "@dvegames/foundation/Building/Components/MouseVoxelBuilder.component";
import { MouseVoxelBuilderBoxToolComponent } from "@dvegames/foundation/Building/Components/Mouse/MouseVoxelBuilderBoxTool.component";
import { MouseVoxelBuilderSingleToolComponent } from "@dvegames/foundation/Building/Components/Mouse/MouseVoxelBuilderSingleTool.component";

elm.css(/* css */ `

.builder {
  display: flex;
  flex-direction: column;
  .voxel-select-container {
    border: 2px solid cyan;
      .voxel-select {
        display: block;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 500px;
        min-height: 150px;
      } 
  }

  .voxel-node {
    border-bottom: 2px solid cyan;
  }

}
  `);

function SelectVoxel(data: Signal<VoxelData>) {
  return elm(
    "div",
    "voxel-image",
    elm("p", {
      signal: data((elm) => (elm.innerText = data.value.name || data.value.id)),
    }),
    elm("img", {
      signal: data((img) => {
        const tags = new Map(data.value.tags);
        const display = tags.get(
          "#ecd_voxel_display_texture"
        ) as ConstructorTextureData;
        if (!display) return null;

        const base64 = TextureManager.getTextureData([display[0], display[1]])
          ?.base64!;
        if (!base64) return null;
        img.src = Array.isArray(base64) ? base64[0] : base64;
      }),
      style: {
        width: "64px",
        height: "64px",
        imageRendering: "pixelated",
      },
    })
  );
}

function VoxelImage(data: VoxelData) {
  const tags = new Map(data.tags);
  const display = tags.get(
    "#ecd_voxel_display_texture"
  ) as ConstructorTextureData;
  if (!display) return null;
  const base64 = TextureManager.getTextureData([display[0], display[1]])
    ?.base64!;
  if (!base64) return null;
  const image = Array.isArray(base64) ? base64[0] : base64;

  return elm(
    "div",
    "voxel-image",
    elm("img", {
      src: image,
      style: {
        width: "64px",
        height: "64px",
        imageRendering: "pixelated",
      },
    })
  );
}

function VoxelSelect() {
  const selectedVoxel = useSignal<VoxelData>();
  const voxelsParent = elm("div", "voxels");
  const update = useSignal();
  const searchSchema = Schema.CreateInstance<{ search: string }>(
    StringProp("search", {
      initialize: (node) =>
        node.observers.updatedOrLoadedIn.subscribe(() => update.broadcast()),
    })
  );

  VoxelPaintDataComponent.get(Builder.node)!.addOnSchemaUpdate(
    ["id"],
    (node) => {
      const id = node.get()!;
      const data = Builder.voxelData.find((_) => _.id == id);
      if (!data) return;
      selectedVoxel.value = data;
      selectedVoxel.broadcast();
    }
  );

  elm.appendChildern(
    voxelsParent,
    Builder.voxelData.map((data) =>
      elm(
        "div",
        {
          className: "voxel-node",
          signal: update((elm) => {
            if (!searchSchema.search) return (elm.style.display = "block");
            if (!data.name) return (elm.style.display = "none");
            if (
              FuzzySearch.fuzzyCloseMatch(
                data.name.split("_"),
                searchSchema.search.split(" "),
                0.2
              )
            )
              return (elm.style.display = "block");

            elm.style.display = "none";
          }),
        },
        elm("p", {}, data.name || data.id),
        VoxelImage(data),
        elm(
          "button",
          {
            onclick() {
              Builder.setId(data.id);
            },
          },
          "Select"
        )
      )
    )
  );

  return elm(
    "div",
    {
      className: "voxel-select-container",
    },
    SelectVoxel(selectedVoxel),
    SchemaEditor({
      schemaInstance: searchSchema,
    }),
    elm("div", { className: "voxel-select" }, voxelsParent)
  );
}

function Tools() {
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

ToolPanelViews.registerView("Build", (component) => {
  return elm(
    "div",
    {
      className: "builder",
    },
    Tools(),
    SchemaEditor({
      schemaInstance: VoxelPaintDataComponent.get(Builder.node)!.schema,
    }),
    VoxelSelect()
  );
});
