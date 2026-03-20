import { db } from '../db'
import { computeSleepMetrics } from '../utils/sleep-math'
import { timeToMinutes } from '../utils/date'
import type { KPI, SleepLog } from '../types'

export async function computeKPI(referenceDate: string, days: number): Promise<KPI> {
  const endDate = referenceDate
  const startDate = offsetDate(referenceDate, -days + 1)
  const prevStartDate = offsetDate(startDate, -days)
  const prevEndDate = offsetDate(startDate, -1)

  const currentLogs = await db.sleepLogs.where('date').between(startDate, endDate, true, true).toArray()
  if (currentLogs.length === 0) {
    return { avgTst: null, avgWakeTime: null, avgSe: null, trend: null }
  }

  const currentAvg = computeAverages(currentLogs)
  const prevLogs = await db.sleepLogs.where('date').between(prevStartDate, prevEndDate, true, true).toArray()

  let trend: KPI['trend'] = null
  if (prevLogs.length > 0) {
    const prevAvg = computeAverages(prevLogs)
    const diff = currentAvg.avgTst - prevAvg.avgTst
    if (diff > 15) trend = 'up'
    else if (diff < -15) trend = 'down'
    else trend = 'stable'
  }

  return { avgTst: currentAvg.avgTst, avgWakeTime: currentAvg.avgWakeTime, avgSe: currentAvg.avgSe, trend }
}

function computeAverages(logs: SleepLog[]) {
  let totalTst = 0, totalSe = 0, totalWakeMin = 0
  for (const log of logs) {
    const metrics = computeSleepMetrics({ bedtime: log.bedtime, sleepOnset: log.sleepOnset, wakeTime: log.wakeTime, outOfBedTime: log.outOfBedTime })
    totalTst += metrics.tst
    totalSe += metrics.se
    totalWakeMin += timeToMinutes(log.wakeTime)
  }
  return { avgTst: totalTst / logs.length, avgWakeTime: totalWakeMin / logs.length, avgSe: totalSe / logs.length }
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
