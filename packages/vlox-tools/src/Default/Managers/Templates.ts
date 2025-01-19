import { Vec3Array, Vector3Like } from "@amodx/math";
import { Graph, Node, NodeCursor } from "@amodx/ncs/";
import { VoxelTemplateComponent } from "@dvegames/vlox/Core/Components/Voxels/Templates/VoxelTemplate.component";
import { VoxelBoxVolumeComponent } from "@dvegames/vlox/Core/Components/Voxels/Volumes/VoxelBoxVolume.component";
import { VoxelBoxVolumeMeshComponent } from "@dvegames/vlox/Core/Components/Voxels/Volumes/VoxelBoxVolumeMesh.component";

import { VoxelBoxVolumeControllerComponent } from "@dvegames/vlox/Core/Components/Voxels/Volumes/VoxelBoxVolumeController.component";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";
import { VoxelTemplateData } from "@divinevoxel/vlox/Templates/VoxelTemplates.types";
import { VoxelTemplate } from "@divinevoxel/vlox/Templates/VoxelTemplate";
import { DimensionProviderComponent } from "@dvegames/vlox/Core/Components/Providers/DimensionProvider.component";
export class Templates {
  static node: NodeCursor;

  static init(graph: Graph) {
    this.node = graph.addNode(Node({}, []));
  }

  static addTemplate(start: Vec3Array, scale: Vec3Array) {
    this.node.graph.addNode(
      Node({}, [
        TransformComponent({
          position: Vector3Like.FromArray(start),
          scale: Vector3Like.Create(...scale),
        }),
        VoxelTemplateComponent({}),
        DimensionProviderComponent({}),
        VoxelBoxVolumeComponent(),
        VoxelBoxVolumeMeshComponent(),
        VoxelBoxVolumeControllerComponent(),
      ]),
      this.node.index
    );
  }

  static loadTemplate(data: VoxelTemplateData) {
    const templateNode = this.node.graph
      .addNode(
        Node({}, [
          TransformComponent({
            scale: Vector3Like.Create(...data.size),
          }),
          DimensionProviderComponent({}),
          VoxelTemplateComponent(),
          VoxelBoxVolumeComponent(),
          VoxelBoxVolumeMeshComponent(),
          VoxelBoxVolumeControllerComponent(),
        ]),
        this.node.index
      )
      .cloneCursor();
    const template = VoxelTemplateComponent.get(templateNode)!;
    template.data.template = new VoxelTemplate(data);
  
  }
}
