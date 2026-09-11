import type { ChangeEvent } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, ariaLabel, className }: CheckboxProps) {
  return (
    <label className={`${styles.checkbox} ${className ?? ''}`}>
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
    </label>
  );
}
