import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { VoxelInersectionComponent } from "@dvegames/foundation/Core/Components/Voxels/Interaction/VoxelIntersection.component";
import { VoxelMousePickComponent } from "@dvegames/foundation/Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { VoxelRemoverComponent } from "@dvegames/foundation/Core/Components/Voxels/Interaction/VoxelRemover.component";
import { VoxelPlacerComponent } from "@dvegames/foundation/Core/Components/Voxels/Interaction/VoxelPlacer.component";
import { MouseVoxelBuilderComponent } from "@dvegames/foundation/Building/Components/MouseVoxelBuilder.component";
import { VoxelPaintDataComponent } from "@dvegames/foundation/Core/Components/Voxels/VoxelPaintData.component";
import { DimensionProviderComponent } from "@dvegames/foundation/Core/Components/Providers/DimensionProvider.component";
import { AddVoxelData } from "@divinevoxel/foundation/Data/Types/WorldData.types";
import { VoxelData } from "@divinevoxel/core";

export class Builder {
  static voxelData: VoxelData[] = [];

  static setVoxelDatA(data: VoxelData[]) {
    this.voxelData = data;
  }
  static node: NodeInstance;

  static enabled = false;



  static init(graph: Graph) {
    this.node = graph.addNode(
      Node({}, [
        VoxelInersectionComponent(),
        VoxelMousePickComponent(),
        VoxelRemoverComponent(),
        VoxelPlacerComponent(),
        VoxelPaintDataComponent(),
        DimensionProviderComponent(),
        MouseVoxelBuilderComponent(),
      ])
    );
  }

  static setId(id: string) {
    const schema = VoxelPaintDataComponent.get(this.node)!.schema;
    schema.id = id;
  }

  static setData(data: Partial<AddVoxelData>) {
    const schema = VoxelPaintDataComponent.get(this.node)!.schema;
    if (data?.id !== undefined) schema.id = data.id;
    if (data?.secondaryVoxelId !== undefined)
      schema.secondaryVoxelId = data.secondaryVoxelId;
    if (data?.level !== undefined) schema.level = data.level;
    if (data?.levelState !== undefined) schema.levelState = data.levelState;
    if (data?.shapeState !== undefined) schema.shapeState = data.shapeState;
  }
}
