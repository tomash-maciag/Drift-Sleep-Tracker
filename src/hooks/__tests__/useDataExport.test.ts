import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { seedDefaults } from '../../db/seed'
import { createSleepLog } from '../useSleepLogs'
import { addMedication } from '../useMedications'
import { exportAllData, importAllData } from '../useDataExport'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

const baseLog = {
  bedtime: '23:00', sleepOnset: '23:15', wakeTime: '06:00', outOfBedTime: '06:30',
  alarmWake: false, sleepQuality: 7, grogginess: 3, wakeUpMinutes: 15, awakenings: 0, awakeningTime: null, awakeningDuration: null,
  lightTherapyStart: null, lightTherapyEnd: null, lightTherapyIntensity: null,
  tags: [], medicationsTaken: [], note: null, experimentCondition: null,
  weeklyStress: null, weeklyActivity: null, weeklyInflammation: null, weeklyRating: null,
}

describe('exportAllData', () => {
  it('exports all tables as JSON', async () => {
    await seedDefaults()
    await createSleepLog('2026-03-20', baseLog)
    await addMedication('Trazodon', '50mg')
    const data = await exportAllData()
    expect(data.version).toBe('1.0')
    expect(data.sleepLogs.length).toBe(1)
    expect(data.medications.length).toBe(1)
    expect(data.tags.length).toBe(7)
  })
})

describe('importAllData', () => {
  it('restores data from export on clean database', async () => {
    await seedDefaults()
    await createSleepLog('2026-03-20', baseLog)
    const exported = await exportAllData()
    await db.delete()
    await db.open()
    await importAllData(exported)
    const logs = await db.sleepLogs.toArray()
    expect(logs.length).toBe(1)
    expect(logs[0].date).toBe('2026-03-20')
    const tags = await db.tags.toArray()
    expect(tags.length).toBe(7)
  })

  it('upserts by UUID on existing database', async () => {
    await seedDefaults()
    const log = await createSleepLog('2026-03-20', baseLog)
    const exported = await exportAllData()
    exported.sleepLogs[0].sleepQuality = 10
    await importAllData(exported)
    const updated = await db.sleepLogs.get(log.id)
    expect(updated!.sleepQuality).toBe(10)
    const all = await db.sleepLogs.toArray()
    expect(all.length).toBe(1)
  })
})
