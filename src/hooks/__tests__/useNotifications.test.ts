import { describe, it, expect } from 'vitest'
import { getNextNotificationTime, shouldShowMissedDayNudge } from '../useNotifications'

describe('getNextNotificationTime', () => {
  it('returns today if notification time has not passed yet', () => {
    const now = new Date('2026-03-20T06:00:00')
    const result = getNextNotificationTime('07:30', now)
    expect(result.getHours()).toBe(7)
    expect(result.getMinutes()).toBe(30)
    expect(result.getDate()).toBe(20)
  })

  it('returns tomorrow if notification time already passed', () => {
    const now = new Date('2026-03-20T08:00:00')
    const result = getNextNotificationTime('07:30', now)
    expect(result.getHours()).toBe(7)
    expect(result.getMinutes()).toBe(30)
    expect(result.getDate()).toBe(21)
  })
})

describe('shouldShowMissedDayNudge', () => {
  it('returns true if no log for today and it is evening', () => {
    expect(shouldShowMissedDayNudge(false, 20)).toBe(true)
  })

  it('returns false if log exists for today', () => {
    expect(shouldShowMissedDayNudge(true, 20)).toBe(false)
  })

  it('returns false if it is not evening yet', () => {
    expect(shouldShowMissedDayNudge(false, 14)).toBe(false)
  })
})
