import type { ChangeEvent, ReactNode } from 'react';
import styles from './RadioButton.module.css';
import groupStyles from './OptionGroup.module.css';

interface RadioButtonProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  label?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function RadioButton({
  checked,
  onChange,
  name,
  value,
  label,
  ariaLabel,
  className,
}: RadioButtonProps) {
  return (
    <label className={`${styles.radio} ${className ?? ''}`}>
      <span className={styles.control}>
        <input
          type="radio"
          className={styles.input}
          checked={checked}
          onChange={onChange}
          name={name}
          value={value}
          aria-label={ariaLabel}
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
}

interface RadioGroupProps {
  label?: ReactNode;
  name: string;
  items: RadioGroupItem[];
  value: string;
  onChange: (value: string) => void;
  'aria-label'?: string;
}

export function RadioGroup({ label, name, items, value, onChange, ...rest }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label ? undefined : rest['aria-label']}
      className={groupStyles.group}
    >
      {label && <span className={groupStyles.label}>{label}</span>}
      {items.map((item) => (
        <RadioButton
          key={item.value}
          name={name}
          value={item.value}
          checked={value === item.value}
          onChange={() => onChange(item.value)}
          label={item.label}
        />
      ))}
    </div>
  );
}
