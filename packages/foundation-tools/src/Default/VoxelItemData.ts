import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
import { ConstructorTextureData } from "@divinevoxel/foundation/Textures/Constructor.types";

export class VoxelItemData {
  static Create(
    name: string,
    data: Partial<AddVoxelData>,
    texture: ConstructorTextureData
  ) {
    return new VoxelItemData(name, AddVoxelData.Create(data), texture);
  }

  private constructor(
    public name: string,
    public data: AddVoxelData,
    public texture: ConstructorTextureData
  ) {}
}
