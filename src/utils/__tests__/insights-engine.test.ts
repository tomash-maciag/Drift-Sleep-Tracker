import { describe, it, expect } from 'vitest'
import { generateInsights } from '../insights-engine'
import type { SleepLogWithMetrics } from '../../types'

const makeLog = (date: string, se: number, wakeTime: string, quality: number): SleepLogWithMetrics => ({
  id: date, date, bedtime: '23:00', sleepOnset: '23:15', wakeTime, outOfBedTime: wakeTime,
  alarmWake: false, sleepQuality: quality, grogginess: 3, wakeUpMinutes: 15, awakenings: 0,
  lightTherapyStart: null, lightTherapyEnd: null, lightTherapyIntensity: null,
  tags: [], note: null, experimentCondition: null,
  weeklyStress: null, weeklyActivity: null, weeklyInflammation: null, weeklyRating: null,
  createdAt: '', updatedAt: '', syncedAt: null,
  metrics: { tst: 0, tib: 0, se, sol: 0 },
})

describe('generateInsights', () => {
  it('returns empty array when no data', () => {
    expect(generateInsights([], [])).toEqual([])
  })

  it('detects SE below 80% for 5+ consecutive days', () => {
    const logs = [
      makeLog('2026-03-15', 75, '05:00', 5),
      makeLog('2026-03-16', 70, '05:00', 5),
      makeLog('2026-03-17', 78, '05:00', 5),
      makeLog('2026-03-18', 72, '05:00', 5),
      makeLog('2026-03-19', 65, '05:00', 5),
    ]
    const insights = generateInsights(logs, [])
    expect(insights.some((i) => i.type === 'low_se_streak')).toBe(true)
  })

  it('does NOT flag SE when above 80%', () => {
    const logs = [
      makeLog('2026-03-15', 85, '05:00', 7),
      makeLog('2026-03-16', 88, '05:00', 7),
      makeLog('2026-03-17', 90, '05:00', 7),
      makeLog('2026-03-18', 86, '05:00', 7),
      makeLog('2026-03-19', 92, '05:00', 7),
    ]
    const insights = generateInsights(logs, [])
    expect(insights.some((i) => i.type === 'low_se_streak')).toBe(false)
  })

  it('detects wake time shifting earlier by >15 min vs previous period', () => {
    const prevLogs = Array.from({ length: 7 }, (_, i) => makeLog(`2026-03-0${8 + i}`, 85, '06:30', 7))
    const currentLogs = Array.from({ length: 7 }, (_, i) => makeLog(`2026-03-${15 + i}`, 85, '06:00', 7))
    const insights = generateInsights(currentLogs, prevLogs)
    expect(insights.some((i) => i.type === 'wake_time_shift')).toBe(true)
  })
})
