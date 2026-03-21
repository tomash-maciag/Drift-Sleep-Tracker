import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { SleepLogWithMetrics } from '../../types'
import type { Theme } from '../themes'
import { timeToMinutes } from '../../utils/date'

interface Props {
  logs: SleepLogWithMetrics[]
  theme: Theme
}

export function WakeTimeTrend({ logs, theme }: Props) {
  const data = logs.map((log, i) => {
    const wakeMin = timeToMinutes(log.wakeTime)
    // Calculate 7-day moving average
    const windowStart = Math.max(0, i - 6)
    const window = logs.slice(windowStart, i + 1)
    const ma = window.reduce((sum, l) => sum + timeToMinutes(l.wakeTime), 0) / window.length

    return {
      date: log.date.slice(5),
      wake: wakeMin,
      ma: Math.round(ma),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: theme.chartColors.text }}
          axisLine={{ stroke: theme.chartColors.grid }}
          tickLine={false}
        />
        <YAxis
          domain={['dataMin - 30', 'dataMax + 30']}
          tickFormatter={(v: number) => {
            const h = Math.floor(v / 60)
            const m = v % 60
            return `${h}:${String(m).padStart(2, '0')}`
          }}
          tick={{ fontSize: 10, fill: theme.chartColors.text }}
          axisLine={false}
          tickLine={false}
          width={38}
        />
        <Tooltip
          formatter={(value) => {
            const v = Number(value)
            const h = Math.floor(v / 60)
            const m = v % 60
            return `${h}:${String(m).padStart(2, '0')}`
          }}
          contentStyle={{
            background: theme.vars['--bg-card'],
            border: `1px solid ${theme.vars['--border']}`,
            borderRadius: theme.vars['--radius'],
            fontSize: '12px',
            color: theme.vars['--text-heading'],
          }}
        />
        <Line
          type="monotone"
          dataKey="wake"
          stroke={theme.chartColors.line}
          strokeWidth={2}
          dot={{ r: 3, fill: theme.chartColors.line }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="ma"
          stroke={theme.chartColors.lineMA}
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
