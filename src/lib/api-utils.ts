/**
 * Format the time portion of a timestamp in the user's local timezone.
 * Shows the time only, e.g. "3:30 PM".
 */
export function formatTimeLocal(timestamp: string | Date) {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDate(timestamp: string | Date, month: 'short' | 'long' = 'short') {
  const date = new Date(timestamp)
  // Always format in UTC so date-only frontmatter values like `2026-06-14`
  // (which YAML parses as midnight UTC) show the exact same date the author
  // typed, regardless of the reader's local timezone.
  return date.toLocaleDateString('en-US', {
    month,
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function nonNullable<T>(x: T | null): x is NonNullable<T> {
  return x !== null
}
