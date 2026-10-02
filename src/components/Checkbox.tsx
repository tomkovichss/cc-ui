import type { ChangeEvent, ReactNode } from 'react';
import styles from './Checkbox.module.css';
import groupStyles from './OptionGroup.module.css';
import { FieldLabel } from './FieldLabel';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, ariaLabel, className }: CheckboxProps) {
  return (
    <label className={`${styles.checkbox} ${className ?? ''}`}>
      <span className={styles.control}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={onChange}
          aria-label={ariaLabel}
        />
        <span className={styles.box}>
          <svg className={styles.icon} viewBox="0 0 17 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </span>
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
}

interface CheckboxGroupItem {
  value: string;
  label: ReactNode;
}

interface CheckboxGroupProps {
  label?: ReactNode;
  items: CheckboxGroupItem[];
  value: string[];
  onChange: (value: string[]) => void;
  'aria-label'?: string;
}

export function CheckboxGroup({ label, items, value, onChange, ...rest }: CheckboxGroupProps) {
  function toggle(itemValue: string) {
    const next = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];
    onChange(next);
  }

  return (
    <div role="group" aria-label={label ? undefined : rest['aria-label']} className={groupStyles.group}>
      {label && <FieldLabel className={groupStyles.groupLabel}>{label}</FieldLabel>}
      {items.map((item) => (
        <Checkbox
          key={item.value}
          checked={value.includes(item.value)}
          onChange={() => toggle(item.value)}
          label={item.label}
        />
      ))}
    </div>
  );
}
