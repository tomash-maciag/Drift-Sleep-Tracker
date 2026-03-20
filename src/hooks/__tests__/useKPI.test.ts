import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { createSleepLog } from '../useSleepLogs'
import { computeKPI } from '../useKPI'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

const makeLog = (date: string, wakeTime: string, quality: number) => ({
  bedtime: '23:00', sleepOnset: '23:15', wakeTime, outOfBedTime: wakeTime,
  alarmWake: false, sleepQuality: quality, grogginess: 3, wakeUpMinutes: 15, awakenings: 0,
  lightTherapyStart: null, lightTherapyEnd: null, lightTherapyIntensity: null,
  tags: [], note: null, experimentCondition: null,
  weeklyStress: null, weeklyActivity: null, weeklyInflammation: null, weeklyRating: null,
})

describe('computeKPI', () => {
  it('returns null KPIs when no data', async () => {
    const kpi = await computeKPI('2026-03-20', 7)
    expect(kpi.avgTst).toBeNull()
    expect(kpi.avgWakeTime).toBeNull()
    expect(kpi.avgSe).toBeNull()
    expect(kpi.trend).toBeNull()
  })

  it('computes averages for 7-day window', async () => {
    for (let i = 14; i <= 20; i++) {
      await createSleepLog(`2026-03-${i}`, makeLog(`2026-03-${i}`, '06:00', 7))
    }
    const kpi = await computeKPI('2026-03-20', 7)
    expect(kpi.avgTst).toBeCloseTo(405)
    expect(kpi.avgWakeTime).toBeCloseTo(360)
    expect(kpi.avgSe).toBeCloseTo(96.43, 0)
  })

  it('computes trend as stable when previous period is similar', async () => {
    for (let i = 7; i <= 20; i++) {
      const d = String(i).padStart(2, '0')
      await createSleepLog(`2026-03-${d}`, makeLog(`2026-03-${d}`, '06:00', 7))
    }
    const kpi = await computeKPI('2026-03-20', 7)
    expect(kpi.trend).toBe('stable')
  })
})
