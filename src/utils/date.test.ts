/// <reference types="node" />
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
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
} from './date';

const ORIGINAL_TZ = process.env.TZ;
afterAll(() => {
  if (ORIGINAL_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = ORIGINAL_TZ;
});

// UTC−12, UTC, a DST zone, and UTC+14.
const ZONES = ['Etc/GMT+12', 'UTC', 'America/New_York', 'Pacific/Kiritimati'];
// getTimezoneOffset() in minutes for 1 Jan 2026, to prove the zone switch took effect.
const JAN_OFFSET: Record<string, number> = {
  'Etc/GMT+12': 720,
  UTC: 0,
  'America/New_York': 300,
  'Pacific/Kiritimati': -840,
};

function ymd(d: Date) {
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
}

describe.each(ZONES)('date utils in %s', (zone) => {
  beforeEach(() => {
    process.env.TZ = zone;
    expect(new Date(2026, 0, 1).getTimezoneOffset()).toBe(JAN_OFFSET[zone]);
  });

  it('keeps the calendar day and returns local midnight', () => {
    const d = startOfDay(new Date(2026, 9, 3, 23, 59, 59));
    expect(ymd(d)).toEqual([2026, 10, 3]);
    expect([d.getHours(), d.getMinutes(), d.getSeconds()]).toEqual([0, 0, 0]);
  });

  it('adds days across month and year boundaries', () => {
    expect(ymd(addDays(new Date(2026, 9, 31), 1))).toEqual([2026, 11, 1]);
    expect(ymd(addDays(new Date(2026, 0, 1), -1))).toEqual([2025, 12, 31]);
    expect(ymd(addDays(new Date(2024, 1, 28), 1))).toEqual([2024, 2, 29]);
  });

  it('adds days across DST changes without drifting', () => {
    // US spring forward (Mar 8 2026) and fall back (Nov 1 2026)
    expect(ymd(addDays(new Date(2026, 2, 7), 1))).toEqual([2026, 3, 8]);
    expect(ymd(addDays(new Date(2026, 2, 8), 1))).toEqual([2026, 3, 9]);
    expect(ymd(addDays(new Date(2026, 10, 1), 1))).toEqual([2026, 11, 2]);
    expect(ymd(addDays(new Date(2026, 9, 31), 2))).toEqual([2026, 11, 2]);
  });

  it('clamps the day when adding months', () => {
    expect(ymd(addMonths(new Date(2026, 0, 31), 1))).toEqual([2026, 2, 28]);
    expect(ymd(addMonths(new Date(2024, 0, 31), 1))).toEqual([2024, 2, 29]);
    expect(ymd(addMonths(new Date(2026, 11, 15), 1))).toEqual([2027, 1, 15]);
    expect(ymd(addMonths(new Date(2026, 0, 15), -1))).toEqual([2025, 12, 15]);
  });

  it('compares calendar days ignoring time', () => {
    const morning = new Date(2026, 9, 3, 0, 0, 1);
    const night = new Date(2026, 9, 3, 23, 59, 59);
    expect(isSameDay(morning, night)).toBe(true);
    expect(compareDays(morning, night)).toBe(0);
    expect(compareDays(night, new Date(2026, 9, 4))).toBeLessThan(0);
    expect(compareDays(new Date(2027, 0, 1), new Date(2026, 11, 31))).toBeGreaterThan(0);
  });

  it('applies min/max inclusively', () => {
    const min = new Date(2026, 9, 10, 15);
    const max = new Date(2026, 9, 20, 3);
    expect(isDayDisabled(new Date(2026, 9, 10), min, max)).toBe(false);
    expect(isDayDisabled(new Date(2026, 9, 9), min, max)).toBe(true);
    expect(isDayDisabled(new Date(2026, 9, 20), min, max)).toBe(false);
    expect(isDayDisabled(new Date(2026, 9, 21), min, max)).toBe(true);
    expect(ymd(clampDay(new Date(2026, 11, 1), min, max))).toEqual([2026, 10, 20]);
    expect(ymd(clampDay(new Date(2026, 0, 1), min, max))).toEqual([2026, 10, 10]);
  });

  it('finds week edges for both week starts', () => {
    const wed = new Date(2026, 9, 14); // Wednesday
    expect(ymd(startOfWeek(wed, 0))).toEqual([2026, 10, 11]);
    expect(ymd(endOfWeek(wed, 0))).toEqual([2026, 10, 17]);
    expect(ymd(startOfWeek(wed, 1))).toEqual([2026, 10, 12]);
    expect(ymd(endOfWeek(wed, 1))).toEqual([2026, 10, 18]);
    const sun = new Date(2026, 9, 11);
    expect(ymd(startOfWeek(sun, 1))).toEqual([2026, 10, 5]);
  });

  it('builds a 6×7 month grid with neighbouring days', () => {
    const grid = getMonthGrid(2026, 9, 0); // October 2026 starts on Thursday
    expect(grid).toHaveLength(6);
    grid.forEach((week) => expect(week).toHaveLength(7));
    expect(ymd(grid[0][0].date)).toEqual([2026, 9, 27]);
    expect(grid[0][0].inMonth).toBe(false);
    expect(ymd(grid[0][4].date)).toEqual([2026, 10, 1]);
    expect(grid[0][4].inMonth).toBe(true);
    expect(ymd(grid[5][6].date)).toEqual([2026, 11, 7]);

    const monday = getMonthGrid(2026, 9, 1);
    expect(ymd(monday[0][0].date)).toEqual([2026, 9, 28]);
    expect(ymd(monday[0][3].date)).toEqual([2026, 10, 1]);
  });

  it('lists every day of the month exactly once, in order, across year boundaries', () => {
    for (const [year, month] of [[2026, 11], [2026, 0], [2024, 1], [2026, 1]]) {
      const days = getMonthGrid(year, month, 0).flat();
      const inMonth = days.filter((d) => d.inMonth);
      expect(inMonth.map((d) => d.date.getDate())).toEqual(
        Array.from({ length: inMonth.length }, (_, i) => i + 1),
      );
      for (let i = 1; i < days.length; i++) {
        expect(compareDays(days[i].date, days[i - 1].date)).toBeGreaterThan(0);
        expect(ymd(days[i].date)).toEqual(ymd(addDays(days[i - 1].date, 1)));
      }
    }
  });
});
