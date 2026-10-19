import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './ToolbarAdaptive.module.css';

export type ToolbarAdaptiveState = 'top' | 'floating';

const SCROLL_THRESHOLD = 16;

interface ToolbarAdaptiveProps {
  /** Left group: period selector, links, tabs. */
  left?: ReactNode;
  /** Right group: view toggle, print, settings. */
  right?: ReactNode;
  /** Free layout; replaces `left` / `right` when given. */
  children?: ReactNode;
  /**
   * Scroll container to watch. Omit to use the nearest scrollable ancestor (falling back to the
   * window); pass `null` to force the window.
   */
  scrollRoot?: HTMLElement | null;
  /** Scroll distance in px that triggers the floating state. */
  threshold?: number;
  /** Called when the state changes. */
  onStateChange?: (state: ToolbarAdaptiveState) => void;
  /** Applied to the inner card. */
  className?: string;
  'data-testid'?: string;
}

/** First ancestor with `overflow-y: auto | scroll`, or `null` for the viewport. */
function findScrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

export function ToolbarAdaptive({
  left,
  right,
  children,
  scrollRoot,
  threshold = SCROLL_THRESHOLD,
  onStateChange,
  className,
  'data-testid': testId = 'header',
}: ToolbarAdaptiveProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ToolbarAdaptiveState>('top');
  // Stays false until the first observer correction has painted, so a restored scroll position
  // snaps to `floating` instead of animating on mount.
  const [animated, setAnimated] = useState(false);

  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  });
  const lastEmitted = useRef<ToolbarAdaptiveState>('top');

  useEffect(() => {
    if (lastEmitted.current === state) return;
    lastEmitted.current = state;
    onStateChangeRef.current?.(state);
  }, [state]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    let observer: IntersectionObserver | undefined;
    let currentRoot: HTMLElement | null | undefined;
    let firstCallback = true;
    let raf = 0;

    const connect = () => {
      const root = scrollRoot !== undefined ? scrollRoot : findScrollParent(sentinel);
      if (observer && root === currentRoot) return;
      observer?.disconnect();
      currentRoot = root;
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          setState(entry.isIntersecting ? 'top' : 'floating');
          if (firstCallback) {
            firstCallback = false;
            raf = requestAnimationFrame(() => setAnimated(true));
          }
        },
        { root },
      );
      observer.observe(sentinel);
    };

    connect();
    // The scrolling element changes at the app's layout breakpoint (inner scroller vs window).
    window.addEventListener('resize', connect);
    return () => {
      window.removeEventListener('resize', connect);
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [scrollRoot, threshold]);

  const cardClass = [styles.card, animated ? styles.animated : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={styles.anchor} aria-hidden="true">
        <div ref={sentinelRef} className={styles.sentinel} style={{ top: threshold }} />
      </div>
      <header className={styles.header} data-testid={testId}>
        <div className={cardClass} data-state={state}>
          {children ?? (
            <>
              {left && <div className={styles.left}>{left}</div>}
              {right && <div className={styles.right}>{right}</div>}
            </>
          )}
        </div>
      </header>
    </>
  );
}
