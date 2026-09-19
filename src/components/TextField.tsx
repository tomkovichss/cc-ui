import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './TextField.module.css';

type TextFieldSize = 'sm' | 'base';
type TextFieldVariant = 'default' | 'toolbar';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: TextFieldSize;
  variant?: TextFieldVariant;
  leadingIcon?: ReactNode;
}

export function TextField({
  label,
  helperText,
  error,
  size = 'base',
  variant = 'default',
  leadingIcon,
  id,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        className={`${styles.inputWrap} ${styles[variant]} ${styles[size]} ${error ? styles.errorWrap : ''}`}
      >
        {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
        <input id={inputId} className={styles.input} {...rest} />
      </div>
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
