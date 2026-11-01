import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import {
  addDays,
  addMonths,
  clampDay,
  compareDays,
  endOfWeek,
  getMonthGrid,
  isDayDisabled,
  isSameDay,
  startOfDay,
  startOfWeek,
  type WeekStart,
} from '../utils/date';
import styles from './Calendar.module.css';

interface CalendarProps {
  value: Date | null;
  /** Receives the picked day as a Date at local midnight. */
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** BCP 47 tag, e.g. 'en' or 'es'. Names of months and weekdays follow it. */
  locale?: string;
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: WeekStart;
  /** Move keyboard focus to the selected (or today's) day on mount. */
  autoFocus?: boolean;
  /** Accessible name of the previous-month button. */
  previousMonthLabel?: string;
  /** Accessible name of the next-month button. */
  nextMonthLabel?: string;
  /** Extra classes for layout around the calendar. */
  className?: string;
  /**
   * Highlights a range: both ends filled, the days between tinted. Days of neighbouring
   * months are hidden. `value` then only sets where focus starts.
   */
  range?: { start: Date | null; end: Date | null };
  /** Called with the day under the pointer or keyboard focus, and with null when it leaves the grid. */
  onDayHover?: (date: Date | null) => void;
  /** Controls which month is shown (the day of month is kept). Pair with `onMonthChange`. */
  month?: Date;
  /** Called when the user moves to another month, with a day of that month. */
  onMonthChange?: (month: Date) => void;
  /** Hides one month-navigation button, for two calendars side by side. */
  hideNavigation?: 'previous' | 'next';
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/** Day `day` of the month containing `month`, or its last day when the month is shorter. */
function dayInMonth(month: Date, day: number): Date {
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return new Date(month.getFullYear(), month.getMonth(), Math.min(day, last));
}

/** Intl returns lowercase month names in some locales (es); the title reads better capitalised. */
function capitalize(text: string, locale: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

/** Month grid with keyboard navigation. Has no surface of its own; a popup or card supplies it. */
export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  locale = 'en',
  weekStartsOn = 0,
  autoFocus,
  previousMonthLabel = 'Previous month',
  nextMonthLabel = 'Next month',
  className,
  range,
  onDayHover,
  month: controlledMonth,
  onMonthChange,
  hideNavigation,
}: CalendarProps) {
  // The focused day drives the visible month, so keyboard and buttons share one source of truth.
  const [focused, setFocused] = useState(() =>
    controlledMonth
      ? dayInMonth(controlledMonth, (value ?? new Date()).getDate())
      : clampDay(value ?? new Date(), minDate, maxDate),
  );
  const monthKey = controlledMonth ? `${controlledMonth.getFullYear()}-${controlledMonth.getMonth()}` : null;
  const [prevMonthKey, setPrevMonthKey] = useState(monthKey);
  if (monthKey !== prevMonthKey) {
    setPrevMonthKey(monthKey);
    if (
      controlledMonth &&
      (focused.getFullYear() !== controlledMonth.getFullYear() || focused.getMonth() !== controlledMonth.getMonth())
    ) {
      setFocused(dayInMonth(controlledMonth, focused.getDate()));
    }
  }
  const valueKey = value ? dayKey(value) : null;
  const [prevValueKey, setPrevValueKey] = useState(valueKey);
  if (valueKey !== prevValueKey) {
    setPrevValueKey(valueKey);
    if (value) setFocused(clampDay(value, minDate, maxDate));
  }

  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocusRef = useRef(Boolean(autoFocus));
  const titleId = useId();

  useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${dayKey(focused)}"]`)?.focus();
  }, [focused]);

  const year = focused.getFullYear();
  const month = focused.getMonth();
  const weeks = useMemo(() => getMonthGrid(year, month, weekStartsOn), [year, month, weekStartsOn]);
  const today = startOfDay(new Date());

  // Normalise to lo ≤ hi so a reversed range still paints.
  const rangeSwapped = Boolean(range?.start && range.end && compareDays(range.start, range.end) > 0);
  const rangeLo = rangeSwapped ? range!.end : (range?.start ?? null);
  const rangeHi = rangeSwapped ? range!.start : (range?.end ?? null);
  // Ends are squared on the side facing the range, so a one-day range keeps all corners round.
  const spansDays = Boolean(rangeLo && rangeHi && compareDays(rangeLo, rangeHi) !== 0);

  const format = useMemo(
    () => ({
      title: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      short: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      long: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
    }),
    [locale],
  );

  // Row 0 of the grid already holds one of each weekday, in display order.
  const weekdays = weeks[0].map(({ date }) => ({
    short: capitalize(format.short.format(date), locale).slice(0, 2),
    long: format.long.format(date),
  }));

  // A page is unreachable when its whole month lies outside [minDate, maxDate].
  const prevBlocked = (d: Date) => Boolean(minDate) && new Date(d.getFullYear(), d.getMonth(), 0) < startOfDay(minDate!);
  const nextBlocked = (d: Date) => Boolean(maxDate) && new Date(d.getFullYear(), d.getMonth() + 1, 1) > startOfDay(maxDate!);
  const prevDisabled = prevBlocked(focused);
  const nextDisabled = nextBlocked(focused);

  function changeFocused(next: Date) {
    if (onMonthChange && (next.getFullYear() !== focused.getFullYear() || next.getMonth() !== focused.getMonth())) {
      onMonthChange(next);
    }
    setFocused(next);
  }

  function moveFocus(next: Date) {
    shouldFocusRef.current = true;
    changeFocused(clampDay(next, minDate, maxDate));
  }

  function shiftMonth(delta: number) {
    const next = clampDay(addMonths(focused, delta), minDate, maxDate);
    // The button just pressed is about to be disabled; keep focus from falling to <body>.
    shouldFocusRef.current = delta < 0 ? prevBlocked(next) : nextBlocked(next);
    changeFocused(next);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(focused, -1);
        break;
      case 'ArrowRight':
        next = addDays(focused, 1);
        break;
      case 'ArrowUp':
        next = addDays(focused, -7);
        break;
      case 'ArrowDown':
        next = addDays(focused, 7);
        break;
      case 'PageUp':
        next = addMonths(focused, -1);
        break;
      case 'PageDown':
        next = addMonths(focused, 1);
        break;
      case 'Home':
        next = startOfWeek(focused, weekStartsOn);
        break;
      case 'End':
        next = endOfWeek(focused, weekStartsOn);
        break;
    }
    if (!next) return;
    e.preventDefault();
    moveFocus(next);
  }

  function pick(date: Date) {
    const day = startOfDay(date);
    changeFocused(day);
    onChange(day);
  }

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        {hideNavigation === 'previous' ? (
          <span />
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            className={styles.navButton}
            leadingIcon={<ChevronLeft />}
            aria-label={previousMonthLabel}
            disabled={prevDisabled}
            onClick={() => shiftMonth(-1)}
          />
        )}
        <div id={titleId} className={styles.title} aria-live="polite">
          {capitalize(format.title.format(focused), locale)}
        </div>
        {hideNavigation === 'next' ? (
          <span />
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            className={styles.navButton}
            leadingIcon={<ChevronRight />}
            aria-label={nextMonthLabel}
            disabled={nextDisabled}
            onClick={() => shiftMonth(1)}
          />
        )}
      </div>
      <div ref={gridRef} role="grid" aria-labelledby={titleId} className={styles.grid}
        onKeyDown={handleKeyDown}
        onMouseLeave={onDayHover ? () => onDayHover(null) : undefined}
      >
        <div role="row" className={styles.row}>
          {weekdays.map((day) => (
            <span key={day.long} role="columnheader" aria-label={day.long} className={styles.weekday}>
              {day.short}
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div role="row" className={styles.row} key={dayKey(week[0].date)}>
            {week.map(({ date, inMonth }) => {
              const disabled = isDayDisabled(date, minDate, maxDate);
              const isStart = Boolean(rangeLo) && isSameDay(date, rangeLo!);
              const isEnd = Boolean(rangeHi) && isSameDay(date, rangeHi!);
              const inRange =
                Boolean(rangeLo && rangeHi) && compareDays(date, rangeLo!) > 0 && compareDays(date, rangeHi!) < 0;
              const selected = range ? isStart || isEnd : Boolean(value) && isSameDay(date, value!);
              const hidden = Boolean(range) && !inMonth;
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={dayKey(date)}
                  type="button"
                  role="gridcell"
                  data-date={dayKey(date)}
                  tabIndex={isSameDay(date, focused) && !hidden ? 0 : -1}
                  aria-selected={selected || inRange}
                  aria-hidden={hidden || undefined}
                  aria-disabled={disabled || undefined}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={format.full.format(date)}
                  className={[
                    styles.day,
                    !inMonth && styles.outside,
                    hidden && styles.hiddenDay,
                    inRange && styles.inRange,
                    spansDays && isStart && styles.rangeStart,
                    spansDays && isEnd && styles.rangeEnd,
                    isToday && styles.today,
                    selected && styles.selected,
                    disabled && styles.disabled,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  // Keeps a click on an unavailable day from stealing focus.
                  onMouseDown={disabled ? (e) => e.preventDefault() : undefined}
                  onClick={disabled || hidden ? undefined : () => pick(date)}
                  onMouseEnter={onDayHover && !hidden ? () => onDayHover(date) : undefined}
                  onFocus={onDayHover && !hidden ? () => onDayHover(date) : undefined}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
