import { db } from '../db'
import { generateId, now } from '../utils/uuid'
import type { SleepLog } from '../types'

type SleepLogInput = Omit<SleepLog, 'id' | 'date' | 'createdAt' | 'updatedAt' | 'syncedAt'>

export async function createSleepLog(date: string, input: SleepLogInput): Promise<SleepLog> {
  const timestamp = now()
  const log: SleepLog = { ...input, id: generateId(), date, createdAt: timestamp, updatedAt: timestamp, syncedAt: null }
  await db.sleepLogs.add(log)
  return log
}

export async function updateSleepLog(id: string, changes: Partial<SleepLogInput>): Promise<SleepLog> {
  const timestamp = now()
  await db.sleepLogs.update(id, { ...changes, updatedAt: timestamp })
  const updated = await db.sleepLogs.get(id)
  if (!updated) throw new Error(`SleepLog ${id} not found`)
  return updated
}

export async function getSleepLogByDate(date: string): Promise<SleepLog | null> {
  const log = await db.sleepLogs.where('date').equals(date).first()
  return log ?? null
}

export async function getSleepLogsInRange(startDate: string, endDate: string): Promise<SleepLog[]> {
  return db.sleepLogs.where('date').between(startDate, endDate, true, true).sortBy('date')
}

export async function getAllSleepLogs(): Promise<SleepLog[]> {
  return db.sleepLogs.orderBy('date').reverse().toArray()
}

export async function deleteSleepLog(id: string): Promise<void> {
  await db.sleepLogs.delete(id)
}

export async function getStreakCount(referenceDate: string): Promise<number> {
  const refLog = await getSleepLogByDate(referenceDate)
  if (!refLog) return 0
  let streak = 1
  let currentDate = new Date(referenceDate + 'T12:00:00')
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1)
    const dateStr = currentDate.toISOString().slice(0, 10)
    const log = await getSleepLogByDate(dateStr)
    if (!log) break
    streak++
  }
  return streak
}
