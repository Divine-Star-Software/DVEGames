import { elm, frag } from "@amodx/elm";
import { ToolPanelViews } from "../../DebugPanelViews";
import { Archiver } from "../Managers/Archiver";
import { useFileDownload } from "../Hooks/useFileDownload";
import { useFileUpload } from "../Hooks/useFileUpload";
ToolPanelViews.registerView("Archiver", (component) => {
  const { downloadFile } = useFileDownload();
  const { fileInput, uploadFile } = useFileUpload();
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
          async onclick() {
            downloadFile("archived-world.bin", await Archiver.archiveWorld());
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
      fileInput
    )
  );
});
