import type { SleepLogWithMetrics, KPI, Insight } from '../types'
import { computeSleepMetrics } from '../utils/sleep-math'

function makeLog(
  date: string,
  bedtime: string,
  sleepOnset: string,
  wakeTime: string,
  outOfBedTime: string,
  quality: number,
  tags: string[] = []
): SleepLogWithMetrics {
  const metrics = computeSleepMetrics({ bedtime, sleepOnset, wakeTime, outOfBedTime })
  return {
    id: date,
    date,
    bedtime,
    sleepOnset,
    wakeTime,
    outOfBedTime,
    alarmWake: false,
    sleepQuality: quality,
    grogginess: Math.round(10 - quality),
    wakeUpMinutes: Math.round(15 + (10 - quality) * 3),
    awakenings: quality < 5 ? 2 : quality < 7 ? 1 : 0,
    lightTherapyStart: '19:30',
    lightTherapyEnd: '20:30',
    lightTherapyIntensity: '30cm',
    tags,
    note: null,
    experimentCondition: null,
    weeklyStress: null,
    weeklyActivity: null,
    weeklyInflammation: null,
    weeklyRating: null,
    createdAt: '',
    updatedAt: '',
    syncedAt: null,
    metrics,
  }
}

export const mockLogs: SleepLogWithMetrics[] = [
  // Week 1 (Feb 19–25) — rough period
  makeLog('2026-02-19', '23:30', '00:00', '04:15', '05:00', 3, ['stress']),
  makeLog('2026-02-20', '23:15', '23:45', '04:30', '05:15', 4),
  makeLog('2026-02-21', '23:30', '00:00', '04:45', '05:30', 4, ['alcohol']),
  makeLog('2026-02-22', '23:00', '23:30', '04:30', '05:15', 3),
  makeLog('2026-02-23', '23:15', '23:45', '05:00', '05:30', 5),
  makeLog('2026-02-24', '23:00', '23:30', '05:00', '05:45', 5),
  makeLog('2026-02-25', '23:00', '23:15', '05:15', '05:45', 5, ['exercise']),
  // Week 2 (Feb 26–Mar 4) — improving
  makeLog('2026-02-26', '23:15', '23:30', '05:00', '05:30', 5),
  makeLog('2026-02-27', '23:00', '23:15', '05:15', '05:45', 5, ['stress']),
  makeLog('2026-02-28', '23:00', '23:30', '05:00', '05:45', 5),
  makeLog('2026-03-01', '23:00', '23:15', '05:30', '06:00', 6),
  makeLog('2026-03-02', '23:15', '23:30', '05:15', '06:00', 5),
  makeLog('2026-03-03', '23:00', '23:15', '05:30', '06:00', 6),
  makeLog('2026-03-04', '23:00', '23:15', '05:45', '06:15', 6, ['exercise']),
  // Week 3 (Mar 5–11) — stabilizing
  makeLog('2026-03-05', '23:15', '23:45', '04:30', '05:15', 4, ['stress']),
  makeLog('2026-03-06', '23:00', '23:30', '05:00', '05:45', 5),
  makeLog('2026-03-07', '23:15', '23:45', '04:30', '05:15', 4, ['stress']),
  makeLog('2026-03-08', '23:00', '23:30', '05:00', '05:45', 5),
  makeLog('2026-03-09', '23:30', '00:00', '05:15', '06:00', 5, ['alcohol']),
  makeLog('2026-03-10', '23:00', '23:15', '05:30', '06:00', 6),
  makeLog('2026-03-11', '23:15', '23:30', '05:45', '06:15', 6),
  // Week 4 (Mar 12–20) — good trend
  makeLog('2026-03-12', '23:00', '23:15', '06:00', '06:30', 7),
  makeLog('2026-03-13', '23:00', '23:15', '05:30', '06:15', 6, ['exercise']),
  makeLog('2026-03-14', '23:15', '23:30', '05:00', '05:30', 5, ['stress']),
  makeLog('2026-03-15', '23:00', '23:15', '05:45', '06:15', 7),
  makeLog('2026-03-16', '23:00', '23:15', '06:00', '06:30', 7),
  makeLog('2026-03-17', '22:45', '23:00', '06:15', '06:45', 8),
  makeLog('2026-03-18', '23:00', '23:15', '06:00', '06:30', 7, ['late coffee']),
  makeLog('2026-03-19', '23:00', '23:15', '06:15', '06:45', 8),
  makeLog('2026-03-20', '23:00', '23:10', '06:30', '07:00', 8),
]

export const mockKPI: KPI = {
  avgTst: 398,
  avgWakeTime: 348,
  avgSe: 88.2,
  trend: 'up',
}

export const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'wake_time_shift',
    message: 'Wake time shifted 25 min later vs. previous week — positive trend.',
    severity: 'info',
  },
  {
    id: '2',
    type: 'quality_improving',
    message: 'Average sleep quality improved from 5.3 to 7.4 over last 7 days.',
    severity: 'info',
  },
]

export const streakCount = 14
