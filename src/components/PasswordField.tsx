import { useId, useState, type InputHTMLAttributes, type Ref } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './TextField.module.css';
import { FieldLabel } from './FieldLabel';

type PasswordFieldSize = 'sm' | 'base';

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size' | 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: PasswordFieldSize;
  /** Accessible name of the toggle while the value is hidden. */
  showLabel?: string;
  /** Accessible name of the toggle while the value is shown. */
  hideLabel?: string;
  /** Start with the value shown. */
  defaultVisible?: boolean;
  /** Extra classes for layout around the field. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/** A text field for passwords and PINs, with a button that shows or hides what was typed. */
export function PasswordField({
  label,
  helperText,
  error,
  size = 'base',
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  defaultVisible = false,
  id,
  className,
  ref,
  disabled,
  ...rest
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className={`${styles.inputWrap} ${styles.default} ${styles[size]} ${error ? styles.errorWrap : ''}`}>
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          type={visible ? 'text' : 'password'}
          autoComplete="off"
          disabled={disabled}
          {...rest}
        />
        <button
          type="button"
          className={styles.trailing}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          aria-controls={inputId}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
