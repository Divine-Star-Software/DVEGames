import { Vec3Array, Vector3Like } from "@amodx/math";
import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { VoxelTemplateComponent } from "@dvegames/foundation/Core/Components/Voxels/Templates/VoxelTemplate.component";
import { VoxelBoxVolumeComponent } from "@dvegames/foundation/Core/Components/Voxels/Volumes/VoxelBoxVolume.component";
import { VoxelBoxVolumeMeshComponent } from "@dvegames/foundation/Core/Components/Voxels/Volumes/VoxelBoxVolumeMesh.component";

import { VoxelBoxVolumeControllerComponent } from "@dvegames/foundation/Core/Components/Voxels/Volumes/VoxelBoxVolumeController.component";
import { TransformComponent } from "@dvegames/foundation/Core/Components/Base/Transform.component";
import { VoxelTemplateData } from "@divinevoxel/foundation/Default/Templates/VoxelTemplates.types";
import { VoxelTemplate } from "@divinevoxel/foundation/Default/Templates/VoxelTemplate";
import { DimensionProviderComponent } from "@dvegames/foundation/Core/Components/Providers/DimensionProvider.component";
export class Templates {
  static node: NodeInstance;

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
      this.node
    );
  }

  static loadTemplate(data: VoxelTemplateData) {
    const templateNode = this.node.graph.addNode(
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
      this.node
    );
    const template = VoxelTemplateComponent.get(templateNode)!;
    template.data.template = new VoxelTemplate(data);
    console.log("LOADED TEMPLATE", template.data.template);
  }
}
