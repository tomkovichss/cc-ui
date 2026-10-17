/*
 * Calendar-day arithmetic on local dates. Time of day is ignored everywhere and
 * every returned Date is local midnight. Days are always built with
 * `new Date(y, m, d)` rather than by adding milliseconds, so DST changes and
 * UTC-12…UTC+14 offsets can never move a date to a neighbouring day.
 */

export type WeekStart = 0 | 1;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Moves by whole months, keeping the day of month where possible (Jan 31 + 1 → Feb 28/29). */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const day = Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return new Date(target.getFullYear(), target.getMonth(), day);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Negative when `a` is an earlier calendar day than `b`, positive when later, 0 when the same day. */
export function compareDays(a: Date, b: Date): number {
  return (
    a.getFullYear() - b.getFullYear() || a.getMonth() - b.getMonth() || a.getDate() - b.getDate()
  );
}

export function isDayDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && compareDays(date, minDate) < 0) return true;
  if (maxDate && compareDays(date, maxDate) > 0) return true;
  return false;
}

/** Pulls a day into [minDate, maxDate]. */
export function clampDay(date: Date, minDate?: Date, maxDate?: Date): Date {
  if (minDate && compareDays(date, minDate) < 0) return startOfDay(minDate);
  if (maxDate && compareDays(date, maxDate) > 0) return startOfDay(maxDate);
  return startOfDay(date);
}

/** First day of the week containing `date`. */
export function startOfWeek(date: Date, weekStartsOn: WeekStart): Date {
  const offset = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -offset);
}

export function endOfWeek(date: Date, weekStartsOn: WeekStart): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

export interface GridDay {
  date: Date;
  /** False for the leading/trailing days that belong to a neighbouring month. */
  inMonth: boolean;
}

const GRID_WEEKS = 6;

/**
 * Month page as six full weeks (a fixed height keeps the popup from jumping
 * between months), padded with days of the neighbouring months.
 */
export function getMonthGrid(year: number, month: number, weekStartsOn: WeekStart): GridDay[][] {
  const first = startOfWeek(new Date(year, month, 1), weekStartsOn);
  const weeks: GridDay[][] = [];
  for (let w = 0; w < GRID_WEEKS; w++) {
    const week: GridDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(first, w * 7 + d);
      week.push({ date, inMonth: date.getMonth() === month });
    }
    weeks.push(week);
  }
  return weeks;
}
