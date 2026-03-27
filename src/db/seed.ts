import { db } from './index'
import { generateId, now } from '../utils/uuid'
import type { SleepLog } from '../types'

const DEFAULT_TAGS = [
  'stress',
  'alcohol',
  'illness',
  'travel',
  'late coffee',
  'exercise',
  'stomach discomfort',
]

const HISTORY_DATA: Array<{ date: string; bedtime: string; sleepOnset: string; wakeTime: string; outOfBedTime: string }> = [
  { date: '2026-02-25', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '04:30', outOfBedTime: '06:00' },
  { date: '2026-02-26', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:00', outOfBedTime: '06:00' },
  { date: '2026-02-27', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '05:00', outOfBedTime: '06:00' },
  { date: '2026-02-28', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '05:30', outOfBedTime: '06:30' },
  { date: '2026-03-01', bedtime: '01:00', sleepOnset: '01:15', wakeTime: '08:30', outOfBedTime: '08:30' },
  { date: '2026-03-02', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '07:00', outOfBedTime: '07:00' },
  { date: '2026-03-03', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '06:00', outOfBedTime: '06:00' },
  { date: '2026-03-04', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '06:30', outOfBedTime: '06:30' },
  { date: '2026-03-05', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '06:30', outOfBedTime: '06:30' },
  { date: '2026-03-06', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '05:45', outOfBedTime: '06:15' },
  { date: '2026-03-07', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '06:30', outOfBedTime: '08:00' },
  { date: '2026-03-08', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:30', outOfBedTime: '08:00' },
  { date: '2026-03-09', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:00', outOfBedTime: '06:30' },
  { date: '2026-03-10', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:00', outOfBedTime: '06:30' },
  { date: '2026-03-11', bedtime: '00:30', sleepOnset: '00:45', wakeTime: '05:45', outOfBedTime: '06:30' },
  { date: '2026-03-12', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:15', outOfBedTime: '06:15' },
  { date: '2026-03-13', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '05:15', outOfBedTime: '05:30' },
  { date: '2026-03-14', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:30', outOfBedTime: '06:30' },
  { date: '2026-03-15', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:45', outOfBedTime: '07:00' },
  { date: '2026-03-16', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:00', outOfBedTime: '08:00' },
  { date: '2026-03-17', bedtime: '00:00', sleepOnset: '00:15', wakeTime: '06:00', outOfBedTime: '08:00' },
  { date: '2026-03-18', bedtime: '23:00', sleepOnset: '23:15', wakeTime: '06:00', outOfBedTime: '06:30' },
  { date: '2026-03-19', bedtime: '23:00', sleepOnset: '23:15', wakeTime: '06:00', outOfBedTime: '06:30' },
  { date: '2026-03-20', bedtime: '00:15', sleepOnset: '00:30', wakeTime: '06:00', outOfBedTime: '06:30' },
]

export async function seedDefaults(): Promise<void> {
  const timestamp = now()

  // Seed tags
  const existingTags = await db.tags.count()
  if (existingTags === 0) {
    const tags = DEFAULT_TAGS.map((label) => ({
      id: generateId(),
      label,
      isDefault: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      syncedAt: null,
    }))
    await db.tags.bulkAdd(tags)
  }

  // Seed historical sleep data
  const existingLogs = await db.sleepLogs.count()
  if (existingLogs === 0) {
    const logs: SleepLog[] = HISTORY_DATA.map((entry) => ({
      id: generateId(),
      date: entry.date,
      bedtime: entry.bedtime,
      sleepOnset: entry.sleepOnset,
      wakeTime: entry.wakeTime,
      outOfBedTime: entry.outOfBedTime,
      alarmWake: false,
      sleepQuality: 5,
      grogginess: 5,
      wakeUpMinutes: 20,
      awakenings: 0,
      awakeningTime: null,
      awakeningDuration: null,
      lightTherapyStart: null,
      lightTherapyEnd: null,
      lightTherapyIntensity: null,
      tags: [],
      note: null,
      experimentCondition: null,
      weeklyStress: null,
      weeklyActivity: null,
      weeklyInflammation: null,
      weeklyRating: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      syncedAt: null,
    }))
    await db.sleepLogs.bulkAdd(logs)
  }
}
