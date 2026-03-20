import { describe, it, expect } from 'vitest'
import {
  timeToMinutes,
  minutesToTime,
  sleepDurationMinutes,
  formatMinutesAsHM,
  isSunday,
  todayDate,
} from '../date'

describe('timeToMinutes', () => {
  it('converts HH:MM to minutes from midnight', () => {
    expect(timeToMinutes('00:00')).toBe(0)
    expect(timeToMinutes('06:30')).toBe(390)
    expect(timeToMinutes('23:45')).toBe(1425)
  })
})

describe('minutesToTime', () => {
  it('converts minutes to HH:MM', () => {
    expect(minutesToTime(0)).toBe('00:00')
    expect(minutesToTime(390)).toBe('06:30')
    expect(minutesToTime(1425)).toBe('23:45')
  })

  it('wraps past 24 hours', () => {
    expect(minutesToTime(1500)).toBe('01:00')
  })
})

describe('sleepDurationMinutes', () => {
  it('calculates duration within same day', () => {
    expect(sleepDurationMinutes('01:00', '07:00')).toBe(360)
  })

  it('calculates duration spanning midnight', () => {
    expect(sleepDurationMinutes('23:00', '06:00')).toBe(420)
  })

  it('calculates duration when start and end are same', () => {
    expect(sleepDurationMinutes('05:00', '05:00')).toBe(0)
  })

  it('handles 15-minute precision', () => {
    expect(sleepDurationMinutes('23:45', '05:30')).toBe(345)
  })
})

describe('formatMinutesAsHM', () => {
  it('formats minutes as Xh Ym', () => {
    expect(formatMinutesAsHM(420)).toBe('7h 0m')
    expect(formatMinutesAsHM(345)).toBe('5h 45m')
    expect(formatMinutesAsHM(90)).toBe('1h 30m')
    expect(formatMinutesAsHM(45)).toBe('0h 45m')
  })
})

describe('isSunday', () => {
  it('returns true for a Sunday date', () => {
    expect(isSunday('2026-03-22')).toBe(true)
  })

  it('returns false for a non-Sunday date', () => {
    expect(isSunday('2026-03-20')).toBe(false)
  })
})

describe('todayDate', () => {
  it('returns date in YYYY-MM-DD format', () => {
    expect(todayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
