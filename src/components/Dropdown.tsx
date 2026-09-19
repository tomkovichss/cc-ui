import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import styles from './Dropdown.module.css';

type DropdownSize = 'sm' | 'base';

interface DropdownOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface DropdownProps<T extends string> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: DropdownSize;
  placeholder?: string;
  options: DropdownOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function Dropdown<T extends string>({
  label,
  helperText,
  error,
  size = 'base',
  placeholder = 'Select…',
  options,
  value,
  onChange,
  disabled,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  const selected = options.find((opt) => opt.value === value);
  const enabledValues = options.filter((opt) => !opt.disabled).map((opt) => opt.value);

  useEffect(() => {
    if (!open) return;
    const focusValue = value ?? enabledValues[0];
    const el = rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${focusValue}"]`);
    el?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (e.key === 'Escape') setOpen(false);
  }

  function handleOptionKeyDown(e: KeyboardEvent<HTMLButtonElement>, currentValue: T) {
    const currentIndex = enabledValues.indexOf(currentValue);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % enabledValues.length;
    if (e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + enabledValues.length) % enabledValues.length;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = enabledValues.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const nextValue = enabledValues[nextIndex];
      const el = rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${nextValue}"]`);
      el?.focus();
      return;
    }
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className={styles.field} ref={rootRef}>
      {label && (
        <label className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
      )}
      <button
        id={triggerId}
        type="button"
        className={`${styles.trigger} ${styles[size]} ${error ? styles.errorWrap : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
      >
        {selected?.icon && <span className={styles.icon}>{selected.icon}</span>}
        <span className={`${styles.value} ${!selected ? styles.placeholder : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div className={styles.menuWrap}>
          <Menu role="listbox" style={{ width: '100%' }}>
            {options.map((opt) => (
              <MenuItem
                key={opt.value}
                data-value={opt.value}
                role="option"
                aria-selected={opt.value === value}
                icon={opt.icon}
                selected={opt.value === value}
                disabled={opt.disabled}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, opt.value)}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
