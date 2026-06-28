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

export function timeAgo(timestamp: string | Date) {
  const now = Date.now()
  const date = new Date(timestamp).getTime()
  const diffMs = now - date

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  if (months === 1) return '1 month ago'
  if (months < 12) return `${months} months ago`
  if (years === 1) return '1 year ago'
  return `${years} years ago`
}
