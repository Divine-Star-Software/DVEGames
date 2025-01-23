import { elm, frag, Signal, useRef, useSignal } from "@amodx/elm";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import ItemNode from "./ItemNode";
import ItemGroup from "./ItemGroup";
import ItemSearch from "./ItemSearch";

elm.css(/* css */ `
.voxel-select {
  .nodes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 400px;
    height: 100%;
    .item-node {
      width: 64px;
      height: 64px;
      margin: 6px auto 6px auto;

      &:hover {
        cursor: pointer;
      }
      .item-image {
        width: 64px;
        height: 64px;
        image-rendering: pixelated;
      }
    }

    
    .item-group {
      width: 64px;
      height: 64px;
      position: relative; 
      margin: 6px auto 6px auto;

      &.closed::after {
        content: "+";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: white;
      }

      &.expanded::after {
        content: "-";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: white;
      }

      .item-image {
        width: 64px;
        height: 64px;
        image-rendering: pixelated;
        transition: 0.15s;
        filter: brightness(0.6);
      }

      &:hover {
        cursor: pointer;
        .item-image {
          transition: 0.15s;
          filter: brightness(0.9);
        }
      }
    }
  }
}

`);

export default function VoxelSelect() {
  return elm(
    "div",
    { className: "voxel-select" },
    ItemSearch(),
    elm(
      "div",
      { className: "nodes" },
      VoxelIndex.instance.stateArray.map((state) => {
        if (state.stateArray.length > 1) {
          return ItemGroup({
            state,
          });
        }

        return ItemNode({
          state: state.stateArray[0],
        });
      })
    )
  );
}
