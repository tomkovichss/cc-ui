import { Archive, Lock, Play, User } from 'lucide-react';
import { useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { PhotoPreview } from './PhotoPreview';
import { Skeleton } from './Skeleton';
import styles from './VideoCard.module.css';

interface VideoCardLabels {
  worker: string;
  comment: string;
  pending: string;
  inaccessible: string;
  archived: string;
  new: string;
}

const DEFAULT_LABELS: VideoCardLabels = {
  worker: 'Worker:',
  comment: 'Comment:',
  pending: 'Card still in progress',
  inaccessible: 'Inaccessible',
  archived: 'Archived',
  new: 'New',
};

interface VideoCardWorker {
  name: string;
  /** Photo URL. Missing or broken -> empty avatar and the `pending` line. */
  photo?: string;
  /** Show the `pending` line even when the photo loads. */
  pending?: boolean;
}

/**
 * One row of a video list. Presentational: dates, translations and the choice
 * between "inaccessible" and "archived" are decided by the app and passed in.
 */
interface VideoCardProps {
  /** Thumbnail URL. */
  preview?: string;
  /** Tile shown when `preview` is missing or fails to load: a lock + caption, an archive + caption, or a bare play icon. */
  previewFallback?: 'inaccessible' | 'archived' | 'play';
  /** Called once when the thumbnail fails, e.g. to log it. */
  onPreviewError?: () => void;
  /** Alt text of the thumbnail. Defaults to "Video preview: {comment}". */
  previewAlt?: string;
  /** Already formatted, e.g. "Oct 09, 12:32AM". */
  dateTime?: string;
  /** Category. */
  title?: ReactNode;
  /** Note under the title, clamped to two lines. */
  description?: ReactNode;
  /** Extra lines under the description, e.g. a severity line. */
  meta?: ReactNode;
  worker?: VideoCardWorker;
  /** One line, truncated with an ellipsis. */
  comment?: string;
  /** Seen before. Unset counts as not viewed and shows the "New" badge. */
  viewed?: boolean;
  /** Last opened video: blue ring. */
  current?: boolean;
  /** Makes the whole row a button with the hover ring. Omit when the row sits inside a link. */
  onClick?: () => void;
  /** Hover / press feedback without making the row a button. For rows inside a link, which owns navigation and focus. Implied by `onClick`. */
  hoverable?: boolean;
  /** Trailing slot, e.g. a bookmark button. It must stop click propagation itself. */
  actions?: ReactNode;
  /** Visible strings, for translation. Missing keys fall back to English. */
  labels?: Partial<VideoCardLabels>;
  'aria-label'?: string;
  className?: string;
  'data-testid'?: string;
}

function VideoCardRoot({
  preview,
  previewFallback = 'inaccessible',
  onPreviewError,
  previewAlt,
  dateTime,
  title,
  description,
  meta,
  worker,
  comment,
  viewed = false,
  current,
  onClick,
  hoverable,
  actions,
  labels,
  'aria-label': ariaLabel,
  className,
  'data-testid': dataTestId,
}: VideoCardProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [failedPreview, setFailedPreview] = useState<string>();
  const [failedPhoto, setFailedPhoto] = useState<string>();

  const showPreview = !!preview && failedPreview !== preview;
  const photo = worker?.photo;
  const showPhoto = !!photo && failedPhoto !== photo;
  const pending = !!worker && (worker.pending || !showPhoto);

  const interactive = !!onClick;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter') {
      onClick?.();
    } else if (e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const rootClass = [
    styles.root,
    (interactive || hoverable) && styles.interactive,
    current && styles.current,
    actions != null && styles.hasActions,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const interactiveProps = interactive
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': ariaLabel ?? (comment ? `Video ${comment}` : 'Video'),
        onClick,
        onKeyDown: handleKeyDown,
      }
    : { 'aria-label': ariaLabel };

  return (
    <div className={rootClass} data-testid={dataTestId} {...interactiveProps}>
      <div className={styles.side}>
        <div className={styles.thumb}>
          {showPreview ? (
            <img
              className={styles.thumbImg}
              src={preview}
              alt={previewAlt ?? (comment ? `Video preview: ${comment}` : 'Video preview')}
              loading="lazy"
              decoding="async"
              onError={() => {
                setFailedPreview(preview);
                onPreviewError?.();
              }}
            />
          ) : (
            <div className={`${styles.tile} ${previewFallback === 'play' ? styles.tilePlay : ''}`}>
              {previewFallback === 'play' ? (
                <Play size={20} aria-hidden="true" />
              ) : (
                <>
                  {/* `icon` class: host apps with a global `svg` size rule skip `_icon_` wrappers */}
                  <span className={styles.icon}>
                    {previewFallback === 'archived' ? (
                      <Archive size={12} strokeWidth={1} aria-hidden="true" />
                    ) : (
                      <Lock size={12} strokeWidth={1} aria-hidden="true" />
                    )}
                  </span>
                  <span>{previewFallback === 'archived' ? text.archived : text.inaccessible}</span>
                </>
              )}
            </div>
          )}
        </div>
        {!viewed && <span className={styles.badge}>{text.new}</span>}
      </div>

      <div className={styles.main}>
        <div className={styles.info}>
          {dateTime != null && <div className={styles.date}>{dateTime}</div>}
          {title != null && <div className={styles.title}>{title}</div>}
          {description != null && <div className={styles.description}>{description}</div>}
          {meta != null && <div className={styles.meta}>{meta}</div>}
        </div>

        {(worker || comment) && (
          <div className={styles.aside}>
            {worker && (
              <div className={styles.worker}>
                <div className={styles.label}>{text.worker}</div>
                <div className={styles.workerRow}>
                  {showPhoto ? (
                    <PhotoPreview src={photo}>
                      <img
                        className={styles.photo}
                        src={photo}
                        alt={`Photo of ${worker.name}`}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailedPhoto(photo)}
                      />
                    </PhotoPreview>
                  ) : (
                    <div className={`${styles.photo} ${styles.emptyPhoto}`} aria-hidden="true">
                      <User size={20} />
                    </div>
                  )}
                  <div className={styles.workerText}>
                    <div className={styles.workerName}>{worker.name}</div>
                    {pending && <div className={styles.pending}>{text.pending}</div>}
                  </div>
                </div>
              </div>
            )}
            {comment && (
              <div className={styles.comment} title={comment}>
                <span className={styles.srOnly}>{text.comment} </span>
                {comment}
              </div>
            )}
          </div>
        )}
      </div>

      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

/** Loading placeholder with the same footprint as a row. */
function VideoCardSkeleton({
  className,
  'data-testid': dataTestId,
}: Pick<VideoCardProps, 'className' | 'data-testid'>) {
  return (
    <div className={`${styles.root} ${className ?? ''}`} data-testid={dataTestId} aria-hidden="true">
      <div className={styles.side}>
        <Skeleton width={72} height={48} />
      </div>
      <div className={styles.main}>
        <div className={styles.info}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="65%" />
          <Skeleton variant="text" width="90%" />
        </div>
      </div>
    </div>
  );
}

export const VideoCard = Object.assign(VideoCardRoot, { Skeleton: VideoCardSkeleton });
