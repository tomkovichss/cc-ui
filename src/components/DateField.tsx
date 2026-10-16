import { useId, useRef, type InputHTMLAttributes, type Ref } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './TextField.module.css';
import { FieldLabel } from './FieldLabel';

type DateFieldSize = 'sm' | 'base';

interface DateFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: DateFieldSize;
  /** Accessible name of the button next to the date. */
  openLabel?: string;
  /** Extra classes for layout around the field. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Shows a picked date and opens a calendar on click. It renders no calendar
 * itself: pass it as the input of a date picker (e.g. react-datepicker's
 * `customInput`), which supplies `value`, `onClick` and `ref`.
 */
export function DateField({
  label,
  helperText,
  error,
  size = 'base',
  openLabel = 'Open calendar',
  id,
  className,
  ref,
  onClick,
  disabled,
  ...rest
}: DateFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);

  function setRefs(el: HTMLInputElement | null) {
    inputRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  }

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className={`${styles.inputWrap} ${styles.default} ${styles[size]} ${error ? styles.errorWrap : ''}`}>
        <input
          {...rest}
          ref={setRefs}
          id={inputId}
          className={`${styles.input} ${styles.pickerInput}`}
          inputMode="none"
          readOnly
          disabled={disabled}
          onClick={onClick}
        />
        <button
          type="button"
          tabIndex={-1}
          className={styles.trailing}
          aria-label={openLabel}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <ChevronDown />
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
