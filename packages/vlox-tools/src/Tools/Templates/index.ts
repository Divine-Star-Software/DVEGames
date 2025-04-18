import { elm, frag } from "@amodx/elm";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph } from "@amodx/ncs";
import { BinaryObject } from "@amodx/binary";
import { Compressor } from "@amodx/core/Compression";
import { NodeCursor } from "@amodx/ncs/";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { VoxelTemplateComponent } from "@dvegames/vlox/Templates/VoxelTemplate.component";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { VoxelBoxVolumeControllerComponent } from "@dvegames/vlox/Voxels/Volumes/VoxelBoxVolumeController.component";
import { useFileDownload } from "../../UI/Hooks/useFileDownload";
import { useFileUpload } from "../../UI/Hooks/useFileUpload";
import { Schema, SelectProp } from "@amodx/schemas";
import { Vec3Array, Vector3Like } from "@amodx/math";
import { Node } from "@amodx/ncs/";

import { VoxelBoxVolumeComponent } from "@dvegames/vlox/Voxels/Volumes/VoxelBoxVolume.component";
import { VoxelBoxVolumeMeshComponent } from "@dvegames/vlox/Voxels/Volumes/VoxelBoxVolumeMesh.component";
import { ArchivedVoxelTemplate } from "@divinevoxel/vlox/Templates/Archive/ArchivedVoxelTemplate";
import { ArchivedVoxelTemplateData } from "@divinevoxel/vlox/Templates/Archive/ArchivedVoxelTemplate.types";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
class Templates {
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

  static loadTemplate(data: ArchivedVoxelTemplateData) {
    const templateNode = this.node.graph

      .addNode(
        Node({}, [
          TransformComponent({
            scale: Vector3Like.Create(...data.bounds),
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
    template.data.template = new ArchivedVoxelTemplate(data);
  }
}

const VoxelTemplateComp = (nodeIndex: number) => {
  const node = NodeCursor.Get();
  node.setNode(Templates.node.graph, nodeIndex);
  const template = VoxelTemplateComponent.get(node)!;
  const transform = TransformComponent.get(node)!;

  const volumeController = VoxelBoxVolumeControllerComponent.get(node)!;

  const { downloadFile } = useFileDownload();
  let div: HTMLDivElement;
  const rotation = Schema.CreateInstance<{
    axes: string;
    angle: string;
    flip: string;
  }>(
    SelectProp("axes", { options: ["x", "y", "z"], value: "y" }),
    SelectProp("angle", { options: ["90", "180", "270"], value: "90" }),
    SelectProp("flip", { options: ["x", "y", "z"], value: "x" })
  );
  return elm(
    "div",
    {
      hooks: {
        afterRender: (elm) => (div = elm),
      },
    },
    SchemaEditor({
      schema: transform.schema,
    }),
    SchemaEditor({
      schema: volumeController.schema,
    }),
    SchemaEditor({
      schemaInstance: rotation,
    }),
    elm(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
        },
      },
      elm(
        "button",
        {
          onclick: () =>
            template.data.rotate(
              Number(rotation.angle) as any,
              rotation.axes as any
            ),
        },
        "Rotate"
      ),
      elm(
        "button",
        {
          onclick: () => template.data.flip(rotation.flip as any),
        },
        "Flip"
      )
    ),

    elm(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        },
      },
      elm(
        "button",
        {
          onclick: () =>
            (volumeController.schema.visible =
              !volumeController.schema.visible),
        },
        "Toggle"
      ),
      elm(
        "button",
        {
          onclick: () => template.data.clear(),
        },
        "Clear"
      ),
      elm(
        "button",
        {
          onclick: () => template.data.build(),
        },
        "Build"
      ),
      elm(
        "button",
        {
          async onclick() {
            template.data.store();
          },
        },
        "Store"
      ),
      elm(
        "button",
        {
          async onclick() {
            downloadFile(
              "template.bin",
              (await Compressor.core.compressArrayBuffer(
                BinaryObject.objectToBuffer(template.data.template.toJSON())
              )) as any
            );
          },
        },
        "Download"
      ),
      elm(
        "button",
        {
          onclick() {
            template.node.dispose();
            div.remove();
          },
        },
        "Delete"
      )
    )
  );
};

export default function (graph: Graph) {
  ToolPanelViews.registerView("VoxelTemplates", (component) => {
    const voxelsParent = elm("div", "voxels");
    const { fileInput, uploadFile } = useFileUpload();

    Templates.node.observers.childAdded.subscribe((node) => {
      elm.appendChildern(voxelsParent, [VoxelTemplateComp(node.index)]);
    });

    if (Templates.node.childrenArray) {
      for (const child of Templates.node.childrenArray) {
        elm.appendChildern(voxelsParent, [VoxelTemplateComp(child)]);
      }
    }

    return frag(
      elm(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
          },
        },
        elm(
          "button",
          {
            onclick() {
              Templates.addTemplate([0, 5, 0], [18, 26, 18]);
            },
          },
          "Add New Template"
        ),
        elm(
          "button",
          {
            async onclick() {
              const binary = await uploadFile("binary");
              if (!binary) return;
              BinaryObject.setUseSharedMemory(true);
              const template = BinaryObject.bufferToObject(
                (await Compressor.core.decompressArrayBuffer(binary)).buffer
              ) as any;
              BinaryObject.setUseSharedMemory(false);

              await Templates.loadTemplate(template);
            },
          },
          "Load Template"
        )
      ),
      fileInput,
      voxelsParent
    );
  });
}
