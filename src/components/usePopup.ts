import { useEffect, useLayoutEffect, useCallback, type RefObject } from 'react';

/** Keep in sync with the bottom-sheet breakpoint in the popup's CSS module. */
export const SHEET_QUERY = '(max-width: 480px)';
const GAP = 4;
const VIEWPORT_MARGIN = 8;

interface UsePopupOptions {
  isOpen: boolean;
  popupRef: RefObject<HTMLElement | null>;
  /** The element the popup attaches to (and whose clicks do not count as "outside"). */
  getAnchor: () => HTMLElement | null | undefined;
  placement: 'bottom-start' | 'bottom-end';
  /** Called on Escape (`restoreFocus: true`) and on a pointer press outside (`false`). */
  onClose: (restoreFocus: boolean) => void;
  /** Change this when the popup's size changes while open, so it is positioned again. */
  layoutKey?: unknown;
}

/**
 * Positioning, dismissal and Tab focus trap for a popup portalled to <body>.
 * On phones (see SHEET_QUERY) CSS docks the popup to the bottom, so no position is set.
 */
export function usePopup({ isOpen, popupRef, getAnchor, placement, onClose, layoutKey }: UsePopupOptions) {
  const reposition = useCallback(() => {
    const popup = popupRef.current;
    const anchor = getAnchor();
    if (!popup || !anchor) return;
    if (window.matchMedia(SHEET_QUERY).matches) {
      popup.style.left = '';
      popup.style.top = '';
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;

    let left = placement === 'bottom-end' ? rect.right - width : rect.left;
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, viewportWidth - width - VIEWPORT_MARGIN));

    let top = rect.bottom + GAP;
    const fitsBelow = top + height <= viewportHeight - VIEWPORT_MARGIN;
    const roomAbove = rect.top - GAP - height >= VIEWPORT_MARGIN;
    const flipped = !fitsBelow && roomAbove;
    if (flipped) top = rect.top - GAP - height;
    popup.dataset.flipped = String(flipped);
    popup.dataset.align = placement === 'bottom-end' ? 'end' : 'start';

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }, [getAnchor, placement, popupRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isOpen, reposition, layoutKey]);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (popupRef.current?.contains(target) || getAnchor()?.contains(target)) return;
      onClose(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose(true);
        return;
      }
      if (e.key !== 'Tab') return;
      const popup = popupRef.current;
      if (!popup) return;
      const stops = Array.from(
        popup.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"])'),
      );
      if (stops.length === 0) {
        e.preventDefault();
        return;
      }
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (!popup.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, getAnchor, onClose, popupRef]);
}
