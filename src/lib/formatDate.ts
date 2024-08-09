export function formatDate(dateString: string, weekday = false) {
  let parts = dateString.split('-')
  let hasDay = parts.length > 2

  return new Date(`${dateString}Z`).toLocaleDateString('en-US', {
    weekday: weekday ? 'long' : undefined,
    day: hasDay ? 'numeric' : undefined,
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
