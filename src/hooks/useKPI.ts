import { db } from '../db'
import { computeSleepMetrics } from '../utils/sleep-math'
import { timeToMinutes } from '../utils/date'
import { getSetting } from './useSettings'
import type { KPI, SleepLog } from '../types'

export async function computeKPI(referenceDate: string, days: number): Promise<KPI> {
  const endDate = referenceDate
  const startDate = offsetDate(referenceDate, -days + 1)

  const currentLogs = await db.sleepLogs.where('date').between(startDate, endDate, true, true).toArray()
  if (currentLogs.length === 0) {
    return { avgTst: null, avgWakeTime: null, avgSe: null, trend: null, wakeConsistency: null, sleepGap: null }
  }

  const currentAvg = computeAverages(currentLogs)

  // Wake consistency: std dev of wake times
  const wakeTimes = currentLogs.map(l => timeToMinutes(l.wakeTime))
  const wakeConsistency = wakeTimes.length >= 2 ? stdDev(wakeTimes) : null

  // Sleep gap: avg TST vs target sleep window duration
  const windowStart = await getSetting<string>('sleepWindowStart') ?? '00:00'
  const windowEnd = await getSetting<string>('sleepWindowEnd') ?? '06:00'
  let targetTst = timeToMinutes(windowEnd) - timeToMinutes(windowStart)
  if (targetTst <= 0) targetTst += 1440
  const sleepGap = Math.round(currentAvg.avgTst - targetTst)

  // Trend (kept for backward compat, based on TST)
  const prevStartDate = offsetDate(startDate, -days)
  const prevEndDate = offsetDate(startDate, -1)
  const prevLogs = await db.sleepLogs.where('date').between(prevStartDate, prevEndDate, true, true).toArray()

  let trend: KPI['trend'] = null
  if (prevLogs.length > 0) {
    const prevAvg = computeAverages(prevLogs)
    const diff = currentAvg.avgTst - prevAvg.avgTst
    if (diff > 15) trend = 'up'
    else if (diff < -15) trend = 'down'
    else trend = 'stable'
  }

  return {
    avgTst: currentAvg.avgTst,
    avgWakeTime: currentAvg.avgWakeTime,
    avgSe: currentAvg.avgSe,
    trend,
    wakeConsistency: wakeConsistency !== null ? Math.round(wakeConsistency) : null,
    sleepGap,
  }
}

function computeAverages(logs: SleepLog[]) {
  let totalTst = 0, totalSe = 0, totalWakeMin = 0
  for (const log of logs) {
    const metrics = computeSleepMetrics({ bedtime: log.bedtime, sleepOnset: log.sleepOnset, wakeTime: log.wakeTime, outOfBedTime: log.outOfBedTime, awakeningDuration: log.awakeningDuration })
    totalTst += metrics.tst
    totalSe += metrics.se
    totalWakeMin += timeToMinutes(log.wakeTime)
  }
  return { avgTst: totalTst / logs.length, avgWakeTime: totalWakeMin / logs.length, avgSe: totalSe / logs.length }
}

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const sqDiffs = values.map(v => (v - mean) ** 2)
  return Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / values.length)
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
