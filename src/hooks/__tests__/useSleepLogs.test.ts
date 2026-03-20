import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { createSleepLog, updateSleepLog, getSleepLogByDate, getSleepLogsInRange, getStreakCount } from '../useSleepLogs'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

const baseSleepLog = {
  bedtime: '23:00', sleepOnset: '23:30', wakeTime: '06:00', outOfBedTime: '06:30',
  alarmWake: false, sleepQuality: 7, grogginess: 3, wakeUpMinutes: 15, awakenings: 1,
  lightTherapyStart: null, lightTherapyEnd: null, lightTherapyIntensity: null,
  tags: [], note: null, experimentCondition: null,
  weeklyStress: null, weeklyActivity: null, weeklyInflammation: null, weeklyRating: null,
}

describe('createSleepLog', () => {
  it('creates a log and returns it with UUID and timestamps', async () => {
    const log = await createSleepLog('2026-03-20', baseSleepLog)
    expect(log.id).toBeDefined()
    expect(log.date).toBe('2026-03-20')
    expect(log.createdAt).toBeDefined()
    expect(log.syncedAt).toBeNull()
  })
  it('rejects duplicate dates', async () => {
    await createSleepLog('2026-03-20', baseSleepLog)
    await expect(createSleepLog('2026-03-20', baseSleepLog)).rejects.toThrow()
  })
})

describe('updateSleepLog', () => {
  it('updates fields and bumps updatedAt', async () => {
    const log = await createSleepLog('2026-03-20', baseSleepLog)
    const originalUpdatedAt = log.updatedAt
    await new Promise((r) => setTimeout(r, 10))
    const updated = await updateSleepLog(log.id, { sleepQuality: 9 })
    expect(updated.sleepQuality).toBe(9)
    expect(updated.updatedAt).not.toBe(originalUpdatedAt)
  })
})

describe('getSleepLogByDate', () => {
  it('returns log for a specific date', async () => {
    await createSleepLog('2026-03-20', baseSleepLog)
    const log = await getSleepLogByDate('2026-03-20')
    expect(log).not.toBeNull()
    expect(log!.date).toBe('2026-03-20')
  })
  it('returns null for missing date', async () => {
    const log = await getSleepLogByDate('2026-01-01')
    expect(log).toBeNull()
  })
})

describe('getSleepLogsInRange', () => {
  it('returns logs within date range', async () => {
    await createSleepLog('2026-03-18', baseSleepLog)
    await createSleepLog('2026-03-19', baseSleepLog)
    await createSleepLog('2026-03-20', baseSleepLog)
    await createSleepLog('2026-03-21', baseSleepLog)
    const logs = await getSleepLogsInRange('2026-03-19', '2026-03-20')
    expect(logs.length).toBe(2)
  })
})

describe('getStreakCount', () => {
  it('counts consecutive days ending today', async () => {
    await createSleepLog('2026-03-18', baseSleepLog)
    await createSleepLog('2026-03-19', baseSleepLog)
    await createSleepLog('2026-03-20', baseSleepLog)
    const streak = await getStreakCount('2026-03-20')
    expect(streak).toBe(3)
  })
  it('returns 0 if no log for the reference date', async () => {
    await createSleepLog('2026-03-19', baseSleepLog)
    const streak = await getStreakCount('2026-03-20')
    expect(streak).toBe(0)
  })
  it('breaks streak on gap', async () => {
    await createSleepLog('2026-03-17', baseSleepLog)
    await createSleepLog('2026-03-19', baseSleepLog)
    await createSleepLog('2026-03-20', baseSleepLog)
    const streak = await getStreakCount('2026-03-20')
    expect(streak).toBe(2)
  })
})
