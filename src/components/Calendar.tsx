import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import {
  addDays,
  addMonths,
  clampDay,
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
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

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
}: CalendarProps) {
  // The focused day drives the visible month, so keyboard and buttons share one source of truth.
  const [focused, setFocused] = useState(() => clampDay(value ?? new Date(), minDate, maxDate));
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

  function moveFocus(next: Date) {
    shouldFocusRef.current = true;
    setFocused(clampDay(next, minDate, maxDate));
  }

  function shiftMonth(delta: number) {
    const next = clampDay(addMonths(focused, delta), minDate, maxDate);
    // The button just pressed is about to be disabled; keep focus from falling to <body>.
    shouldFocusRef.current = delta < 0 ? prevBlocked(next) : nextBlocked(next);
    setFocused(next);
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
    setFocused(day);
    onChange(day);
  }

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <Button
          variant="tertiary"
          size="sm"
          className={styles.navButton}
          leadingIcon={<ChevronLeft />}
          aria-label={previousMonthLabel}
          disabled={prevDisabled}
          onClick={() => shiftMonth(-1)}
        />
        <div id={titleId} className={styles.title} aria-live="polite">
          {capitalize(format.title.format(focused), locale)}
        </div>
        <Button
          variant="tertiary"
          size="sm"
          className={styles.navButton}
          leadingIcon={<ChevronRight />}
          aria-label={nextMonthLabel}
          disabled={nextDisabled}
          onClick={() => shiftMonth(1)}
        />
      </div>
      <div ref={gridRef} role="grid" aria-labelledby={titleId} className={styles.grid} onKeyDown={handleKeyDown}>
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
              const selected = Boolean(value) && isSameDay(date, value!);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={dayKey(date)}
                  type="button"
                  role="gridcell"
                  data-date={dayKey(date)}
                  tabIndex={isSameDay(date, focused) ? 0 : -1}
                  aria-selected={selected}
                  aria-disabled={disabled || undefined}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={format.full.format(date)}
                  className={[
                    styles.day,
                    !inMonth && styles.outside,
                    isToday && styles.today,
                    selected && styles.selected,
                    disabled && styles.disabled,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  // Keeps a click on an unavailable day from stealing focus.
                  onMouseDown={disabled ? (e) => e.preventDefault() : undefined}
                  onClick={disabled ? undefined : () => pick(date)}
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
