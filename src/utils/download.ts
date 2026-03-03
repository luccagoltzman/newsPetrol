/**
 * Tenta baixar um arquivo pela URL.
 * Se o servidor permitir CORS, faz fetch e dispara download; senão abre em nova aba.
 */
export function downloadMedia(url: string, filename: string): void {
  const ext = filename.includes('.') ? '' : (url.includes('video') || url.includes('mp4') ? '.mp4' : '.jpg');
  const name = filename.replace(/\s+/g, '-') + ext;

  fetch(url, { mode: 'cors' })
    .then((res) => {
      if (!res.ok) throw new Error('Falha no fetch');
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    });
}
