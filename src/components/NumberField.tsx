import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './NumberField.module.css';
import { FieldLabel } from './FieldLabel';

type NumberFieldSize = 'sm' | 'base';

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size' | 'prefix'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: NumberFieldSize;
  /** Rendered inline before the value, e.g. "$". */
  prefix?: ReactNode;
  /** Rendered inline after the value, e.g. "cows", "/cwt". */
  suffix?: ReactNode;
}

export function NumberField({
  label,
  helperText,
  error,
  size = 'base',
  prefix,
  suffix,
  id,
  ...rest
}: NumberFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={styles.field}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className={`${styles.inputWrap} ${styles[size]} ${error ? styles.errorWrap : ''}`}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input id={inputId} className={styles.input} {...rest} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
