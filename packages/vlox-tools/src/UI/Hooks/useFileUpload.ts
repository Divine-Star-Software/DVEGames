interface UseFileUploadObject {
  fileInput: HTMLInputElement;
  uploadFile(type: "string"): Promise<string | null>;
  uploadFile(type: "binary"): Promise<ArrayBuffer | null>;
}

export function useFileUpload(): UseFileUploadObject {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";

  return {
    fileInput,
    uploadFile(type: "string" | "binary" = "binary") {
      return new Promise<any>((resolve) => {
        const listener = () => {
          const file = fileInput.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (type === "string") {
                resolve(reader.result as string);
              } else {
                resolve(reader.result as ArrayBuffer);
              }
            };
            if (type === "string") {
              reader.readAsText(file);
            }
            if (type === "binary") {
              reader.readAsArrayBuffer(file);
            }
          } else {
            resolve(null);
          }
          fileInput.removeEventListener("change", listener);
        };
        fileInput.addEventListener("change", listener);

        fileInput.click();
      });
    },
  };
}
