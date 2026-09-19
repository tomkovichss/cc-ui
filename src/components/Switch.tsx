import type { ChangeEvent, ReactNode } from 'react';
import styles from './Switch.module.css';

type SwitchSize = 'sm' | 'base';

interface SwitchProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: SwitchSize;
  label?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  size = 'base',
  label,
  ariaLabel,
  disabled,
  className,
}: SwitchProps) {
  return (
    <label className={`${styles.switch} ${className ?? ''}`}>
      <span className={`${styles.control} ${styles[size]}`}>
        <input
          type="checkbox"
          role="switch"
          className={styles.input}
          checked={checked}
          onChange={onChange}
          aria-label={ariaLabel}
          disabled={disabled}
        />
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
}
