import { VoxelData } from "@divinevoxel/core";

class VoxelTagIndex {
  valueMap = new Map<string, Set<string>>();

  values = new Set<string>();
  constructor(public tag: string) {}

  add(id: string, value: any) {
    value = JSON.stringify(value);

    let voxelSet = this.valueMap.get(value);
    if (!voxelSet) {
      voxelSet = new Set();
      this.valueMap.set(value, voxelSet);
    }

    voxelSet.add(id);
    this.values.add(value);
  }
}

export type VoxelSearchFilterData = {
  tag: string;
  value: any;
};

export class VoxelSearchIndex {
  static tagIndexes = new Map<string, VoxelTagIndex>();

  static setData(voxelData: VoxelData[]) {
    for (const voxel of voxelData) {
      for (const [tag, value] of voxel.tags) {
        let tagIndex = this.tagIndexes.get(tag);

        if (!tagIndex) {
          tagIndex = new VoxelTagIndex(tag);
          this.tagIndexes.set(tag, tagIndex);
        }

        tagIndex.add(voxel.id, value);
      }
    }
  }

  static voxelMatchesSearch(id: string, searchData: VoxelSearchFilterData[]) {
    for (const tagSearch of searchData) {
      if (tagSearch.value === undefined) continue;
      const tag = this.tagIndexes.get(tagSearch.tag)!;
      const voxelSet = tag.valueMap.get(tagSearch.value);
      if (!voxelSet || !voxelSet.has(id)) {
        return false;
      }
    }
    return true;
  }
}
