import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { SleepLogWithMetrics } from '../../types'
import type { Theme } from '../themes'
import { timeToMinutes } from '../../utils/date'

interface Props {
  logs: SleepLogWithMetrics[]
  theme: Theme
}

export function SleepTimeline({ logs, theme }: Props) {
  const data = logs.map((log) => {
    const bedMin = timeToMinutes(log.bedtime)
    const wakeMin = timeToMinutes(log.wakeTime)
    // Normalize: if bedtime is before midnight, offset to negative for display
    const normBed = bedMin >= 720 ? bedMin - 1440 : bedMin
    const normWake = wakeMin >= 720 ? wakeMin - 1440 : wakeMin

    return {
      date: log.date.slice(5), // MM-DD
      bed: normBed,
      range: [normBed, normWake],
      quality: log.sleepQuality,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={logs.length * 22 + 30}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
        <XAxis
          type="number"
          domain={[-120, 480]}
          tickFormatter={(v: number) => {
            const mins = ((v % 1440) + 1440) % 1440
            const h = Math.floor(mins / 60)
            return `${h}:00`
          }}
          ticks={[-60, 0, 60, 120, 180, 240, 300, 360, 420, 480]}
          tick={{ fontSize: 10, fill: theme.chartColors.text }}
          axisLine={{ stroke: theme.chartColors.grid }}
          tickLine={{ stroke: theme.chartColors.grid }}
        />
        <YAxis
          type="category"
          dataKey="date"
          width={42}
          tick={{ fontSize: 10, fill: theme.chartColors.text }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine x={0} stroke={theme.chartColors.grid} strokeDasharray="3 3" />
        <Bar dataKey="range" radius={[3, 3, 3, 3]} barSize={14}>
          {data.map((entry, index) => (
            <Cell key={index} fill={theme.chartColors.quality(entry.quality)} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
