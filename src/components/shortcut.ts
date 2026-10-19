import { useEffect } from 'react';

const isMac = () => typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform);

const KEY_SYMBOLS: Record<string, string> = { alt: '⌥', shift: '⇧', ctrl: 'Ctrl', enter: '↵', esc: 'Esc' };

export function parseShortcut(shortcut: string) {
  const mac = isMac();
  const parts = shortcut.toLowerCase().split('+').map((p) => p.trim());
  const key = parts[parts.length - 1];
  const mods = new Set(parts.slice(0, -1));
  const labels = [...mods].map((m) => (m === 'mod' ? (mac ? '⌘' : 'Ctrl') : (KEY_SYMBOLS[m] ?? m)));
  labels.push(KEY_SYMBOLS[key] ?? key.toUpperCase());
  return { key, mods, mac, labels };
}

/** Calls `handler` on the global keydown matching `shortcut` (e.g. `"mod+k"`), preventing the browser default. */
export function useShortcut(shortcut: string | undefined, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!shortcut || !enabled) return;
    const { key, mods, mac } = parseShortcut(shortcut);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key) return;
      const mod = mac ? e.metaKey : e.ctrlKey;
      if (
        mod !== (mods.has('mod') || (mac ? false : mods.has('ctrl'))) ||
        e.altKey !== mods.has('alt') ||
        e.shiftKey !== mods.has('shift')
      )
        return;
      e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcut, enabled]);
}
