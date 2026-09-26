import type { ReactNode } from 'react';
import styles from './TagGroup.module.css';
import groupStyles from './OptionGroup.module.css';

type TagGroupSize = 'sm' | 'base';

interface TagGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface TagGroupProps {
  items: TagGroupItem[];
  value: string[];
  onChange: (value: string[]) => void;
  size?: TagGroupSize;
  disabled?: boolean;
  label?: ReactNode;
  'aria-label'?: string;
}

export function TagGroup({
  items,
  value,
  onChange,
  size = 'base',
  disabled = false,
  label,
  ...rest
}: TagGroupProps) {
  function toggle(itemValue: string) {
    const next = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue];
    onChange(next);
  }

  const tags = (
    <div
      role="group"
      aria-label={label ? undefined : rest['aria-label']}
      className={`${styles.group} ${styles[size]}`}
    >
      {items.map((item) => {
        const selected = value.includes(item.value);
        const isDisabled = disabled || item.disabled;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={selected}
            disabled={isDisabled}
            className={[styles.chip, selected && styles.selected].filter(Boolean).join(' ')}
            onClick={() => !isDisabled && toggle(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );

  if (!label) return tags;

  return (
    <div className={groupStyles.group} {...rest}>
      <span className={groupStyles.label}>{label}</span>
      {tags}
    </div>
  );
}
