export const fileDownload = (url: string, fileName: string) => {
  if (!url) return undefined;

  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const href = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = fileName;
      a.click();
      a.remove();
    });
};
