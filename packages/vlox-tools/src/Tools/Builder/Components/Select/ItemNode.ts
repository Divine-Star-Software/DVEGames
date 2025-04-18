import { elm, useRef } from "@amodx/elm";
import { VoxelNamedState } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { ItemSearchManager } from "./ItemSearchManager";
import { FuzzySearch } from "@amodx/core/Search/FuzzySearch";
import { Observable } from "@amodx/core/Observers";

import { BuilderState } from "../../BuilderState";
const temp: string[] = [];
const included = (state: VoxelNamedState, searchStrings: string[][]) => {
  if (ItemSearchManager.search == "" && ItemSearchManager.filters.length == 0)
    return true;
  let filtersPass = true;
  if (ItemSearchManager.filters.length != 0) {
    for (const filter of ItemSearchManager.filters) {
      if (
        !state.tags.has(filter[0]) ||
        state.tags.get(filter[0]) !== filter[1]
      ) {
        filtersPass = false;
        break;
      }
    }
    if (filtersPass) {
      return true;
    }
    if (!filtersPass) return false;
  }

  if (ItemSearchManager.search != "") {
    let found = false;
    for (const search of searchStrings) {
      for (const node of search) {
        temp[0] = node;
        found =
          FuzzySearch.fuzzyCloseMatch(
            temp,
            ItemSearchManager.searchNodes,
            0.6
          ) || ItemSearchManager.searchNodes.includes(node);
        if (found) break;
      }
      return found;
    }
  }
  return filtersPass;
};

export default function ItemNode({
  state,
  enabledObserver,
  isGroup,
}: {
  state: VoxelNamedState;
  isGroup?: boolean;
  enabledObserver?: Observable<boolean>;
}) {
  const image = VoxelTextureIndex.getImage(state.voxelId, state.data.id);

  const ref = useRef<HTMLDivElement>();
  const setEnabled = (value: boolean) => {
    if (!ref.current) return;
    ref.current!.style.display = value ? "block" : "none";
  };

  const idNodes: string[] = state.data.id
    .split("_")
    .map((_) => _.trim().toLocaleLowerCase());

  idNodes.shift();

  const nameNodes: string[] = state.data.name
    ? state.data.name.split(" ").map((_) => _.trim().toLocaleLowerCase())
    : [];

  const keyWords: string[] = state.tags.has("#pvg_keywords")
    ? state.tags.get("#pvg_keywords").split(",")
    : [];

  const searchStrings: string[][] = [idNodes, nameNodes, keyWords];

  if (enabledObserver) {
    let enabled = false;
    enabledObserver.subscribe((ena) => {
      enabled = ena;
      setEnabled(ena);
    });
    ItemSearchManager.searchUpdated.subscribe(() =>
      setEnabled(included(state, searchStrings) && enabled)
    );
    ItemSearchManager.filtersUpdated.subscribe(() =>
      setEnabled(included(state, searchStrings) && enabled)
    );
  } else {
    ItemSearchManager.searchUpdated.subscribe(() =>
      setEnabled(included(state, searchStrings))
    );
    ItemSearchManager.filtersUpdated.subscribe(() =>
      setEnabled(included(state, searchStrings))
    );
  }

  return elm(
    "div",
    {
      ref,
      className: "item-node",
      title: state.data.name || state.data.id,
      style: {
        display: isGroup ? "none" : " block",
      },
      onclick() {
        console.warn("CLICKED", state, state.getPaintData());
        const paintData = state.getPaintData();
        BuilderState.setData(paintData);
      },
    },
    image &&
      elm("img", {
        className: "item-image",
        src: image.src,
      })
  );
}
