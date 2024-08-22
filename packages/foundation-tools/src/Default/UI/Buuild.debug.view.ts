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
import { VoxelItemData } from "Default/VoxelItemData";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";

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

const getImage = (display: ConstructorTextureData) => {
  const path = TextureManager.getTexturePath(
    display[0],
    display[1],
    display[2] || "default"
  );
  return path;
};

function SelectVoxel(signal: Signal<VoxelItemData>) {
  return elm(
    "div",
    "voxel-image",
    elm("p", {
      signal: signal(
        (elm) => (elm.innerText = signal.value.name || signal.value.name)
      ),
    }),
    elm("img", {
      signal: signal((img) => {
        img.src = getImage(signal.value.texture);
      }),
      style: {
        width: "64px",
        height: "64px",
        imageRendering: "pixelated",
      },
    })
  );
}

function VoxelImage(data: ConstructorTextureData) {
  return elm(
    "div",
    "voxel-image",
    elm("img", {
      src: getImage(data),
      style: {
        width: "64px",
        height: "64px",
        imageRendering: "pixelated",
      },
    })
  );
}

const VoxelDisplay = (
  name: string,
  data: VoxelData,
  image: ConstructorTextureData
) => frag(elm("p", {}, name), VoxelImage(image));

function VoxelSelect() {
  const selectedVoxel = useSignal<VoxelItemData>();
  const voxelsParent = elm("div", "voxels");
  const update = useSignal();
  const searchSchema = Schema.CreateInstance<{ search: string }>(
    StringProp("search", {
      initialize: (node) =>
        node.observers.updatedOrLoadedIn.subscribe(() => update.broadcast()),
    })
  );

  const voxelSelect = (
    data: VoxelData,
    name: string,
    texture: ConstructorTextureData,
    placeData: Partial<AddVoxelData>
  ) =>
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
      VoxelDisplay(name, data, texture),

      elm(
        "button",
        {
          onclick() {
            Builder.setData(placeData);
            selectedVoxel.value = {
              data: placeData as any,
              name,
              texture,
            };
            selectedVoxel.broadcast();
          },
        },
        "Select"
      )
    );

  elm.appendChildern(
    voxelsParent,
    Builder.voxelData.map((data) => {
      const tags = new Map(data.tags);
      const placeData = tags.get("#dve_place_data") as
        | VoxelItemData[]
        | undefined;

      const display = tags.get(
        "#dve_voxel_display_texture"
      ) as ConstructorTextureData;

      if (!placeData) {
        return frag(
          voxelSelect(data, data.name || data.id, display, { id: data.id })
        );
      }

      const signal = useSignal();

      let open = false;
      return frag(
        VoxelDisplay(data.name || data.id, data, display),
        elm(
          "button",
          {
            onclick() {
              open = !open;
              signal.broadcast();
            },
          },
          "Show Varations"
        ),
        elm(
          "div",
          {
            signal: signal((elm) =>
              open
                ? (elm.style.display = "block")
                : (elm.style.display = "none")
            ),
            style: {
              display:"none",
              backgroundColor: "#1a1a1a",
            },
          },
          placeData.map((_) => voxelSelect(data, _.name, _.texture, _.data))
        )
      );
    })
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
