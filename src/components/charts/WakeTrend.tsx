import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { useSleepLogsLive, useSettingLive } from '../../hooks/reactive'
import { timeToMinutes, todayDate } from '../../utils/date'
import { computeSleepMetrics } from '../../utils/sleep-math'
import type { SleepLogWithMetrics } from '../../types'

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function aggregateWeekly(logs: SleepLogWithMetrics[]) {
  const weeks: SleepLogWithMetrics[][] = []
  let currentWeek: SleepLogWithMetrics[] = []

  for (let i = 0; i < logs.length; i++) {
    currentWeek.push(logs[i])
    if (currentWeek.length === 7 || i === logs.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  return weeks
}

function weekLabel(logs: SleepLogWithMetrics[]): string {
  const first = logs[0].date.slice(5) // MM-DD
  return `W${first}`
}

interface WakeTrendProps {
  days: 7 | 14 | 30
}

export function WakeTrend({ days }: WakeTrendProps) {
  const today = todayDate()
  const startDate = offsetDate(today, -days + 1)
  const rawLogs = useSleepLogsLive(startDate, today)
  const targetWake = useSettingLive<string>('sleepWindowEnd', '06:00')

  if (rawLogs.length === 0) return null

  const logs: SleepLogWithMetrics[] = rawLogs.map(log => ({
    ...log,
    metrics: computeSleepMetrics(log),
  }))

  const isWeekly = days === 30

  const data = isWeekly
    ? aggregateWeekly(logs).map((week) => ({
        date: weekLabel(week),
        wake: Math.round(week.reduce((sum, l) => sum + timeToMinutes(l.wakeTime), 0) / week.length),
      }))
    : logs.map((log) => ({
        date: new Date(log.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).toUpperCase(),
        wake: timeToMinutes(log.wakeTime),
      }))

  const lastIndex = data.length - 1
  const barWidth = isWeekly ? 36 : 24
  const targetMin = timeToMinutes(targetWake ?? '06:00')

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <YAxis domain={['dataMin - 30', 'dataMax + 15']} hide />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#858178' }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine
          y={targetMin}
          stroke="#d96634"
          strokeOpacity={0.8}
          strokeDasharray="4 3"
          strokeWidth={1}
        />
        <Bar dataKey="wake" radius={[4, 4, 0, 0]} barSize={barWidth}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === lastIndex ? '#d96634' : '#3d3e34'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
