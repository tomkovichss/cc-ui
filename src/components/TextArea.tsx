import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import styles from './TextArea.module.css';
import { FieldLabel } from './FieldLabel';

type TextAreaSize = 'sm' | 'base';

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: TextAreaSize;
  /** Manual resize handle. Ignored (forced to 'none') when `autoResize` is on. */
  resize?: 'none' | 'vertical';
  /** The field grows as the text grows. */
  autoResize?: boolean;
  /** Growth ceiling for `autoResize`, in rows. Past it the field scrolls internally. */
  maxRows?: number;
  /** Shows a character counter under the field, on the right. */
  showCount?: boolean;
  /** Extra classes for layout around the field — width, flex growth. Appended after its own class. */
  className?: string;
  /** Reaches the <textarea>, e.g. for a form library to focus a field that failed validation. */
  ref?: Ref<HTMLTextAreaElement>;
}

function setRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

export function TextArea({
  label,
  helperText,
  error,
  size = 'base',
  resize = 'vertical',
  autoResize = false,
  maxRows = 8,
  showCount = false,
  id,
  className,
  ref,
  rows = 3,
  value,
  defaultValue,
  maxLength,
  disabled,
  readOnly,
  onChange,
  onInput,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const isControlled = value !== undefined;
  const [uncontrolledLength, setUncontrolledLength] = useState(() =>
    String(defaultValue ?? '').length,
  );
  const length = isControlled ? String(value).length : uncontrolledLength;

  const fit = useCallback(() => {
    const el = textRef.current;
    if (!el || !autoResize) return;
    const cs = getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize) || 14;
    const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.4;
    const padding = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const maxHeight = lineHeight * maxRows + padding;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [autoResize, maxRows]);

  // Re-fit on value, rows, size and settings changes (covers mount too).
  useLayoutEffect(() => {
    fit();
  }, [fit, value, rows, size]);

  // The wrapped line count depends on width, so re-fit when the width changes.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!autoResize || !el || typeof ResizeObserver === 'undefined') return;
    let lastWidth = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      fit();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoResize, fit]);

  // Without autoResize, drop inline styles left over from a previous run.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (autoResize || !el) return;
    el.style.height = '';
    el.style.overflowY = '';
  }, [autoResize]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledLength(e.target.value.length);
    onChange?.(e);
  };

  const handleInput = (e: Parameters<NonNullable<TextAreaProps['onInput']>>[0]) => {
    if (!isControlled) {
      setUncontrolledLength(e.currentTarget.value.length);
      fit();
    }
    onInput?.(e);
  };

  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const countId = `${fieldId}-count`;
  const describedBy =
    [ariaDescribedBy, error ? errorId : helperText ? helperId : null, showCount ? countId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const ratio = maxLength ? length / maxLength : 0;
  const countClass =
    ratio >= 1 ? styles.countLimit : ratio >= 0.9 ? styles.countNear : '';

  const wrapClass = [
    styles.wrap,
    styles[size],
    error ? styles.errorWrap : '',
    disabled ? styles.disabled : '',
    readOnly ? styles.readOnly : '',
  ]
    .filter(Boolean)
    .join(' ');

  const effectiveResize = autoResize ? 'none' : resize;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <div className={wrapClass}>
        <textarea
          {...rest}
          ref={(node) => {
            textRef.current = node;
            setRef(ref, node);
          }}
          id={fieldId}
          className={`${styles.textarea} ${styles[`resize-${effectiveResize}`]}`}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : rest['aria-invalid']}
          aria-describedby={describedBy}
          onChange={handleChange}
          onInput={handleInput}
        />
      </div>
      {(error || helperText || showCount) && (
        <div className={styles.footer}>
          {error ? (
            <span id={errorId} className={styles.errorText}>
              {error}
            </span>
          ) : helperText ? (
            <span id={helperId} className={styles.helperText}>
              {helperText}
            </span>
          ) : null}
          {showCount && (
            <span id={countId} className={`${styles.count} ${countClass}`}>
              {maxLength ? `${length} / ${maxLength}` : length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
