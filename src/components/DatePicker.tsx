import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from './Calendar';
import { DateField } from './DateField';
import { usePopup } from './usePopup';
import type { WeekStart } from '../utils/date';
import styles from './DatePicker.module.css';

type DatePickerSize = 'sm' | 'base';

interface DatePickerProps {
  value: Date | null;
  /** Receives the picked day as a Date at local midnight. */
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** BCP 47 tag, e.g. 'en' or 'es'. Names of months and weekdays follow it. */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: WeekStart;
  /** How the picked date reads in the field. Defaults to month + two-digit day, e.g. "Oct 03". */
  formatValue?: (date: Date) => string;
  /** Which edge of the field the popup lines up with. It flips above the field when there is no room below. */
  placement?: 'bottom-start' | 'bottom-end';
  label?: string;
  helperText?: string;
  error?: string;
  size?: DatePickerSize;
  /** Accessible name of the chevron button in the field. */
  openLabel?: string;
  placeholder?: string;
  /** Accessible name of the popup. */
  dialogLabel?: string;
  /** Extra classes for layout around the field — width and the like. */
  className?: string;
  id?: string;
}

/** A date field that opens a `Calendar` in a popup. The popup is portalled to <body> so no parent can clip it. */
export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  locale = 'en',
  weekStartsOn = 0,
  formatValue,
  placement = 'bottom-start',
  label,
  helperText,
  error,
  size,
  openLabel,
  placeholder,
  dialogLabel = 'Choose date',
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupId = useId();
  const isOpen = open && !disabled;

  const defaultFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'short', day: '2-digit' }),
    [locale],
  );
  const text = value ? (formatValue ? formatValue(value) : defaultFormat.format(value)) : '';

  // The visible field box (not the label or helper text) is what the popup attaches to.
  const getAnchor = useCallback(() => inputRef.current?.parentElement ?? inputRef.current, []);

  const closePopup = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) inputRef.current?.focus();
  }, []);

  usePopup({ isOpen, popupRef, getAnchor, placement, onClose: closePopup });

  function handleFieldKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!disabled) setOpen(true);
    }
  }

  function handleSelect(date: Date) {
    onChange(date);
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <>
      <DateField
        ref={inputRef}
        id={id}
        className={className}
        label={label}
        helperText={helperText}
        error={error}
        size={size}
        openLabel={openLabel}
        placeholder={placeholder}
        disabled={disabled}
        value={text}
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? popupId : undefined}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleFieldKeyDown}
      />
      {isOpen &&
        createPortal(
          <div ref={popupRef} id={popupId} role="dialog" aria-label={dialogLabel} className={styles.popup}>
            <Calendar
              autoFocus
              value={value}
              onChange={handleSelect}
              minDate={minDate}
              maxDate={maxDate}
              locale={locale}
              weekStartsOn={weekStartsOn}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
