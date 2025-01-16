import { PaintVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";
import { ConstructorTextureData } from "@divinevoxel/vlox/Textures/Constructor.types";

export class VoxelItemData {
  static Create(
    name: string,
    data: Partial<PaintVoxelData>,
    texture: ConstructorTextureData
  ) {
    return new VoxelItemData(name, PaintVoxelData.Create(data), texture);
  }

  private constructor(
    public name: string,
    public data: PaintVoxelData,
    public texture: ConstructorTextureData
  ) {}
}
