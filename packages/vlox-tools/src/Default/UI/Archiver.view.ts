import { elm, frag } from "@amodx/elm";
import { ToolPanelViews } from "../../DebugPanelViews";
import { Archiver } from "../Managers/Archiver";
import { useFileDownload } from "../Hooks/useFileDownload";
import { useFileUpload } from "../Hooks/useFileUpload";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { BooleanProp, Schema } from "@amodx/schemas";
ToolPanelViews.registerView("Archiver", (component) => {
  const { downloadFile } = useFileDownload();
  const { fileInput, uploadFile } = useFileUpload();

  return frag(
    elm(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
        },
      },
      elm(
        "button",
        {
          async onclick() {
            downloadFile(
              "archived-world.bin",
              (await Archiver.archiveWorld()) as any
            );
          },
        },
        "Archive World"
      ),
      elm(
        "button",
        {
          async onclick() {
            const binary = await uploadFile("binary");
            if (!binary) return;
            Archiver.importWorld(binary);
          },
        },
        "Import World"
      ),
      elm(
        "button",
        {
          async onclick() {
            downloadFile(
              "dve-cache.bin",
              (await Archiver.archiveCache()) as any
            );
          },
        },
        "Archive Cache"
      ),
      SchemaEditor({
        schemaInstance: Schema.CreateInstance(
          BooleanProp("Cached Data", {
            value: Boolean(localStorage.getItem("cached-data")),
            initialize(node) {
              node.observers.updated.subscribe((node) => {
                const v = Boolean(node.get());
                v
                  ? localStorage.setItem("cached-data", "true")
                  : localStorage.removeItem("cached-data");
              });
            },
          })
        ),
      }),

      fileInput
    )
  );
});
