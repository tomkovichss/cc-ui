import type { ChangeEvent } from 'react';
import styles from './RadioButton.module.css';

interface RadioButtonProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
}

export function RadioButton({ checked, onChange, name, value, ariaLabel, className }: RadioButtonProps) {
  return (
    <label className={`${styles.radio} ${className ?? ''}`}>
      <input
        type="radio"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        aria-label={ariaLabel}
      />
      <span className={styles.circle}>
        <span className={styles.dot} />
      </span>
    </label>
  );
}
