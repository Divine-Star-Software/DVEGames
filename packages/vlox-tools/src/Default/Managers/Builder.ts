import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { VoxelInersectionComponent } from "@dvegames/vlox/Core/Components/Voxels/Interaction/VoxelIntersection.component";
import { VoxelMousePickComponent } from "@dvegames/vlox/Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { VoxelRemoverComponent } from "@dvegames/vlox/Core/Components/Voxels/Interaction/VoxelRemover.component";
import { VoxelPlacerComponent } from "@dvegames/vlox/Core/Components/Voxels/Interaction/VoxelPlacer.component";
import { MouseVoxelBuilderComponent } from "@dvegames/vlox/Building/Components/MouseVoxelBuilder.component";
import { VoxelPaintDataComponent } from "@dvegames/vlox/Core/Components/Voxels/VoxelPaintData.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Core/Components/Providers/DimensionProvider.component";
import { AddVoxelData } from "@divinevoxel/vlox/Data/Types/WorldData.types";
import { VoxelData } from "@divinevoxel/vlox/Types";
import { VoxelSearchIndex } from "../../Default/Indexing/VoxelSearchIndex";

export class Builder {
  static voxelData: VoxelData[] = [];

  static setVoxelDatA(data: VoxelData[]) {
    this.voxelData = data;
    VoxelSearchIndex.setData(data);
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
    if (data?.mod !== undefined) schema.mod = data.mod;
  }
}
