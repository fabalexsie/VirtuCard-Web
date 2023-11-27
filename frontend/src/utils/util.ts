export function downloadAsFile(
  filename: string,
  data: string,
  mimeType: string = 'text/plain',
) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function logError(error: any) {
  const c = console;
  c.error(error);
}
