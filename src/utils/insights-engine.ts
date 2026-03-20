import { timeToMinutes } from './date'
import type { SleepLogWithMetrics, Insight } from '../types'

export function generateInsights(currentLogs: SleepLogWithMetrics[], previousLogs: SleepLogWithMetrics[]): Insight[] {
  const insights: Insight[] = []
  if (currentLogs.length === 0) return insights

  const lowSeDays = countConsecutiveLowSe(currentLogs, 80)
  if (lowSeDays >= 5) {
    insights.push({ id: 'low_se_streak', type: 'low_se_streak', message: `Sleep efficiency below 80% for ${lowSeDays} consecutive days.`, severity: 'warning' })
  }

  if (previousLogs.length >= 3 && currentLogs.length >= 3) {
    const prevAvgWake = avgWakeMinutes(previousLogs)
    const currAvgWake = avgWakeMinutes(currentLogs)
    const diff = currAvgWake - prevAvgWake
    if (diff < -15) {
      insights.push({ id: 'wake_time_shift', type: 'wake_time_shift', message: `Wake time shifted ${Math.abs(Math.round(diff))} min earlier vs. previous period.`, severity: 'info' })
    } else if (diff > 15) {
      insights.push({ id: 'wake_time_shift', type: 'wake_time_shift', message: `Wake time shifted ${Math.round(diff)} min later vs. previous period.`, severity: 'info' })
    }
  }

  return insights
}

function countConsecutiveLowSe(logs: SleepLogWithMetrics[], threshold: number): number {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  let count = 0
  for (const log of sorted) {
    if (log.metrics.se < threshold) count++
    else break
  }
  return count
}

function avgWakeMinutes(logs: SleepLogWithMetrics[]): number {
  const total = logs.reduce((sum, l) => sum + timeToMinutes(l.wakeTime), 0)
  return total / logs.length
}
