/**
 * Proxy para mídia do Instagram (imagens/vídeos).
 * Contorna bloqueio Cross-Origin-Resource-Policy do CDN ao exibir no modal.
 * Só aceita URLs de domínios conhecidos do Instagram.
 */

function isAllowedUrl(urlString) {
  try {
    const u = new URL(urlString);
    const host = u.hostname.toLowerCase();
    return (
      host === 'instagram.com' ||
      host.endsWith('.instagram.com') ||
      host.endsWith('.cdninstagram.com') ||
      host.endsWith('.fbcdn.net')
    );
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawUrl = req.query.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return res.status(400).json({ error: 'Parâmetro url obrigatório' });
  }

  const decodedUrl = decodeURIComponent(rawUrl);
  if (!isAllowedUrl(decodedUrl)) {
    return res.status(403).json({ error: 'URL não permitida' });
  }

  try {
    const response = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).end();
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(502).json({ error: 'Erro ao buscar mídia' });
  }
}
