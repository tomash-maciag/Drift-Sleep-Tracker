import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { createSleepLog } from '../useSleepLogs'
import { createExperiment, archiveExperiment, computeExperimentComparison } from '../useExperiments'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

const baseLog = {
  bedtime: '23:00', sleepOnset: '23:15', outOfBedTime: '06:30',
  alarmWake: false, grogginess: 3, wakeUpMinutes: 15, awakenings: 0,
  lightTherapyStart: null, lightTherapyEnd: null, lightTherapyIntensity: null,
  tags: [], note: null,
  weeklyStress: null, weeklyActivity: null, weeklyInflammation: null, weeklyRating: null,
}

describe('createExperiment', () => {
  it('creates an active experiment', async () => {
    const exp = await createExperiment('Light timing', 'Light 19:30', 'Light 20:30', '2026-03-20')
    expect(exp.status).toBe('active')
    expect(exp.conditionA).toBe('Light 19:30')
  })
  it('rejects if another experiment is active', async () => {
    await createExperiment('Exp 1', 'A', 'B', '2026-03-20')
    await expect(createExperiment('Exp 2', 'C', 'D', '2026-03-20')).rejects.toThrow()
  })
})

describe('archiveExperiment', () => {
  it('sets status to archived with end date and notes', async () => {
    const exp = await createExperiment('Test', 'A', 'B', '2026-03-15')
    const archived = await archiveExperiment(exp.id, '2026-03-20', 'Condition A was better')
    expect(archived.status).toBe('archived')
    expect(archived.endDate).toBe('2026-03-20')
    expect(archived.notes).toBe('Condition A was better')
  })
})

describe('computeExperimentComparison', () => {
  it('computes stats for both conditions', async () => {
    const exp = await createExperiment('Test', 'A', 'B', '2026-03-14')
    await createSleepLog('2026-03-14', { ...baseLog, wakeTime: '05:30', sleepQuality: 6, experimentCondition: 'A' })
    await createSleepLog('2026-03-15', { ...baseLog, wakeTime: '06:00', sleepQuality: 7, experimentCondition: 'A' })
    await createSleepLog('2026-03-16', { ...baseLog, wakeTime: '06:30', sleepQuality: 8, experimentCondition: 'B' })
    await createSleepLog('2026-03-17', { ...baseLog, wakeTime: '07:00', sleepQuality: 9, experimentCondition: 'B' })
    const comparison = await computeExperimentComparison(exp.id)
    expect(comparison.conditionA.dayCount).toBe(2)
    expect(comparison.conditionB.dayCount).toBe(2)
    expect(comparison.conditionA.avgQuality).toBe(6.5)
    expect(comparison.conditionB.avgQuality).toBe(8.5)
  })
})
