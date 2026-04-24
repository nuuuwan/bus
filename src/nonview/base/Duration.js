/**
 * Format a duration (in milliseconds) as a human-readable string.
 *
 * Rules:
 *  < 60 s   → "X sec"
 *  < 120 min → "X min"
 *  ≥ 120 min → "> 2 hours"
 */
export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 120) {
    return `${totalMinutes} min`;
  }
  return "> 2 hours";
}
