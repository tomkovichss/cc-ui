import { compareDays, isSameDay, startOfDay } from './date';

/** A range being picked. `end` is null until the second click. Days are local midnight. */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CompleteRange {
  start: Date;
  end: Date;
}

export function isComplete(range: DateRange): range is CompleteRange {
  return range.start !== null && range.end !== null;
}

/**
 * One calendar click. With no start yet (or a finished range) the day becomes a new start;
 * while picking the end, a day before the start becomes the new start instead.
 */
export function pickRangeDay(draft: DateRange, day: Date): DateRange {
  const picked = startOfDay(day);
  if (draft.start && !draft.end && compareDays(picked, draft.start) >= 0) {
    return { start: draft.start, end: picked };
  }
  return { start: picked, end: null };
}

/** What the calendar shows: while picking the end, the hovered day previews the range (either direction). */
export function previewRange(draft: DateRange, hover: Date | null): DateRange {
  if (draft.start && !draft.end && hover) {
    return compareDays(hover, draft.start) < 0
      ? { start: hover, end: draft.start }
      : { start: draft.start, end: hover };
  }
  return draft;
}

export interface FormatRangeOptions {
  locale: string;
  /** Used to decide whether the year can be left out. */
  today?: Date;
  /** Replaces the built-in day format (and the year logic) entirely. */
  formatValue?: (date: Date) => string;
}

/** Regular spaces around an en dash: "Oct 26 – Nov 01". */
export const RANGE_SEPARATOR = ' \u2013 ';

/**
 * "Oct 24 – Oct 31". Years appear (on both ends) only when a date is outside the current year.
 * A one-day range reads as a single date.
 */
export function formatRange(range: DateRange, { locale, today = new Date(), formatValue }: FormatRangeOptions): string {
  const { start, end } = range;
  if (!start && !end) return '';
  const monthDay = new Intl.DateTimeFormat(locale, { month: 'short', day: '2-digit' });
  const withYear = new Intl.DateTimeFormat(locale, { month: 'short', day: '2-digit', year: 'numeric' });
  const crossYear = [start, end].some((d) => d && d.getFullYear() !== today.getFullYear());
  const fmt = (d: Date) => (formatValue ? formatValue(d) : (crossYear ? withYear : monthDay).format(d));
  if (start && !end) return fmt(start);
  if (!start && end) return fmt(end);
  if (isSameDay(start!, end!)) return fmt(start!);
  return `${fmt(start!)}${RANGE_SEPARATOR}${fmt(end!)}`;
}
