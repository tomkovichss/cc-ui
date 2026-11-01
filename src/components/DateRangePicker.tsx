import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { FieldLabel } from './FieldLabel';
import { Skeleton } from './Skeleton';
import { usePopup } from './usePopup';
import { addMonths, compareDays, startOfDay, type WeekStart } from '../utils/date';
import {
  formatRange,
  isComplete,
  pickRangeDay,
  previewRange,
  type CompleteRange,
  type DateRange,
} from '../utils/dateRange';
import styles from './DateRangePicker.module.css';

export type { DateRange };

type DateRangePickerSize = 'sm' | 'base';

export interface DateRangePreset {
  id: string;
  label: string;
  /** Evaluated when the preset is clicked, so "last week" is relative to now. */
  range: () => CompleteRange;
}

interface DateRangePickerProps {
  value: DateRange;
  /** Fires only with a complete range: on Apply, or at once when a preset is clicked. */
  onChange: (range: CompleteRange) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Quick ranges listed beside the calendar. */
  presets?: DateRangePreset[];
  /** The preset that matches `value`. Its label replaces the dates in the field; with `null`/unset (a custom range) the dates are shown. */
  activePresetId?: string | null;
  disabled?: boolean;
  /** Shows a skeleton instead of the text and disables the field. */
  loading?: boolean;
  /** BCP 47 tag, e.g. 'en' or 'es'. Names of months and weekdays follow it. */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: WeekStart;
  /** How each date reads in the field. Defaults to month + two-digit day, e.g. "Oct 24"; the year is added when a date is outside the current year. */
  formatValue?: (date: Date) => string;
  /** Which edge of the field the popup lines up with. It flips above the field when there is no room below. */
  placement?: 'bottom-start' | 'bottom-end';
  size?: DateRangePickerSize;
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  /** Accessible name of the field, used when there is no visible `label`. */
  openLabel?: string;
  /** Accessible name of the popup. */
  dialogLabel?: string;
  applyLabel?: string;
  cancelLabel?: string;
  /** Extra classes for layout around the field — width and the like. */
  className?: string;
  id?: string;
}

/** Two months side by side fit from this width up. */
const TWO_MONTHS_QUERY = '(min-width: 640px)';

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** First visible month: the one holding the end of the range (or max / today), as the right-hand month when two show. */
function initialAnchor(value: DateRange, minDate: Date | undefined, maxDate: Date | undefined, two: boolean): Date {
  const reference = value.end ?? value.start ?? maxDate ?? new Date();
  let anchor = monthStart(reference);
  if (two) anchor = addMonths(anchor, -1);
  if (minDate && compareDays(anchor, monthStart(minDate)) < 0) anchor = monthStart(minDate);
  return anchor;
}

/**
 * One field for a period ("Oct 24 – Oct 31") that opens a popup with presets and a calendar
 * to pick the range in two clicks. The popup is portalled to <body> so no parent can clip it;
 * on phones it becomes a bottom sheet. Esc or a click outside cancels.
 */
