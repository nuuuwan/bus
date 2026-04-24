/**
 * Format a duration (in milliseconds) as a human-readable string.
 *
 * Rules:
 *  < 60 s    → "X sec"
 *  < 60 min  → "X min"
 *  ≥ 60 min  → "> 1 hour"
 */
export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes >= 60) {
    return "> 1 hour";
  }
  return `${totalMinutes} min`;
}

/**
 * Format an absolute arrival timestamp as "H:MMam/pm (X min)".
 *
 * @param {number} arrivalMs — arrival time in ms since epoch
 * @param {number} nowMs     — current time in ms since epoch
 * @returns {string} e.g. "10:43PM (1 min)"
 */
export function formatArrival(arrivalMs, nowMs) {
  const date = new Date(arrivalMs);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, "0");
  const timeStr = `${h}:${m}${ampm}`;
  const delta = formatDuration(Math.max(0, arrivalMs - nowMs));
  return `${timeStr} (${delta})`;
}
