import type { ChangeEvent, FocusEvent, ReactNode, Ref } from 'react';
import styles from './Checkbox.module.css';
import groupStyles from './OptionGroup.module.css';
import { FieldLabel } from './FieldLabel';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  name?: string;
  label?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({
  checked,
  onChange,
  onBlur,
  name,
  label,
  ariaLabel,
  disabled,
  className,
  ref,
}: CheckboxProps) {
  return (
    <label className={`${styles.checkbox} ${className ?? ''}`}>
      <span className={styles.control}>
        <input
          ref={ref}
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          aria-label={ariaLabel}
          disabled={disabled}
        />
        <span className={styles.box}>
          <svg className={styles.icon} viewBox="0 0 17 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </span>
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
}

/**
 * The checkbox visual without an input, for rows that already carry the state
 * themselves (e.g. multi-select menu options). Purely decorative.
 */
export function CheckboxIndicator({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={`${styles.box} ${styles.indicator}`}
      data-checked={checked}
      data-disabled={disabled || undefined}
      aria-hidden="true"
    >
      <svg className={styles.icon} viewBox="0 0 17 18" aria-hidden="true">
        <polyline points="1 9 7 14 15 4" />
      </svg>
    </span>
  );
}

interface CheckboxGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  label?: ReactNode;
  items: CheckboxGroupItem[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function CheckboxGroup({ label, items, value, onChange, disabled, ...rest }: CheckboxGroupProps) {
  function toggle(itemValue: string) {
    const next = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];
    onChange(next);
  }

  return (
    <div role="group" aria-label={label ? undefined : rest['aria-label']} className={groupStyles.group}>
      {label && <FieldLabel className={groupStyles.groupLabel}>{label}</FieldLabel>}
      {items.map((item) => (
        <Checkbox
          key={item.value}
          checked={value.includes(item.value)}
          onChange={() => toggle(item.value)}
          label={item.label}
          disabled={disabled || item.disabled}
        />
      ))}
    </div>
  );
}
