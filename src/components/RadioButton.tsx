import type { ChangeEvent, FocusEvent, ReactNode, Ref } from 'react';
import styles from './RadioButton.module.css';
import groupStyles from './OptionGroup.module.css';
import { FieldLabel } from './FieldLabel';

interface RadioButtonProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  label?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function RadioButton({
  checked,
  onChange,
  onBlur,
  name,
  value,
  label,
  ariaLabel,
  disabled,
  className,
  ref,
}: RadioButtonProps) {
  return (
    <label className={`${styles.radio} ${className ?? ''}`}>
      <span className={styles.control}>
        <input
          ref={ref}
          type="radio"
          className={styles.input}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          value={value}
          aria-label={ariaLabel}
          disabled={disabled}
        />
        <span className={styles.circle}>
          <span className={styles.dot} />
        </span>
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
}

interface RadioGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: ReactNode;
  name: string;
  items: RadioGroupItem[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function RadioGroup({ label, name, items, value, onChange, disabled, ...rest }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label ? undefined : rest['aria-label']}
      className={groupStyles.group}
    >
      {label && <FieldLabel className={groupStyles.groupLabel}>{label}</FieldLabel>}
      {items.map((item) => (
        <RadioButton
          key={item.value}
          name={name}
          value={item.value}
          checked={value === item.value}
          onChange={() => onChange(item.value)}
          label={item.label}
          disabled={disabled || item.disabled}
        />
      ))}
    </div>
  );
}
