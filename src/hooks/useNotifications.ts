export function getNextNotificationTime(timeStr: string, now: Date = new Date()): Date {
  const [h, m] = timeStr.split(':').map(Number)
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }
  return target
}

export function shouldShowMissedDayNudge(hasLoggedToday: boolean, currentHour: number): boolean {
  return !hasLoggedToday && currentHour >= 18
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleNotification(title: string, body: string, atTime: Date): number {
  const delay = atTime.getTime() - Date.now()
  if (delay <= 0) return -1
  return window.setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png' })
    }
  }, delay) as unknown as number
}
