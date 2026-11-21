import type { ReactNode } from 'react';
import { Toggle } from './Toggle';
import styles from './Sidebar.module.css';

interface SidebarProps {
  /** Top row: logo + farm selector. */
  header: ReactNode;
  /**
   * Optional block under the header. Two barns: box `Tabs` (`size="sm"`).
   * Three or more: a `Dropdown` (`variant="field"`, `size="sm"`), which gets the same grey track as the tabs.
   */
  switcher?: ReactNode;
  /** Navigation: a `NavList` with `NavItem`s. */
  children: ReactNode;
  /** Bottom block, pinned. Use `SidebarFooter` or any node. */
  footer?: ReactNode;
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
  'aria-label': ariaLabel,
  className,
}: SidebarProps) {
  return (
    <aside className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.top}>
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
  /** Second row, left: e.g. a `LanguageSwitch`. */
  subtitle?: ReactNode;
  /** Second row, right, centered on the subtitle: e.g. a menu trigger `Button` with `size="sm"`. */
  action?: ReactNode;
}

export function SidebarFooter({ title, subtitle, action }: SidebarFooterProps) {
  return (
    <div className={styles.footerRow}>
      <div className={styles.title}>{title}</div>
      {(subtitle || action) && (
        <div className={styles.footerControls}>
          <div className={styles.subtitle}>{subtitle}</div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
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

/** Segmented language toggle (`Toggle`): `[English | Español]`. */
export function LanguageSwitch({ items, value, onChange, 'aria-label': ariaLabel }: LanguageSwitchProps) {
  return (
    <Toggle
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      items={items.map((item) => ({
        value: item.value,
        label: <span lang={item.lang}>{item.label}</span>,
      }))}
    />
  );
}
