import {
  cloneElement,
  useEffect,
  useState,
  type PointerEvent,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './PhotoPreview.module.css';

interface PhotoPreviewProps {
  /** Photo URL. Missing, empty or broken: nothing is shown and the child renders untouched. */
  src?: string;
  /** Preview side length in px. */
  size?: number;
  /** A single element that accepts pointer handlers, e.g. a `<td>` or an `<img>`. */
  children: ReactElement<{
    onPointerEnter?: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (e: PointerEvent<HTMLElement>) => void;
  }>;
}

const SIZE = 180;
const OFFSET = 12;
const MARGIN = 8;

/** Top-left of the enlarged photo: beside the cursor, flipped to stay inside the viewport. */
function photoPreviewPosition(x: number, y: number, size = SIZE) {
  const fit = (point: number, limit: number) => {
    const after = point + OFFSET;
    const pos = after + size + MARGIN > limit ? point - OFFSET - size : after;
    return Math.max(MARGIN, pos);
  };
  return { left: fit(x, window.innerWidth), top: fit(y, window.innerHeight) };
}

/**
 * Enlarged photo next to the mouse cursor while the pointer is over the child.
 * Rendered in a portal with fixed positioning, so `overflow` on an ancestor never clips it.
 * Adds no wrapper element, so it is safe inside `<tr>`.
 */
export function PhotoPreview({ src, size = SIZE, children }: PhotoPreviewProps) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState<string>();

  // Fixed coordinates go stale on scroll or resize — just dismiss.
  const open = cursor !== null;
  useEffect(() => {
    if (!open) return;
    const hide = () => setCursor(null);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [open]);

  if (!src || failed === src) return children;

  const childProps = children.props;
  const track = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse') setCursor({ x: e.clientX, y: e.clientY });
  };

  const trigger = cloneElement(children, {
    onPointerEnter: (e) => {
      childProps.onPointerEnter?.(e);
      track(e);
    },
    onPointerMove: (e) => {
      childProps.onPointerMove?.(e);
      track(e);
    },
    onPointerLeave: (e) => {
      childProps.onPointerLeave?.(e);
      setCursor(null);
    },
  });

  return (
    <>
      {trigger}
      {cursor &&
        createPortal(
          <img
            className={styles.photoPreview}
            src={src}
            alt=""
            aria-hidden="true"
            style={{ width: size, height: size, ...photoPreviewPosition(cursor.x, cursor.y, size) }}
            onError={() => {
              setFailed(src);
              setCursor(null);
            }}
          />,
          document.body,
        )}
    </>
  );
}
