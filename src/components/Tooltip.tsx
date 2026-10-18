import {
  cloneElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.css';

type TooltipSide = 'top' | 'bottom';

interface TooltipProps {
  /** Tooltip text. When empty, the child renders untouched. */
  content: ReactNode;
  /** Preferred side. Flips to the other side when it would be clipped by the viewport. */
  side?: TooltipSide;
  /** Hover delay in ms before the tooltip appears. Keyboard focus shows it immediately. */
  delay?: number;
  /** A single element that accepts a `ref` and pointer/focus handlers, e.g. a button. */
  children: ReactElement<{
    ref?: Ref<HTMLElement>;
    onPointerEnter?: (e: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (e: PointerEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
  }>;
}

const GAP = 8;
const VIEWPORT_PADDING = 8;

/**
 * Tooltip rendered in a portal with fixed positioning, so it is never clipped by
 * `overflow` on an ancestor. It flips to the opposite side and shifts horizontally
 * to stay inside the viewport.
 */
export function Tooltip({ content, side = 'bottom', delay = 400, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; side: TooltipSide } | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);

  const childProps = children.props;
  const childRef = childProps.ref;

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      anchorRef.current = node;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef) (childRef as { current: HTMLElement | null }).current = node;
    },
    [childRef],
  );

  const show = (immediate: boolean) => {
    window.clearTimeout(timer.current);
    if (immediate) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
    setPos(null);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !tipRef.current) return;
    const a = anchorRef.current.getBoundingClientRect();
    const tip = tipRef.current;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const fitsBelow = a.bottom + GAP + h + VIEWPORT_PADDING <= window.innerHeight;
    const fitsAbove = a.top - GAP - h - VIEWPORT_PADDING >= 0;
    let resolved = side;
    if (side === 'bottom' && !fitsBelow && fitsAbove) resolved = 'top';
    if (side === 'top' && !fitsAbove && fitsBelow) resolved = 'bottom';
    const top = resolved === 'bottom' ? a.bottom + GAP : a.top - GAP - h;
    const centered = a.left + a.width / 2 - w / 2;
    const left = Math.max(
      VIEWPORT_PADDING,
      Math.min(centered, window.innerWidth - w - VIEWPORT_PADDING),
    );
    setPos({ left, top, side: resolved });
  }, [open, side, content]);

  // Fixed coordinates go stale on scroll or resize — just dismiss.
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [open]);

  if (content === undefined || content === null || content === '') return children;

  const trigger = cloneElement(children, {
    ref: setRefs,
    onPointerEnter: (e) => {
      childProps.onPointerEnter?.(e);
      if (e.pointerType === 'mouse') show(false);
    },
    onPointerLeave: (e) => {
      childProps.onPointerLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      childProps.onFocus?.(e);
      if (e.currentTarget.matches(':focus-visible')) show(true);
    },
    onBlur: (e) => {
      childProps.onBlur?.(e);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            className={`${styles.tooltip} ${pos?.side === 'top' ? styles.top : styles.bottom}`}
            style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: 'hidden' }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
