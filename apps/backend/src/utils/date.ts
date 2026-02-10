export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getEndOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getStartOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getStartOfYear(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 0, 1)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00.000Z')
}
