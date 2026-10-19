import { useId, useRef, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import styles from './TextField.module.css';
import { FieldLabel } from './FieldLabel';
import { parseShortcut, useShortcut } from './shortcut';

type TextFieldSize = 'sm' | 'base';
type TextFieldVariant = 'default' | 'toolbar';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: TextFieldSize;
  variant?: TextFieldVariant;
  leadingIcon?: ReactNode;
  /**
   * Global keyboard shortcut that focuses the field, e.g. `"mod+k"`. `mod` is ⌘ on Mac and Ctrl elsewhere.
   * The keys are shown as hints at the right edge of the field.
   */
  shortcut?: string;
  /** Extra classes for layout around the field — width, flex growth. Appended after its own class. */
  className?: string;
  /** Reaches the <input>, e.g. for a form library to focus a field that failed validation. */
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  helperText,
  error,
  size = 'base',
  variant = 'default',
  leadingIcon,
  shortcut,
  id,
  className,
  ref,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const innerRef = useRef<HTMLInputElement | null>(null);

  useShortcut(shortcut, () => innerRef.current?.focus());

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div
        className={`${styles.inputWrap} ${styles[variant]} ${styles[size]} ${error ? styles.errorWrap : ''}`}
      >
        {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
        <input ref={setRefs} id={inputId} className={styles.input} {...rest} />
        {shortcut && (
          <span className={styles.shortcut} aria-hidden="true">
            {parseShortcut(shortcut).labels.map((k) => (
              <kbd key={k} className={styles.kbd}>
                {k}
              </kbd>
            ))}
          </span>
        )}
      </div>
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
