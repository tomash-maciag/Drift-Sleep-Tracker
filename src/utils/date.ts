export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function sleepDurationMinutes(start: string, end: string): number {
  const startMin = timeToMinutes(start)
  const endMin = timeToMinutes(end)
  if (endMin >= startMin) {
    return endMin - startMin
  }
  return 1440 - startMin + endMin
}

export function formatMinutesAsHM(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function isSunday(date: string): boolean {
  return new Date(date + 'T12:00:00').getDay() === 0
}

export function todayDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
