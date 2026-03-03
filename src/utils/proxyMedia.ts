/**
 * Em produção, as mídias do CDN do Instagram são servidas via nosso proxy
 * para evitar bloqueio Cross-Origin-Resource-Policy (NotSameOrigin).
 * Em dev retorna a URL direta.
 */
export function getProxiedMediaUrl(url: string): string {
  if (!url) return '';
  if (!import.meta.env.PROD) return url;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/api/proxy-media?url=${encodeURIComponent(url)}`;
}
