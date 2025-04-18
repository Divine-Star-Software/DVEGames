import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { LocationData } from "@divinevoxel/vlox/Math";
import { RawVoxelData } from "@divinevoxel/vlox/Voxels";
import { VoxelUpdateData } from "@divinevoxel/vlox/Tasks/Tasks.types";
import { IVoxelTemplateData } from "@divinevoxel/vlox/Templates/VoxelTemplates.types";
export interface IVoxelUpdater {
  paint(
    location: LocationData,
    raw: RawVoxelData,
    data?: VoxelUpdateData
  ): Promise<void>;
  paintArea(
    dimension: number,
    start: Vector3Like,
    end: Vector3Like,
    raw: RawVoxelData,
    data?: VoxelUpdateData
  ): Promise<void>;
  paintTemplate(
    location: LocationData,
    tmeplateData: IVoxelTemplateData<any>,
    data?: VoxelUpdateData
  ): Promise<void>;
  erase(location: LocationData, data?: VoxelUpdateData): Promise<void>;
  eraseArea(
    dimension: number,
    start: Vector3Like,
    end: Vector3Like,
    data?: VoxelUpdateData
  ): Promise<void>;
  eraseTemplate(
    location: LocationData,
    tmeplateData: IVoxelTemplateData<any>,
    data?: VoxelUpdateData
  ): Promise<void>;
}

class IVoxelUpdaterPlaceHolder implements IVoxelUpdater {
  paint(): Promise<void> {
    throw new Error("paint method not implemented.");
  }
  paintArea(): Promise<void> {
    throw new Error("paintArea method not implemented.");
  }
  paintTemplate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  erase(): Promise<void> {
    throw new Error("paintTemplate method not implemented.");
  }
  eraseArea(): Promise<void> {
    throw new Error("eraseArea method not implemented.");
  }
  eraseTemplate(): Promise<void> {
    throw new Error("eraseTemplate method not implemented.");
  }
}

/**
 * Provides an interface to update the voxel world.
 */
export const VoxelUpdateProviderComponent = NCS.registerComponent({
  type: "voxel-update-provider",
  data: NCS.data<{ updater: IVoxelUpdater }>(),
  init(component) {
    component.data = {
      updater: new IVoxelUpdaterPlaceHolder(),
    };
  },
});
