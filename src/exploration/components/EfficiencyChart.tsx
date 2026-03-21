import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts'
import type { SleepLogWithMetrics } from '../../types'
import type { Theme } from '../themes'

interface Props {
  logs: SleepLogWithMetrics[]
  theme: Theme
}

export function EfficiencyChart({ logs, theme }: Props) {
  const data = logs.map((log) => ({
    date: log.date.slice(5),
    se: Math.round(log.metrics.se * 10) / 10,
  }))

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
          domain={[50, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 10, fill: theme.chartColors.text }}
          axisLine={false}
          tickLine={false}
          width={38}
        />
        <ReferenceLine
          y={85}
          stroke={theme.chartColors.reference}
          strokeDasharray="6 3"
          strokeWidth={1.5}
          label={{
            value: '85%',
            position: 'right',
            fill: theme.chartColors.reference,
            fontSize: 10,
          }}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, 'SE']}
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
          dataKey="se"
          stroke={theme.chartColors.line}
          strokeWidth={2}
          dot={{ r: 3, fill: theme.chartColors.line }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
