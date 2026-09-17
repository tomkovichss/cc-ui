import type { KeyboardEvent, ReactNode } from 'react';
import styles from './Tabs.module.css';

type TabsVariant = 'line' | 'box';
type TabsSize = 'base' | 'sm';

interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  'aria-label'?: string;
}

export function Tabs({ items, value, onChange, variant = 'line', size = 'base', ...rest }: TabsProps) {
  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = enabledValues.indexOf(value);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabledValues.length;
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledValues.length) % enabledValues.length;
    }
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = enabledValues.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      onChange(enabledValues[nextIndex]);
    }
  }

  return (
    <div
      role="tablist"
      className={[styles[variant], variant === 'box' && size === 'sm' && styles.sm]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={item.disabled}
            tabIndex={selected ? 0 : -1}
            className={[styles.tab, selected && styles.selected].filter(Boolean).join(' ')}
            onClick={() => !item.disabled && onChange(item.value)}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
