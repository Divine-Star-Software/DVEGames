export function useFileDownload() {
  return {
    downloadFile: (
      name: string,
      data: ArrayBufferLike | string,
      mmyType: string = "application/octet-stream"
    ) => {
      const blob = new Blob([data as any], {
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
