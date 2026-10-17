import type { ReactNode } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  /** Top row: logo + farm selector. */
  header: ReactNode;
  /** Optional block under the header, e.g. Milk Barn / Calf Barn tabs. */
  switcher?: ReactNode;
  /** Navigation: a `NavList` with `NavItem`s. */
  children: ReactNode;
  /** Bottom block, pinned. Use `SidebarFooter` or any node. */
  footer?: ReactNode;
  /**
   * `inset` (default): the switcher sits inside the 16px padding, e.g. box tabs.
   * `flush`: the switcher spans the full width under the header with a divider, e.g. line tabs.
   */
  switcherLayout?: 'inset' | 'flush';
  /** Accessible name of the `<nav>`. */
  'aria-label'?: string;
  /** Layout around the sidebar, e.g. a fixed width. */
  className?: string;
}

/** Presentational app-shell sidebar. Fills its container; the app sets the width (280px in the design). */
export function Sidebar({
  header,
  switcher,
  children,
  footer,
  switcherLayout = 'inset',
  'aria-label': ariaLabel,
  className,
}: SidebarProps) {
  return (
    <aside className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={[styles.top, switcherLayout === 'flush' && styles.flush].filter(Boolean).join(' ')}>
        <div className={styles.header}>{header}</div>
        {switcher && <div className={styles.switcher}>{switcher}</div>}
      </div>
      <nav aria-label={ariaLabel} className={styles.nav}>
        {children}
      </nav>
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}

interface SidebarFooterProps {
  /** Primary line, usually the user's email. Truncates with an ellipsis. */
  title: ReactNode;
  /** Secondary line, e.g. a `LanguageSwitch`. */
  subtitle?: ReactNode;
  /** Right-hand slot, e.g. a menu trigger button. */
  action?: ReactNode;
}

export function SidebarFooter({ title, subtitle, action }: SidebarFooterProps) {
  return (
    <div className={styles.footerRow}>
      <div className={styles.footerText}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

interface LanguageSwitchItem {
  value: string;
  label: string;
  /** BCP 47 tag set as `lang` on the label, e.g. `es`. */
  lang?: string;
}

interface LanguageSwitchProps {
  items: LanguageSwitchItem[];
  value: string;
  onChange: (value: string) => void;
  'aria-label'?: string;
}

/** Text-only language toggle: `English | Español`. The current language is plain text, the others are buttons. */
export function LanguageSwitch({ items, value, onChange, 'aria-label': ariaLabel }: LanguageSwitchProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={styles.lang}>
      {items.map((item, index) => (
        <span key={item.value} className={styles.langItem}>
          {index > 0 && (
            <span aria-hidden className={styles.langSeparator}>
              |
            </span>
          )}
          {item.value === value ? (
            <span lang={item.lang} aria-current="true" className={styles.langCurrent}>
              {item.label}
            </span>
          ) : (
            <button
              type="button"
              lang={item.lang}
              className={styles.langButton}
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
