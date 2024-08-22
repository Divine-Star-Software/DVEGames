export function useFileDownload() {
  return {
    downloadFile: (
      name: string,
      data: ArrayBuffer | string,
      mmyType: string = "application/octet-stream"
    ) => {
      const blob = new Blob([data], {
        type: mmyType,
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = name;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    },
  };
}
