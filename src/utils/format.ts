export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h:${String(m).padStart(2, '0')}m`;
}

/** HH:MM:SS — seconds are a stable per-video display detail, not tracked in the data model. */
export function formatDurationHMS(mins: number, seconds: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(seconds)}`;
}
