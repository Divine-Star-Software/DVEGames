import {
  VoxelIndex,
  VoxelNamedStateContainer,
} from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { elm, frag, useRef, useSignal } from "@amodx/elm";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { ItemSearchManager } from "./ItemSearchManager";
import { Observable } from "@amodx/core/Observers";
import ItemNode from "./ItemNode";
const getName = (state: VoxelNamedStateContainer) => {
  const data = VoxelIndex.instance.dataMap.get(state.voxelId);
  if (data?.title) return data.title;
  if (data?.name) return data.name;

  if (state.stateArray[0].data.name) return state.stateArray[0].data.name;
  if (state.stateArray[0].data.id) return state.stateArray[0].data.id;
  return state.voxelId;
};
export default function ItemGroup({
  state,
}: {
  state: VoxelNamedStateContainer;
}) {
  const image = VoxelTextureIndex.getImage(
    state.voxelId,
    state.stateArray[0].data.id
  );
  const ref = useRef<HTMLDivElement>();
  const expanded = useSignal(false);
  const setExapnded = (value: boolean) => {
    expanded.value = value;
  };
  let enabled = false;
  const setEnabled = (value: boolean) => {
    enabled = value;
    if (!ref.current) return;
    ref.current.style.display = value ? "block" : "none";
  };
  const enabledObserver = new Observable<boolean>();

  const name = getName(state);

  enabledObserver.notify(expanded.value);
  ItemSearchManager.searchUpdated.subscribe(() => {
    setEnabled(
      ItemSearchManager.search == "" && ItemSearchManager.filters.length == 0
    );

    if (
      ItemSearchManager.search != "" ||
      ItemSearchManager.filters.length != 0
    ) {
      return enabledObserver.notify(true);
    }

    if (
      expanded.value &&
      ItemSearchManager.search == "" &&
      ItemSearchManager.filters.length == 0
    ) {
      enabledObserver.notify(true);
    } else {
      enabledObserver.notify(false);
    }
  });

  ItemSearchManager.filtersUpdated.subscribe(() => {
    setEnabled(
      ItemSearchManager.search == "" && ItemSearchManager.filters.length == 0
    );

    enabledObserver.notify(
      ItemSearchManager.search != "" ||
        ItemSearchManager.filters.length != 0 ||
        (expanded.value &&
          ItemSearchManager.search == "" &&
          ItemSearchManager.filters.length == 0)
    );
  });

  return frag(
    elm(
      "div",
      {
        ref,
        className: "item-group closed",
        signal: expanded((elm) =>
          elm.classList.replace(
            expanded.value ? "closed" : "expanded",
            expanded.value ? "expanded" : "closed"
          )
        ),
        onclick() {
          enabledObserver.notify(
            (ItemSearchManager.search != "" &&
              ItemSearchManager.filters.length != 0) ||
              !expanded.value
          );
          setExapnded(!expanded.value);
        },
        title: name,
      },
      image &&
        elm("img", {
          className: "item-image",
          src: image.src,
        })
    ),
    state.stateArray.map((state) =>
      ItemNode({ state, enabledObserver, isGroup: true })
    )
  );
}
