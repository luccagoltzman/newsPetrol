import { useEffect, useRef } from 'react';
import type { InstagramPost } from '@/types/instagram.types';
import { getProxiedMediaUrl } from '@/utils/proxyMedia';
import styles from './MediaViewer.module.css';

export interface MediaViewerProps {
  post: InstagramPost | null;
  onClose: () => void;
  onDownloadClick?: (post: InstagramPost) => void;
}

export function MediaViewer({ post, onClose, onDownloadClick }: MediaViewerProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!post) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [post, onClose]);

  useEffect(() => {
    if (post && containerRef.current) {
      containerRef.current.focus();
    }
  }, [post]);

  if (!post) return null;

  const isVideo = Boolean(post.videoUrl);
  const downloadUrl = post.videoUrl ?? post.mediaUrl;
  const displayImageUrl = getProxiedMediaUrl(post.mediaUrl);
  const displayVideoUrl = post.videoUrl ? getProxiedMediaUrl(post.videoUrl) : '';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadClick?.(post);
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-viewer-title"
      tabIndex={-1}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="media-viewer-title" className={styles.title}>
            {isVideo ? 'Vídeo' : 'Publicação'}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar (Esc)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {isVideo ? (
            <div className={styles.videoWrapper}>
              <video
                className={styles.video}
                src={displayVideoUrl}
                poster={displayImageUrl}
                controls
                autoPlay
                playsInline
                preload="auto"
                aria-label="Player de vídeo da publicação"
              >
                Seu navegador não suporta vídeo.
              </video>
            </div>
          ) : (
            <img
              src={displayImageUrl}
              alt=""
              className={styles.image}
            />
          )}
        </div>

        {(post.caption || downloadUrl) && (
          <div className={styles.footer}>
            {post.caption && (
              <p className={styles.caption}>{post.caption}</p>
            )}
            <div className={styles.actions}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
              >
                Abrir no Instagram
              </a>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={handleDownload}
              >
                Baixar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
