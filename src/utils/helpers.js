import { formatDistance, format, parseISO, isValid } from "date-fns";

/**
 * Format a date string as a relative time from now.
 * e.g. "3 days ago", "about 2 hours ago"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function timeAgo(dateInput) {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  if (!isValid(date)) return "—";
  return formatDistance(date, new Date(), { addSuffix: true });
}

/**
 * Format a date string as a short readable date.
 * e.g. "May 23, 2026"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  if (!isValid(date)) return "—";
  return format(date, "MMM d, yyyy");
}

/**
 * Format a date string as a short date + time.
 * e.g. "May 23, 2026 at 3:30 PM"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  if (!isValid(date)) return "—";
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Format a salary range into a human-readable string.
 * e.g. "$80k – $120k"
 * @param {number|null} min
 * @param {number|null} max
 * @returns {string}
 */
export function formatSalaryRange(min, max) {
  if (!min && !max) return "Not specified";
  const fmt = (n) => `$${Math.round(n / 1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a max length, appending "..." if needed.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 50) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Get the initials of a name (up to 2 characters).
 * e.g. "John Doe" → "JD", "Alice" → "A"
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
