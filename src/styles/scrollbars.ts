/*
 * Reveals the thin scrollbar thumb while a container is scrolling (CSS alone can't detect
 * scrolling): marks the scrolled element with `data-scrolling` until it has been idle for a moment.
 * Pairs with scrollbars.css.
 */
const IDLE_MS = 800;

if (typeof document !== 'undefined') {
  const timers = new WeakMap<Element, number>();

  document.addEventListener(
    'scroll',
    (e) => {
      const target = e.target;
      const el =
        target instanceof Element
          ? target
          : target === document
            ? document.documentElement
            : null;
      if (!el) return;
      el.setAttribute('data-scrolling', '');
      window.clearTimeout(timers.get(el));
      timers.set(
        el,
        window.setTimeout(() => el.removeAttribute('data-scrolling'), IDLE_MS),
      );
    },
    { capture: true, passive: true },
  );
}
