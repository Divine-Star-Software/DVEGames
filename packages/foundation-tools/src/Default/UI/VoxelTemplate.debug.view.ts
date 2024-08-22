import { BinaryObject } from "@amodx/binary";
import { Compressor } from "@amodx/core/Compression";
import { elm, frag } from "@amodx/elm";
import { NodeInstance } from "@amodx/ncs/";
import { TransformComponent } from "@dvegames/foundation/Core/Components/Base/Transform.component";
import { ToolPanelViews } from "../../DebugPanelViews"
import { VoxelTemplateComponent } from "@dvegames/foundation/Core/Components/Voxels/Templates/VoxelTemplate.component";
import { Templates } from "../Managers/Templates";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { VoxelBoxVolumeControllerComponent } from "@dvegames/foundation/Core/Components/Voxels/Volumes/VoxelBoxVolumeController.component";
import { useFileDownload } from "../Hooks/useFileDownload";
import { useFileUpload } from "../Hooks/useFileUpload";
import { Schema, SelectProp } from "@amodx/schemas";

const VoxelTemplate = (node: NodeInstance) => {
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
      schemaInstance: transform.schema,
    }),
    SchemaEditor({
      schemaInstance: volumeController.schema,
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
            template.logic.rotate(
              Number(rotation.angle) as any,
              rotation.axes as any
            ),
        },
        "Rotate"
      ),
      elm(
        "button",
        {
          onclick: () => template.logic.flip(rotation.flip as any),
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
          onclick: () => template.logic.clear(),
        },
        "Clear"
      ),
      elm(
        "button",
        {
          onclick: () => template.logic.build(),
        },
        "Build"
      ),
      elm(
        "button",
        {
          async onclick() {
            template.logic.store();
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
              await Compressor.core.compressArrayBuffer(
                BinaryObject.objectToBuffer(template.data.template.toJSON())
              )
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

ToolPanelViews.registerView("VoxelTemplates", (component) => {
  const voxelsParent = elm("div", "voxels");
  const { fileInput, uploadFile } = useFileUpload();

  Templates.node.observers.childAdded.subscribe((node) => {
    elm.appendChildern(voxelsParent, [VoxelTemplate(node)]);
  });
  Templates.node.children.forEach((_) =>
    elm.appendChildern(voxelsParent, [VoxelTemplate(_)])
  );

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
            Templates.addTemplate("mels-realm", [0, 5, 0], [18, 26, 18]);
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

            await Templates.loadTemplate("mels-realm", template);
          },
        },
        "Load Template"
      )
    ),
    fileInput,
    voxelsParent
  );
});
