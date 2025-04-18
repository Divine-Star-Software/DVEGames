import { elm, frag, useSignal, useRef } from "@amodx/elm";
import { SchemaEditor } from "../../../../UI/Schemas/SchemaEditor";
import { Schema, SelectProp, StringProp } from "@amodx/schemas";
import { ItemSearchManager } from "./ItemSearchManager";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import CollapsibleSection from "../../../../UI/Components/CollapsibleSection"

elm.css(/* css */ `
.item-filters {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .button {
    display: block;
}
    .schema-editor {
        width: 100%;
        .form-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            .label {
                width: 100%;
            }
            .input {
                width: 100%;
        }
        }
    }

}


.filters {
    height: 100px;
    overflow-y: scroll;
    .button {
    display: block;
}
    .filter {
        display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .schema-editor {
        width: 100%;
        .form-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            .label {
                width: 100%;
            }
            .input {
                width: 100%;
        }
        }
    }


    }
    }
    
`);
function Filter({ tagId }: { tagId: string }) {
  const tags = VoxelIndex.instance.tagIndexes.get(tagId)!;
  const tagValues = [...tags.values];

  const optionMap = new Map<string, any>();
  const options = tagValues.map((value) => {
    const option = String(value);
    optionMap.set(option, value);
    return option;
  });
  const filter = ItemSearchManager.createFilter(tagId, tagValues[0]);
  ItemSearchManager.setFilter(filter);
  const schemaInstance = Schema.CreateInstance<{ search: string }>(
    SelectProp(tagId, {
      options,
      initialize: (node) => {
        node.observers.updatedOrLoadedIn.subscribe(() => {
          const value = optionMap.get(String(node.get()))!;
          filter[1] = value;
          ItemSearchManager.filtersUpdated.notify();
        });
      },
    })
  );
  const parentRef = useRef<HTMLDivElement>();
  return elm(
    "div",
    { className: "filter", ref: parentRef },
    SchemaEditor({
      schemaInstance,
    }),
    elm(
      "button",
      {
        className: "button",
        onclick() {
          ItemSearchManager.removeFilter(filter);
          parentRef.current!.remove();
        },
      },
      "X"
    )
  );
}
function ItemFilters() {
  const options = [...VoxelIndex.instance.tagIndexes.keys()];

  let currentFilter = options[0];
  const schemaInstance = Schema.CreateInstance<{ search: string }>(
    SelectProp("filters", {
      options,
      initialize: (node) => {
        node.observers.updatedOrLoadedIn.subscribe(() => {
          currentFilter = String(node.get());
        });
      },
    })
  );
  const filtersDiv = useRef<HTMLDivElement>();

  return frag(
    elm(
      "div",
      {
        className: "item-filters",
      },
      SchemaEditor({
        schemaInstance,
      }),
      elm(
        "button",

        {
          className: "button",
          onclick() {
            filtersDiv.current!.append(Filter({ tagId: currentFilter }));
          },
        },
        "+"
      )
    ),
    elm("div", { className: "filters", ref: filtersDiv })
  );
}

export default function ItemSearch() {
  const schemaInstance = Schema.CreateInstance<{ search: string }>(
    StringProp("search", {
      initialize: (node) => {
        node.observers.updatedOrLoadedIn.subscribe(() => {
          const value = String(node.get());
          ItemSearchManager.updateSearch(value);
        });
      },
    })
  );
  return elm(
    "div",
    {
      className: "item-search",
    },
    SchemaEditor({
      schemaInstance,
    }),
    CollapsibleSection(
      {
        title: "Filters",
      },
      ItemFilters()
    )
  );
}
