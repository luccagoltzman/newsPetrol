import type { HTMLAttributes } from 'react';
import type { InstagramPost } from '@/types/instagram.types';
import { downloadMedia } from '@/utils/download';
import styles from './PostCard.module.css';

export interface PostCardProps extends HTMLAttributes<HTMLDivElement> {
  post: InstagramPost;
}

export function PostCard({ post, className = '', ...rest }: PostCardProps): JSX.Element {
  const thumbUrl = post.mediaUrl;
  const isVideo = Boolean(post.videoUrl);
  const downloadUrl = post.videoUrl ?? post.mediaUrl;
  const downloadFilename = `instagram-${post.id}`;

  const handleDownload = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (downloadUrl) downloadMedia(downloadUrl, downloadFilename);
  };

  return (
    <div className={`${styles.card} ${className}`.trim()} {...rest}>
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <div className={styles.media}>
          {thumbUrl && (
            <img
              src={thumbUrl}
              alt=""
              className={styles.thumbnail}
              loading="lazy"
            />
          )}
          {isVideo && <span className={styles.badge}>Vídeo</span>}
        </div>
        {post.caption && (
          <p className={styles.caption}>{post.caption}</p>
        )}
      </a>
      {downloadUrl && (
        <button
          type="button"
          className={styles.downloadBtn}
          onClick={handleDownload}
          title="Baixar mídia"
          aria-label="Baixar mídia"
        >
          Download
        </button>
      )}
    </div>
  );
}
