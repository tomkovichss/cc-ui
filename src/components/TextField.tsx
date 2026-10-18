import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import styles from './TextField.module.css';
import { FieldLabel } from './FieldLabel';

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

const isMac = () => typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform);

const KEY_SYMBOLS: Record<string, string> = { alt: '⌥', shift: '⇧', ctrl: 'Ctrl', enter: '↵', esc: 'Esc' };

function parseShortcut(shortcut: string) {
  const mac = isMac();
  const parts = shortcut.toLowerCase().split('+').map((p) => p.trim());
  const key = parts[parts.length - 1];
  const mods = new Set(parts.slice(0, -1));
  const labels = [...mods].map((m) => (m === 'mod' ? (mac ? '⌘' : 'Ctrl') : (KEY_SYMBOLS[m] ?? m)));
  labels.push(KEY_SYMBOLS[key] ?? key.toUpperCase());
  return { key, mods, mac, labels };
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

  useEffect(() => {
    if (!shortcut) return;
    const { key, mods, mac } = parseShortcut(shortcut);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key) return;
      const mod = mac ? e.metaKey : e.ctrlKey;
      if (
        mod !== (mods.has('mod') || (mac ? false : mods.has('ctrl'))) ||
        e.altKey !== mods.has('alt') ||
        e.shiftKey !== mods.has('shift')
      )
        return;
      e.preventDefault();
      innerRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut]);

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
