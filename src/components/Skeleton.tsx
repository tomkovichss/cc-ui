import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

type SkeletonVariant = 'rect' | 'text' | 'circle';

/**
 * Decorative placeholder shown instead of a spinner while content loads.
 * It is `aria-hidden`: mark the loading region with `aria-busy="true"` (and, if needed,
 * a visually hidden `role="status"` text) in the consumer, not here.
 */
interface SkeletonProps {
  /** `rect` (default) is a block, `text` is a 14px-high line with a small radius, `circle` is round. */
  variant?: SkeletonVariant;
  /** Number = px, string = any CSS length. Defaults to the parent's full width (40px for `circle`). */
  width?: number | string;
  /** Number = px, string = any CSS length. Defaults: `rect` 16px, `text` 14px, `circle` 40px. */
  height?: number | string;
  /** `circle` only: shorthand for width = height. */
  size?: number | string;
  /** Turn the pulse off, e.g. for a screenshot or when many blocks are on screen. */
  animated?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  size,
  animated = true,
  className,
  'data-testid': dataTestId,
}: SkeletonProps) {
  const classes = [styles.skeleton, styles[variant], animated && styles.animated, className]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = {};
  if (variant === 'circle' && size !== undefined) {
    style.width = size;
    style.height = size;
  }
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return <div aria-hidden="true" className={classes} style={style} data-testid={dataTestId} />;
}
