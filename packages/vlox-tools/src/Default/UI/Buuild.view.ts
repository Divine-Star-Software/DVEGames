import { elm, frag, Signal, useRef, useSignal } from "@amodx/elm";

import { ToolPanelViews } from "../../DebugPanelViews";
import { Builder } from "../Managers/Builder";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { VoxelPaintDataComponent } from "@dvegames/vlox/Core/Components/Voxels/VoxelPaintData.component";
import { IntProp, Schema, SelectProp, StringProp } from "@amodx/schemas";
import { FuzzySearch } from "@amodx/core/Search/FuzzySearch";
import { VoxelData } from "@divinevoxel/vlox/Types";
import { TextureManager } from "@divinevoxel/vlox/Textures/TextureManager";
import { ConstructorTextureData } from "@divinevoxel/vlox/Textures/Constructor.types";
import { MouseVoxelBuilderComponent } from "@dvegames/vlox/Building/Components/MouseVoxelBuilder.component";
import { MouseVoxelBuilderBoxToolComponent } from "@dvegames/vlox/Building/Components/Mouse/MouseVoxelBuilderBoxTool.component";
import { VoxelItemData } from "../VoxelItemData";
import { AddVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";
import {
  VoxelSearchFilterData,
  VoxelSearchIndex,
} from "../Indexing/VoxelSearchIndex";

import { SchemaRegister } from "@divinevoxel/vlox/VoxelState/SchemaRegister";

elm.css(/* css */ `
.builder {
  display: flex;
  flex-direction: column;
  hr {
    width: 100%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  .voxel-select-container {

      .voxel-select {
        display: block;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 500px;
        min-height: 150px;
        .voxels {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
      } 
  }
  .voxel-node {
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    flex-wrap: wrap;
    border: 2px solid rgba(255, 255, 255, 0.4);

  }
  button {
    padding:5px;
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
    }),
    elm("div", {
      signal: signal((div) => {
        div.innerHTML = "";
        div.append(VoxelSchema(signal.value.data.id));
      }),
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

function VoxelSchema(voxelId: string) {
  const { modelSchema, voxelSchema } = SchemaRegister.getVoxelSchemas(voxelId);
  modelSchema.startEncoding();
  voxelSchema.startEncoding();
  const updated = () => {
    const schema = VoxelPaintDataComponent.get(Builder.node)!.schema;
    console.warn("update the thing", modelSchema.getEncoded());
    schema.shapeState = modelSchema.getEncoded();
    schema.mod = voxelSchema.getEncoded();
  };

  const modelSchemaNodes = modelSchema.nodes.map((node) => {
    if (!node.valuePalette) {
      return IntProp(node.id, {
        initialize(schemaNode) {
          schemaNode.enableProxy(
            () => modelSchema.getNmber(node.id),
            (value) => {
              modelSchema.setNumber(node.id, value);
              updated();
            }
          );
        },
      });
    }
    return SelectProp(node.id, {
      options: node.valuePalette._palette,
      initialize(schemaNode) {
        schemaNode.enableProxy(
          () => modelSchema.getValue(node.id),
          (value) => {
            modelSchema.setValue(node.id, value);
            updated();
          }
        );
      },
    });
  });

  const voxelSchemaNodes = voxelSchema.nodes.map((node) => {
    if (!node.valuePalette) {
      return IntProp(node.id, {
        initialize(schemaNode) {
          schemaNode.enableProxy(
            () => voxelSchema.getNmber(node.id),
            (value) => {
              voxelSchema.setNumber(node.id, value);
              updated();
            }
          );
        },
      });
    }
    return SelectProp(node.id, {
      options: node.valuePalette._palette,
      initialize(schemaNode) {
        schemaNode.enableProxy(
          () => voxelSchema.getValue(node.id),
          (value) => {
            voxelSchema.setValue(node.id, value);
            updated();
          }
        );
      },
    });
  });
  return frag(
    elm("p", "Model State"),
    (modelSchemaNodes.length &&
      SchemaEditor({
        schemaInstance: Schema.CreateInstance(...modelSchemaNodes),
      })) ||
      null,
    elm("p", "Voxel State"),
    (voxelSchemaNodes.length &&
      SchemaEditor({
        schemaInstance: Schema.CreateInstance(...voxelSchemaNodes),
      })) ||
      null
  );
}

const VoxelDisplay = (
  name: string,
  data: VoxelData,
  image: ConstructorTextureData
) =>
  elm(
    "div",
    { className: "voxel-display" },
    elm("p", {}, name),
    VoxelImage(image)
  );

function VoxelSelect() {
  const filters: VoxelSearchFilterData[] = [];
  const selectedVoxel = useSignal<VoxelItemData>();
  const voxelsParent = elm("div", "voxels");
  const searchUpdate = useSignal();
  let searchArray: string[] = [];
  const searchSchema = Schema.CreateInstance<{ search: string }>(
    StringProp("search", {
      initialize: (node) => {
        node.observers.updatedOrLoadedIn.subscribe(() => {
          searchArray = node.get().split(" ");
          searchUpdate.broadcast();
        });
      },
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
        signal: searchUpdate((elm) => {
          let visiable = true;
          if (filters.length) {
            if (!VoxelSearchIndex.voxelMatchesSearch(data.id, filters)) {
              visiable = false;
            } else {
              visiable = true;
            }
          }

          if (!visiable) {
            elm.style.display = "none";
            return;
          }
          if (!searchSchema.search) {
            visiable = true;
          } else {
            if (!name) visiable = false;
            if (!FuzzySearch.fuzzyCloseMatch(name.split("_"), searchArray, 0.2))
              visiable = false;
          }

          elm.style.display = visiable ? "block" : "none";
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

      if (!placeData || placeData.length == 1) {
        return voxelSelect(
          data,
          data.name || data.id,
          display,
          placeData ? placeData[0].data : { id: data.id }
        );
      }

      const signal = useSignal();
      const searched = useSignal();

      let active = true;
      let anyActive = false;
      let open = false;
      return frag(
        elm(
          "div",
          {
            className: "voxel-node",
            signal: [
              searchUpdate((elm) => {
                active = true;
                anyActive = false;
                if (filters.length) {
                  if (!VoxelSearchIndex.voxelMatchesSearch(data.id, filters)) {
                    active = false;
                    searched.broadcast();
                    return;
                  } else {
                    active = true;
                  }
                }
                if (searchArray.length) {
                  for (const data of placeData) {
                    if (
                      FuzzySearch.fuzzyCloseMatch(
                        data.name.split("_"),
                        searchArray,
                        0.2
                      )
                    ) {
                      anyActive = true;
                      break;
                    }
                  }
                }
                searched.broadcast();
              }),
              searched((elm) =>
                (!searchSchema.search || anyActive) && active
                  ? (elm.style.display = "block")
                  : (elm.style.display = "none")
              ),
            ],
          },
          VoxelDisplay(data.name || data.id, data, display),
          elm(
            "button",
            {
              signal: [
                searched((elm) => {
                  !searchSchema.search
                    ? (elm.style.display = "block")
                    : (elm.style.display = "none");
                }),
              ],
              onclick() {
                open = !open;
                signal.broadcast();
              },
            },
            "Show Varations"
          )
        ),
        elm(
          "div",
          {
            signal: [
              signal((elm) => {
                open
                  ? (elm.style.display = "flex")
                  : (elm.style.display = "none");
              }),
              searched((elm) => {
                ((!searchSchema.search && open) || anyActive) && active
                  ? (elm.style.display = "flex")
                  : (elm.style.display = "none");
              }),
            ],
            style: {
              display: "none",
              backgroundColor: "#1a1a1a",
              flexDirection: "row",
              flexWrap: "wrap",
            },
          },
          placeData.map((_) => voxelSelect(data, _.name, _.texture, _.data))
        )
      );
    })
  );

  const voxelFilter = (data: VoxelSearchFilterData) => {
    const signal = useSignal();

    const ref = useRef<HTMLDivElement>();
    return elm(
      "div",
      {
        ref,
        style: {
          display: "flex",
          flexDirection: "column",
        },
      },
      elm(
        "div",
        {
          ref,
          style: {
            display: "flex",
            flexDirection: "row",
          },
        },
        elm(
          "div",
          {
            ref,
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
          },
          elm(
            "button",
            {
              style: {
                maxWidth: "30px",
                maxHeight: "30px",
              },
              onclick() {
                filters.splice(
                  filters.findIndex((_) => _ == data),
                  1
                );
                ref.current!.remove();
                searchUpdate.broadcast();
              },
            },
            "X"
          )
        ),
        elm(
          "div",
          {
            ref,
            style: {
              display: "flex",
              flexDirection: "column",
              width: "100%",
            },
          },
          elm(
            "div",
            {
              className: "form-group",
            },
            elm("label", { className: "label" }, "Tag"),
            elm(
              "select",
              {
                className: "input",
                onchange(ev) {
                  data.tag = (ev.target as HTMLSelectElement).value;
                  data.value = undefined;
                  signal.broadcast();
                  searchUpdate.broadcast();
                },
              },
              [
                elm(
                  "option",
                  { selected: true, disabled: true, value: "" },
                  "Select Tag"
                ),
                ...[...VoxelSearchIndex.tagIndexes.keys()].map((value) =>
                  elm("option", { value }, value)
                ),
              ]
            )
          ),
          elm(
            "div",
            {
              className: "form-group",
            },
            elm("label", { className: "label" }, "Value"),
            elm("select", {
              className: "input",

              onchange(ev) {
                data.value = (ev.target as HTMLSelectElement).value;
                console.log("UPDATED", data);

                searchUpdate.broadcast();
              },
              signal: signal((el) => {
                el.innerHTML = "";
                elm.appendChildern(el, [
                  elm(
                    "option",
                    { selected: true, disabled: true, value: "" },
                    "Select Value"
                  ),
                  ...[...VoxelSearchIndex.tagIndexes.get(data.tag)!.values].map(
                    (value) => elm("option", { value }, value)
                  ),
                ]);
              }),
            })
          )
        )
      )
    );
  };

  const filterContainerRef = useRef<HTMLDivElement>();
  return elm(
    "div",
    {
      className: "voxel-select-container",
    },
    SelectVoxel(selectedVoxel),
    elm("hr"),
    SchemaEditor({
      schemaInstance: searchSchema,
    }),
    elm(
      "button",
      {
        onclick() {
          const data = { tag: "", value: "" };
          filters.push(data);
          elm.appendChildern(filterContainerRef.current!, [voxelFilter(data)]);
        },
      },
      "Add Filter"
    ),
    elm("div", {
      ref: filterContainerRef,
      style: {
        display: "flex",
        flexDirection: "column",
      },
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
    elm("hr"),
    VoxelSelect()
  );
});
