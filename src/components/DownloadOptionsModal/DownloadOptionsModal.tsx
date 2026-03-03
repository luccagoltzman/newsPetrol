import { useEffect, useState } from 'react';
import type { InstagramPost } from '@/types/instagram.types';
import { downloadMedia, downloadBlob } from '@/utils/download';
import { getProxiedMediaUrl } from '@/utils/proxyMedia';
import { convertVideoForPlatform, type PlatformPreset } from '@/utils/videoConvert';
import { Spinner } from '@/components/Spinner/Spinner';
import styles from './DownloadOptionsModal.module.css';

export interface DownloadOptionsModalProps {
  post: InstagramPost | null;
  onClose: () => void;
}

const TIKTOK_SPECS =
  '9:16 (vertical), até 60s, 1080×1920 px, MP4. Ideal para anúncios/vendas (9–15s).';
const SHOPEE_SPECS =
  '9:16 (obrigatório), 10–60s (20s ideal), até 30 MB, 720p/1080p, MP4.';

export function DownloadOptionsModal({ post, onClose }: DownloadOptionsModalProps): JSX.Element | null {
  const [converting, setConverting] = useState<PlatformPreset | null>(null);
  const [progressLog, setProgressLog] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!post) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !converting) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [post, converting, onClose]);

  if (!post) return null;

  const isVideo = Boolean(post.videoUrl);
  const downloadUrl = post.videoUrl ?? post.mediaUrl;
  const proxiedUrl = getProxiedMediaUrl(downloadUrl);
  const baseFilename = `instagram-${post.id}`;
  const filenameNormal = isVideo ? `${baseFilename}.mp4` : `${baseFilename}.jpg`;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !converting) onClose();
  };

  const handleNormal = () => {
    if (downloadUrl) downloadMedia(proxiedUrl, filenameNormal);
    onClose();
  };

  const runConversion = async (preset: PlatformPreset) => {
    if (!post.videoUrl) return;
    setConverting(preset);
    setError(null);
    setProgressLog('Carregando FFmpeg...\n');
    try {
      const blob = await convertVideoForPlatform(preset, proxiedUrl, (log) => {
        setProgressLog((prev) => prev + log + '\n');
      });
      const name = preset === 'tiktok' ? `${baseFilename}-tiktok.mp4` : `${baseFilename}-shopee.mp4`;
      downloadBlob(blob, name);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao converter vídeo.');
    } finally {
      setConverting(null);
    }
  };

  const handleTikTok = () => runConversion('tiktok');
  const handleShopee = () => runConversion('shopee');

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-options-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="download-options-title" className={styles.title}>
            Como deseja baixar?
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={!!converting}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {converting ? (
          <div className={styles.converting}>
            <p className={styles.convertingText}>
              Convertendo para {converting === 'tiktok' ? 'TikTok Shop' : 'Shopee'}…
            </p>
            <Spinner size="lg" />
            <pre className={styles.progressLog}>{progressLog || ' '}</pre>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          <div className={styles.content}>
            <p className={styles.question}>
              Escolha o tipo de download. Para TikTok Shop e Shopee, o vídeo será convertido automaticamente para o formato recomendado.
            </p>
            <div className={styles.options}>
              <button type="button" className={styles.optionBtn} onClick={handleNormal}>
                <span className={styles.optionLabel}>Download normal</span>
                <span className={styles.optionDesc}>
                  Baixar o arquivo original, sem alteração.
                </span>
              </button>
              {isVideo && (
                <>
                  <button type="button" className={styles.optionBtn} onClick={handleTikTok}>
                    <span className={styles.optionLabel}>TikTok Shop / Vídeos TikTok</span>
                    <span className={styles.optionDesc}>{TIKTOK_SPECS}</span>
                  </button>
                  <button type="button" className={styles.optionBtn} onClick={handleShopee}>
                    <span className={styles.optionLabel}>Shopee Vídeo</span>
                    <span className={styles.optionDesc}>{SHOPEE_SPECS}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
