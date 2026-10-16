import { useId, type ReactNode } from 'react';
import { Tabs, type TabItem } from './Tabs';
import styles from './Toggle.module.css';

interface ToggleProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  label?: ReactNode;
  'aria-label'?: string;
}

export function Toggle({ items, value, onChange, label, 'aria-label': ariaLabel }: ToggleProps) {
  const labelId = useId();

  return (
    <div className={styles.root}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <Tabs
        items={items}
        value={value}
        onChange={onChange}
        variant="box"
        size="sm"
        aria-label={ariaLabel}
        aria-labelledby={label && !ariaLabel ? labelId : undefined}
      />
    </div>
  );
}
