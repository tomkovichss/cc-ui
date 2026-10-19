import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { CheckboxIndicator } from './Checkbox';
import { FieldLabel } from './FieldLabel';
import styles from './Dropdown.module.css';

type DropdownSize = 'sm' | 'base';
type DropdownVariant = 'field' | 'secondary' | 'tertiary' | 'pill';

interface DropdownOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Text matched by search when `label` is not a plain string. */
  searchText?: string;
}

interface CommonProps<T extends string> {
  /**
   * What opens the menu: a text-field-style trigger (`field`), a secondary or
   * tertiary `Button`, or a `pill` styled like a pill `Tag`.
   * `label`, `helperText` and `error` only apply to `field`.
   */
  variant?: DropdownVariant;
  /** Fixed trigger text (e.g. "Actions"). Defaults to the selected option's label, or the placeholder. */
  triggerLabel?: ReactNode;
  /** Which trigger edge the menu lines up with. Ignored for `field`, where the menu spans the trigger. */
  menuAlign?: 'start' | 'end';
  label?: string;
  helperText?: string;
  error?: string;
  /** Applies to `field`, `secondary` and `tertiary`; `pill` has a single size. */
  size?: DropdownSize;
  placeholder?: string;
  options: DropdownOption<T>[];
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

/**
 * `multiple` switches the dropdown to multi-select: `value` becomes an array in the
 * order options were picked, and the menu stays open while options are toggled.
 */
type DropdownProps<T extends string> = CommonProps<T> &
  (
    | {
        multiple?: false;
        value?: T;
        onChange: (value: T) => void;
        triggerPrefix?: never;
        renderTriggerLabel?: never;
        moreText?: never;
      }
    | {
        multiple: true;
        value?: T[];
        onChange: (value: T[]) => void;
        /** Static, muted text before the value in the trigger, e.g. "Compare with:". */
        triggerPrefix?: ReactNode;
        /**
         * Trigger content when at least one option is selected, in selection order.
         * Defaults to the label of a single selection, or "First and N more".
         * An empty selection always shows the placeholder.
         */
        renderTriggerLabel?: (selected: DropdownOption<T>[]) => ReactNode;
        /** Builds the "and N more" suffix of the default trigger label. */
        moreText?: (count: number) => string;
      }
  );

function optionText(opt: DropdownOption<string>): string {
  if (opt.searchText !== undefined) return opt.searchText;
  return typeof opt.label === 'string' || typeof opt.label === 'number' ? String(opt.label) : '';
}

/** Plain text for a selected option in the trigger: its string label, else `searchText`. */
function labelText(opt: DropdownOption<string>): string | undefined {
  if (typeof opt.label === 'string' || typeof opt.label === 'number') return String(opt.label);
  return opt.searchText;
}

const defaultMoreText = (count: number) => `and ${count} more`;

export function Dropdown<T extends string>(props: DropdownProps<T>) {
  const {
    variant = 'field',
    triggerLabel,
    menuAlign = 'start',
    label,
    helperText,
    error,
    size = 'base',
    placeholder = 'Select…',
    options,
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
  } = props;
  const multiple = props.multiple === true;
  const [open, setOpen] = useState(defaultOpen);
  // Stays true while the close animation plays so the menu can animate out before unmounting.
  const [present, setPresent] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  // Hover highlight that glides between options; `instant` skips the slide on first appearance.
  const [highlight, setHighlight] = useState<{
    top: number;
    height: number;
    instant: boolean;
  } | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimer = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerId = useId();
  const listboxId = useId();

  const value = props.multiple ? undefined : props.value;
  const selectedValues: T[] = (props.multiple && props.value) || [];
  // Selection order, not option order.
  const selectedOptions = selectedValues
    .map((v) => options.find((opt) => opt.value === v))
    .filter((opt): opt is DropdownOption<T> => opt !== undefined);
  const selected = multiple ? undefined : options.find((opt) => opt.value === value);
  const trimmedQuery = query.trim().toLowerCase();
  const visibleOptions =
    searchable && trimmedQuery
      ? options.filter((opt) => optionText(opt).toLowerCase().includes(trimmedQuery))
      : options;
  const enabledValues = visibleOptions.filter((opt) => !opt.disabled).map((opt) => opt.value);

  const isField = variant === 'field';

  function openMenu() {
    setPresent(true);
    setOpen(true);
  }

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
    const focusValue =
      (multiple ? selectedOptions.find((opt) => !opt.disabled)?.value : value) ?? enabledValues[0];
    const el = rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${focusValue}"]`);
    el?.focus();
  }, [open]);

  // Open upward when there is not enough room below and more room above.
  useLayoutEffect(() => {
    if (!open || !menuRef.current || !rootRef.current) return;
    const rootRect = rootRef.current.getBoundingClientRect();
    // offsetHeight ignores the entrance animation's scale transform.
    const menuHeight = menuRef.current.offsetHeight;
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
      // Multi-select keeps focus in the menu after a pick, so Tab has to dismiss it.
      if (e.key === 'Tab' && multiple) close();
    }
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, multiple]);

  function focusOption(optionValue: T | undefined) {
    if (optionValue === undefined) return;
    rootRef.current?.querySelector<HTMLButtonElement>(`[data-value="${optionValue}"]`)?.focus();
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu();
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

  function handleListScroll() {
    setScrolling(true);
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => setScrolling(false), 700);
  }

  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  function glideTo(el: HTMLElement) {
    setHighlight((prev) => ({
      top: el.offsetTop,
      height: el.offsetHeight,
      instant: !prev,
    }));
  }

  function select(optionValue: T) {
    if (props.multiple) {
      const current = props.value ?? [];
      props.onChange(
        current.includes(optionValue) ? current.filter((v) => v !== optionValue) : [...current, optionValue],
      );
      return;
    }
    props.onChange(optionValue);
    close();
    triggerRef.current?.focus();
  }

  function multipleLabel(): ReactNode {
    if (props.multiple && props.renderTriggerLabel) return props.renderTriggerLabel(selectedOptions);
    const first = selectedOptions[0];
    if (selectedOptions.length === 1) return first.label;
    const text = labelText(first);
    if (text === undefined) return `${selectedOptions.length} selected`;
    const more = (props.multiple && props.moreText) || defaultMoreText;
    return `${text} ${more(selectedOptions.length - 1)}`;
  }

  const showPlaceholder = triggerLabel === undefined && (multiple ? selectedOptions.length === 0 : !selected);
  const prefix =
    multiple && props.triggerPrefix ? <span className={styles.prefix}>{props.triggerPrefix} </span> : null;
  const valueText =
    triggerLabel ?? (showPlaceholder ? placeholder : multiple ? multipleLabel() : selected?.label);
  const triggerText = (
    <>
      {prefix}
      {valueText}
    </>
  );
  const triggerProps = {
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': open,
    'aria-controls': open ? listboxId : undefined,
    'aria-label': label ? undefined : ariaLabel,
    autoFocus,
    disabled,
    onClick: () => (open ? close() : openMenu()),
    onKeyDown: handleTriggerKeyDown,
  };

  return (
    <div
      className={[isField ? styles.field : styles.fieldInline, className].filter(Boolean).join(' ')}
      ref={rootRef}
      data-testid={dataTestId}
    >
      {isField && label && (
        <FieldLabel htmlFor={triggerId} className={labelClassName}>
          {label}
        </FieldLabel>
      )}
      {isField ? (
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role="combobox"
          className={`${styles.trigger} ${styles[size]} ${error ? styles.errorWrap : ''}`}
          {...triggerProps}
        >
          {selected?.icon && <span className={styles.icon}>{selected.icon}</span>}
          <span className={`${styles.value} ${showPlaceholder ? styles.placeholder : ''}`}>
            {triggerText}
          </span>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
            <ChevronDown />
          </span>
        </button>
      ) : variant === 'pill' ? (
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          className={styles.pillTrigger}
          {...triggerProps}
        >
          {selected?.icon && <span className={styles.pillIcon}>{selected.icon}</span>}
          {triggerText}
          <span className={`${styles.pillChevron} ${open ? styles.chevronOpen : ''}`}>
            <ChevronDown />
          </span>
        </button>
      ) : (
        <Button
          ref={triggerRef}
          id={triggerId}
          variant={variant}
          size={size}
          className={size === 'base' ? styles.buttonTriggerBase : undefined}
          leadingIcon={selected?.icon}
          trailingIcon={
            <span className={`${styles.buttonChevron} ${open ? styles.chevronOpen : ''}`}>
              <ChevronDown />
            </span>
          }
          {...triggerProps}
        >
          {triggerText}
        </Button>
      )}
      {present && (
        <div
          ref={menuRef}
          className={[
            styles.menuWrap,
            !isField && styles.menuWrapAuto,
            !isField && multiple && styles.menuWrapMultiple,
            !isField && menuAlign === 'end' && styles.menuWrapEnd,
            openUpward && styles.menuWrapUp,
            !open && styles.menuWrapClosing,
          ]
            .filter(Boolean)
            .join(' ')}
          onAnimationEnd={(e) => {
            if (open || e.target !== e.currentTarget) return;
            setPresent(false);
            setOpenUpward(false);
          }}
        >
          <Menu role="presentation" style={isField ? { width: '100%' } : undefined}>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setQuery(e.target.value);
                  setHighlight(null);
                }}
                onKeyDown={handleSearchKeyDown}
              />
            )}
            <div
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-label={label ?? ariaLabel}
              className={`${styles.list} ${scrolling ? styles.listScrolling : ''}`}
              onScroll={handleListScroll}
              onMouseLeave={() => setHighlight(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHighlight(null);
              }}
            >
              {highlight && visibleOptions.length > 0 && (
                <span
                  aria-hidden="true"
                  className={`${styles.highlight} ${highlight.instant ? styles.highlightInstant : ''}`}
                  style={{
                    transform: `translateY(${highlight.top}px)`,
                    height: highlight.height,
                  }}
                />
              )}
              {visibleOptions.length === 0 ? (
                <div className={styles.noResults} role="presentation">
                  {noResultsText}
                </div>
              ) : (
                visibleOptions.map((opt, index) => (
                  <MenuItem
                    key={opt.value}
                    style={{ '--i': Math.min(index, 8) } as CSSProperties}
                    data-value={opt.value}
                    role="option"
                    aria-selected={multiple ? selectedValues.includes(opt.value) : opt.value === value}
                    size={variant === 'pill' ? 'sm' : size}
                    icon={opt.icon}
                    leading={
                      multiple ? (
                        <CheckboxIndicator
                          checked={selectedValues.includes(opt.value)}
                          disabled={opt.disabled}
                        />
                      ) : undefined
                    }
                    selected={!multiple && opt.value === value}
                    disabled={opt.disabled}
                    onClick={() => select(opt.value)}
                    onMouseEnter={(e) => !opt.disabled && glideTo(e.currentTarget)}
                    onFocus={(e) => glideTo(e.currentTarget)}
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
      {isField && error ? (
        <span className={styles.errorText}>{error}</span>
      ) : isField && helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
}
