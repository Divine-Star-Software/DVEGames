import { VoxelPaintDataComponent } from "@dvegames/vlox/Voxels/VoxelPaintData.component";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";

import { Observable } from "@amodx/core/Observers";

export class BuilderState {
  static paintData: (typeof VoxelPaintDataComponent)["default"];
  static voxelUpdated = new Observable();

  static setData(data: Partial<PaintVoxelData>) {
    const schema = this.paintData.schema;
    if (data?.id !== undefined) schema.id = data.id;
    if (data?.secondaryVoxelId !== undefined)
      schema.secondaryVoxelId = data.secondaryVoxelId;
    if (data?.level !== undefined) schema.level = data.level;
    if (data?.levelState !== undefined) schema.levelState = data.levelState;
    if (data?.state !== undefined) schema.state = data.state;
    if (data?.mod !== undefined) schema.mod = data.mod;
    this.voxelUpdated.notify();
  }
}