export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  presets = [],
  activePresetId,
  disabled,
  loading,
  locale = 'en',
  weekStartsOn = 0,
  formatValue,
  placement = 'bottom-start',
  size = 'base',
  label,
  helperText,
  error,
  placeholder = 'Select period',
  openLabel = 'Choose period',
  dialogLabel = 'Choose period',
  applyLabel = 'Apply',
  cancelLabel = 'Cancel',
  className,
  id,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>({ start: null, end: null });
  const [hover, setHover] = useState<Date | null>(null);
  const [anchor, setAnchor] = useState(() => initialAnchor(value, minDate, maxDate, true));
  const [focusDay, setFocusDay] = useState(() => startOfDay(new Date()));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const popupId = useId();
  const twoMonths = useMediaQuery(TWO_MONTHS_QUERY);
  const isOpen = open && !disabled && !loading;

  const activePreset = activePresetId ? presets.find((p) => p.id === activePresetId) : undefined;
  // While the popup is open, a range being picked shows in the field right away (before Apply).
  // Until the draft differs from the saved value, the field keeps showing the saved one.
  const sameDay = (a: Date | null, b: Date | null) => (a && b ? compareDays(a, b) === 0 : a === b);
  const draftChanged = isOpen && Boolean(draft.start) && !(sameDay(draft.start, value.start) && sameDay(draft.end, value.end));
  const text = useMemo(
    () =>
      draftChanged
        ? formatRange(draft, { locale, formatValue })
        : (activePreset?.label ?? formatRange(value, { locale, formatValue })),
    [draftChanged, draft, activePreset, value, locale, formatValue],
  );

  const getAnchor = useCallback(() => triggerRef.current, []);
  const closePopup = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);
  usePopup({ isOpen, popupRef, getAnchor, placement, onClose: closePopup, layoutKey: twoMonths });

  function openPopup() {
    if (disabled || loading) return;
    setDraft({ start: value.start, end: value.end });
    setHover(null);
    setAnchor(initialAnchor(value, minDate, maxDate, twoMonths));
    setFocusDay(value.end ?? value.start ?? startOfDay(new Date()));
    setOpen(true);
  }

  function handleTriggerClick() {
    if (isOpen) closePopup(false);
    else openPopup();
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      openPopup();
    }
  }

  function applyPreset(preset: DateRangePreset) {
    onChange(preset.range());
    closePopup(true);
  }

  function apply() {
    if (!isComplete(draft)) return;
    onChange({ start: draft.start, end: draft.end });
    closePopup(true);
  }

  // Calendar `index` reports a day of its own month; the first calendar's month is the anchor.
  const onMonthChange = (index: number) => (next: Date) => setAnchor(addMonths(monthStart(next), -index));

  const shown = previewRange(draft, hover);
  const secondMonth = addMonths(anchor, 1);
  const focusInSecond = twoMonths && sameMonth(focusDay, secondMonth);
  const calendarProps = {
    value: focusDay,
    onChange: (day: Date) => setDraft((d) => pickRangeDay(d, day)),
    minDate,
    maxDate,
    locale,
    weekStartsOn,
    range: shown,
    onDayHover: setHover,
  };
  const hasPresets = presets.length > 0;

  return (
    <>
      <div className={[styles.field, className].filter(Boolean).join(' ')}>
        {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          className={[styles.trigger, styles[size], error && styles.errorWrap].filter(Boolean).join(' ')}
          disabled={disabled || loading}
          aria-label={label ? undefined : openLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? popupId : undefined}
          aria-busy={loading || undefined}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className={styles.icon} aria-hidden>
            <CalendarDays />
          </span>
          {loading ? (
            <span className={styles.value}>
              <Skeleton variant="text" width="60%" />
            </span>
          ) : (
            <span className={[styles.value, !text && styles.placeholder].filter(Boolean).join(' ')}>
              {text || placeholder}
            </span>
          )}
          <span className={[styles.chevron, isOpen && styles.chevronOpen].filter(Boolean).join(' ')} aria-hidden>
            <ChevronDown />
          </span>
        </button>
        {error ? (
          <span className={styles.errorText}>{error}</span>
        ) : helperText ? (
          <span className={styles.helperText}>{helperText}</span>
        ) : null}
      </div>
      {isOpen &&
        createPortal(
          <div ref={popupRef} id={popupId} role="dialog" aria-label={dialogLabel} className={styles.popup}>
            {hasPresets && (
              <div className={styles.presets} role="group" aria-label={dialogLabel}>
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.preset}
                    aria-pressed={preset.id === activePresetId}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.main}>
              <div className={styles.months}>
                <div className={styles.month}>
                  <Calendar
                    {...calendarProps}
                    autoFocus={!focusInSecond}
                    month={anchor}
                    onMonthChange={onMonthChange(0)}
                    hideNavigation={twoMonths ? 'next' : undefined}
                  />
                </div>
                {twoMonths && (
                  <div className={styles.month}>
                    <Calendar
                      {...calendarProps}
                      autoFocus={focusInSecond}
                      month={secondMonth}
                      onMonthChange={onMonthChange(1)}
                      hideNavigation="previous"
                    />
                  </div>
                )}
              </div>
              <div className={styles.footer}>
                <Button variant="tertiary" size="sm" onClick={() => closePopup(true)}>
                  {cancelLabel}
                </Button>
                <Button variant="primary" size="sm" disabled={!isComplete(draft)} onClick={apply}>
                  {applyLabel}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
