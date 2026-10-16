import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { FieldLabel } from './FieldLabel';
import styles from './Dropdown.module.css';

type DropdownSize = 'sm' | 'base';

interface DropdownOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Text matched by search when `label` is not a plain string. */
  searchText?: string;
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
  /** Show a search field at the top of the open menu that filters options by their text. */
  searchable?: boolean;
  /** Placeholder for the search field. */
  searchPlaceholder?: string;
  /** Shown in place of the options when a search matches nothing. */
  noResultsText?: ReactNode;
  /** Open the menu on first render. */
  defaultOpen?: boolean;
  /** Focus the trigger on first render. */
  autoFocus?: boolean;
  /**
   * Extra classes for layout around the field — width, responsive sizing.
   * Appended after the field's own class.
   */
  className?: string;
  /** Extra classes for the label, e.g. to hide it below a breakpoint. */
  labelClassName?: string;
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string;
  'data-testid'?: string;
}

function optionText(opt: DropdownOption<string>): string {
  if (opt.searchText !== undefined) return opt.searchText;
  return typeof opt.label === 'string' || typeof opt.label === 'number' ? String(opt.label) : '';
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
  searchable,
  searchPlaceholder = 'Search…',
  noResultsText = 'No matches',
  defaultOpen = false,
  autoFocus,
  className,
  labelClassName,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerId = useId();
  const listboxId = useId();

  const selected = options.find((opt) => opt.value === value);
  const trimmedQuery = query.trim().toLowerCase();
  const visibleOptions =
    searchable && trimmedQuery
      ? options.filter((opt) => optionText(opt).toLowerCase().includes(trimmedQuery))
      : options;
  const enabledValues = visibleOptions.filter((opt) => !opt.disabled).map((opt) => opt.value);

  function close() {
    setOpen(false);
    setQuery('');
  }

  // Searchable menus focus the search field; others focus the selected (or first) option.
  useEffect(() => {
    if (!open) return;
    if (searchable) {
      searchRef.current?.focus();
      return;
    }
    const focusValue = value ?? enabledValues[0];
    const el = rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${focusValue}"]`);
    el?.focus();
  }, [open]);

  // Open upward when there is not enough room below and more room above.
  useLayoutEffect(() => {
    if (!open || !menuRef.current || !rootRef.current) {
      setOpenUpward(false);
      return;
    }
    const rootRect = rootRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.getBoundingClientRect().height;
    const spaceBelow = window.innerHeight - rootRect.bottom;
    const spaceAbove = rootRect.top;
    setOpenUpward(spaceBelow < menuHeight + 8 && spaceAbove > spaceBelow);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function focusOption(optionValue: T | undefined) {
    if (optionValue === undefined) return;
    rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${optionValue}"]`)?.focus();
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusOption(enabledValues[0]);
    }
    if (e.key === 'Enter' && enabledValues.length === 1) {
      e.preventDefault();
      select(enabledValues[0]);
    }
  }

  function handleOptionKeyDown(e: KeyboardEvent<HTMLButtonElement>, currentValue: T) {
    const currentIndex = enabledValues.indexOf(currentValue);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % enabledValues.length;
    if (e.key === 'ArrowUp') {
      if (searchable && currentIndex === 0) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      nextIndex = (currentIndex - 1 + enabledValues.length) % enabledValues.length;
    }
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = enabledValues.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      focusOption(enabledValues[nextIndex]);
    }
  }

  function select(optionValue: T) {
    onChange(optionValue);
    close();
    triggerRef.current?.focus();
  }

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(' ')}
      ref={rootRef}
      data-testid={dataTestId}
    >
      {label && (
        <FieldLabel htmlFor={triggerId} className={labelClassName}>
          {label}
        </FieldLabel>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        className={`${styles.trigger} ${styles[size]} ${error ? styles.errorWrap : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={label ? undefined : ariaLabel}
        autoFocus={autoFocus}
        disabled={disabled}
        onClick={() => (open ? close() : setOpen(true))}
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
        <div ref={menuRef} className={`${styles.menuWrap} ${openUpward ? styles.menuWrapUp : ''}`}>
          <Menu role="presentation" style={{ width: '100%' }}>
            {searchable && (
              <input
                ref={searchRef}
                type="text"
                className={styles.search}
                value={query}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={listboxId}
                autoComplete="off"
                spellCheck={false}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            )}
            <div id={listboxId} role="listbox" aria-label={label ?? ariaLabel} className={styles.list}>
              {visibleOptions.length === 0 ? (
                <div className={styles.noResults} role="presentation">
                  {noResultsText}
                </div>
              ) : (
                visibleOptions.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    data-value={opt.value}
                    role="option"
                    aria-selected={opt.value === value}
                    icon={opt.icon}
                    selected={opt.value === value}
                    disabled={opt.disabled}
                    onClick={() => select(opt.value)}
                    onKeyDown={(e) => handleOptionKeyDown(e, opt.value)}
                  >
                    {opt.label}
                  </MenuItem>
                ))
              )}
            </div>
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
