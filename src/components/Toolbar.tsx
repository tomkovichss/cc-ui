import { useEffect, useRef, type ChangeEvent, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  /** Text shown in the keyboard-shortcut badge, e.g. "⌘K". Omit to hide the badge. */
  shortcutLabel?: string;
  /** Focuses the search input when Cmd/Ctrl + the shortcut key is pressed. */
  shortcutKey?: string;
  /** Right-side content — filter/sort controls, actions, etc. */
  children?: ReactNode;
}

export function Toolbar({
  searchValue,
  onSearchChange,
  placeholder = 'Search…',
  shortcutLabel = '⌘K',
  shortcutKey = 'k',
  children,
}: ToolbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcutKey]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <Search />
        </span>
        <input
          ref={searchRef}
          type="text"
          className={styles.search}
          placeholder={placeholder}
          autoComplete="off"
          value={searchValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
        />
        {shortcutLabel && (
          <span className={styles.searchShortcut} aria-hidden="true">
            {shortcutLabel}
          </span>
        )}
      </div>
      {children && <div className={styles.controls}>{children}</div>}
    </div>
  );
}
