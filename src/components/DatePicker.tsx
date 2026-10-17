import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from './Calendar';
import { DateField } from './DateField';
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

/** Keep in sync with the bottom-sheet breakpoint in DatePicker.module.css. */
const SHEET_QUERY = '(max-width: 480px)';
const GAP = 4;
const VIEWPORT_MARGIN = 8;

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

  const reposition = useCallback(() => {
    const popup = popupRef.current;
    const anchor = getAnchor();
    if (!popup || !anchor) return;
    if (window.matchMedia(SHEET_QUERY).matches) {
      // CSS docks the popup to the bottom of the screen.
      popup.style.left = '';
      popup.style.top = '';
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;

    let left = placement === 'bottom-end' ? rect.right - width : rect.left;
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, viewportWidth - width - VIEWPORT_MARGIN));

    let top = rect.bottom + GAP;
    const fitsBelow = top + height <= viewportHeight - VIEWPORT_MARGIN;
    const roomAbove = rect.top - GAP - height >= VIEWPORT_MARGIN;
    if (!fitsBelow && roomAbove) top = rect.top - GAP - height;

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }, [getAnchor, placement]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isOpen, reposition]);

  useEffect(() => {
    if (!isOpen) return;

    function close() {
      setOpen(false);
      inputRef.current?.focus();
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (popupRef.current?.contains(target) || getAnchor()?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Focus trap: Tab cycles through the popup's own controls.
      const popup = popupRef.current;
      if (!popup) return;
      const stops = Array.from(
        popup.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"])'),
      );
      if (stops.length === 0) {
        e.preventDefault();
        return;
      }
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (!popup.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, getAnchor]);

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
