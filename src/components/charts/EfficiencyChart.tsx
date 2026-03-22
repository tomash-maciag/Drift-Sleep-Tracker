import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts'
import { useSleepLogsLive } from '../../hooks/reactive'
import { todayDate } from '../../utils/date'
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
  const first = logs[0].date.slice(5)
  return `W${first}`
}

interface EfficiencyChartProps {
  days: 7 | 14 | 30
}

export function EfficiencyChart({ days }: EfficiencyChartProps) {
  const today = todayDate()
  const startDate = offsetDate(today, -days + 1)
  const rawLogs = useSleepLogsLive(startDate, today)

  if (rawLogs.length === 0) return null

  const logs: SleepLogWithMetrics[] = rawLogs.map(log => ({
    ...log,
    metrics: computeSleepMetrics(log),
  }))

  const isWeekly = days === 30

  const data = isWeekly
    ? aggregateWeekly(logs).map((week) => ({
        date: weekLabel(week),
        se: Math.round(week.reduce((sum, l) => sum + l.metrics.se, 0) / week.length * 10) / 10,
      }))
    : logs.map((log) => ({
        date: new Date(log.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).toUpperCase(),
        se: Math.round(log.metrics.se * 10) / 10,
      }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="seGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d96634" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#d96634" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#858178' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[60, 100]}
          ticks={[60, 70, 80, 85, 90, 100]}
          tick={{ fontSize: 9, fill: '#858178' }}
          axisLine={false}
          tickLine={false}
          width={32}
          tickFormatter={(v: number) => `${v}%`}
        />
        <ReferenceLine y={85} stroke="#d96634" strokeOpacity={0.8} strokeDasharray="4 3" strokeWidth={1} />
        <Tooltip
          formatter={(value) => [`${value}%`, 'SE']}
          contentStyle={{
            background: 'rgba(44, 46, 37, 0.9)',
            border: '1px solid rgba(77,74,67,0.2)',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#f9f6f2',
            backdropFilter: 'blur(20px)',
          }}
        />
        <Area
          type="monotone"
          dataKey="se"
          stroke="#d96634"
          strokeWidth={2}
          strokeLinejoin="round"
          fill="url(#seGrad2)"
          dot={false}
          activeDot={{ r: 3, fill: '#f9f6f2', stroke: 'none' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
