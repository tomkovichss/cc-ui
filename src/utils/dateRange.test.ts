import { describe, expect, it } from 'vitest';
import { formatRange, pickRangeDay, previewRange, RANGE_SEPARATOR } from './dateRange';

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);
const ymd = (x: Date | null) => (x ? [x.getFullYear(), x.getMonth() + 1, x.getDate()] : null);
const today = d(2026, 10, 31);

describe('pickRangeDay', () => {
  it('first click sets the start', () => {
    const r = pickRangeDay({ start: null, end: null }, d(2026, 10, 24));
    expect(ymd(r.start)).toEqual([2026, 10, 24]);
    expect(r.end).toBeNull();
  });

  it('second click later than the start completes the range', () => {
    const r = pickRangeDay({ start: d(2026, 10, 24), end: null }, d(2026, 10, 29));
    expect(ymd(r.end)).toEqual([2026, 10, 29]);
  });

  it('second click on the same day gives a one-day range', () => {
    const r = pickRangeDay({ start: d(2026, 10, 24), end: null }, d(2026, 10, 24));
    expect(ymd(r.start)).toEqual(ymd(r.end));
  });

  it('second click earlier than the start becomes the new start (reverse pick)', () => {
    const r = pickRangeDay({ start: d(2026, 10, 24), end: null }, d(2026, 10, 20));
    expect(ymd(r.start)).toEqual([2026, 10, 20]);
    expect(r.end).toBeNull();
  });

  it('clicking after a finished range starts over', () => {
    const r = pickRangeDay({ start: d(2026, 10, 1), end: d(2026, 10, 5) }, d(2026, 10, 10));
    expect(ymd(r.start)).toEqual([2026, 10, 10]);
    expect(r.end).toBeNull();
  });
});

describe('previewRange', () => {
  it('previews forwards and backwards while picking the end', () => {
    const draft = { start: d(2026, 10, 10), end: null };
    expect(ymd(previewRange(draft, d(2026, 10, 15)).end)).toEqual([2026, 10, 15]);
    const back = previewRange(draft, d(2026, 10, 5));
    expect(ymd(back.start)).toEqual([2026, 10, 5]);
    expect(ymd(back.end)).toEqual([2026, 10, 10]);
  });

  it('ignores hover once the range is complete', () => {
    const draft = { start: d(2026, 10, 1), end: d(2026, 10, 5) };
    expect(previewRange(draft, d(2026, 10, 20))).toBe(draft);
  });
});

describe('formatRange', () => {
  const opts = { locale: 'en', today };

  it('leaves the year out inside the current year', () => {
    expect(formatRange({ start: d(2026, 10, 24), end: d(2026, 10, 31) }, opts)).toBe(
      `Oct 24${RANGE_SEPARATOR}Oct 31`,
    );
  });

  it('shows the year on both ends across years', () => {
    expect(formatRange({ start: d(2025, 10, 24), end: d(2026, 1, 3) }, opts)).toBe(
      `Oct 24, 2025${RANGE_SEPARATOR}Jan 03, 2026`,
    );
  });

  it('collapses a same-day range to one date', () => {
    expect(formatRange({ start: d(2026, 10, 24), end: d(2026, 10, 24) }, opts)).toBe('Oct 24');
  });

  it('is empty without dates and honours formatValue', () => {
    expect(formatRange({ start: null, end: null }, opts)).toBe('');
    expect(
      formatRange({ start: d(2026, 10, 24), end: d(2026, 10, 25) }, { ...opts, formatValue: (x) => `#${x.getDate()}` }),
    ).toBe(`#24${RANGE_SEPARATOR}#25`);
  });
});
