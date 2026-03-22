import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { formatMinutesAsHMRounded, minutesToTimeRounded } from '../../utils/date'
import type { ExperimentComparison } from '../../types'

interface ComparisonChartProps {
  comparison: ExperimentComparison
}

const COLOR_A = '#d96634'
const COLOR_B = '#a39c94'

function formatWakeTime(minutes: number): string {
  return minutesToTimeRounded(minutes)
}

function formatDuration(minutes: number): string {
  return formatMinutesAsHMRounded(minutes)
}

interface MetricTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; fill: string }>
  label?: string
}

function MetricTooltip({ active, payload, label }: MetricTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container-low border border-primary/20 rounded-lg px-3 py-2 shadow-lg">
      <p className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-body text-xs" style={{ color: entry.fill }}>
          {entry.name}: {label === 'Wake Time' ? formatWakeTime(entry.value) : label === 'Duration' ? formatDuration(entry.value) : entry.value.toFixed(1)}
        </p>
      ))}
    </div>
  )
}

export function ComparisonChart({ comparison }: ComparisonChartProps) {
  const { conditionA, conditionB } = comparison
  const hasA = conditionA.dayCount > 0
  const hasB = conditionB.dayCount > 0

  if (!hasA && !hasB) {
    return (
      <div className="py-8 text-center">
        <span className="font-body text-sm text-on-surface-variant">No data yet — log nights with experiment conditions to see comparisons</span>
      </div>
    )
  }

  const data = [
    {
      metric: 'Wake Time',
      A: hasA ? conditionA.avgWakeTime : 0,
      B: hasB ? conditionB.avgWakeTime : 0,
    },
    {
      metric: 'Duration',
      A: hasA ? conditionA.avgTst : 0,
      B: hasB ? conditionB.avgTst : 0,
    },
    {
      metric: 'Quality',
      A: hasA ? conditionA.avgQuality : 0,
      B: hasB ? conditionB.avgQuality : 0,
    },
  ]

  const formatTick = (value: number, metric: string): string => {
    if (metric === 'Wake Time') return formatWakeTime(value)
    if (metric === 'Duration') return formatDuration(value)
    return value.toFixed(1)
  }

  // Custom tick renderer to show formatted values on X axis
  const renderLabel = (props: Record<string, unknown>) => {
    const x = Number(props.x ?? 0)
    const y = Number(props.y ?? 0)
    const payload = props.payload as { value: string } | undefined
    return (
      <text x={x} y={y + 12} textAnchor="middle" fontSize={9} fill="#858178" className="font-label">
        {payload?.value ?? ''}
      </text>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 8 }} barGap={4}>
          <XAxis
            dataKey="metric"
            tick={renderLabel}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<MetricTooltip />} cursor={false} />
          <Bar dataKey="A" name={conditionA.label} radius={[4, 4, 0, 0]} barSize={28}>
            {data.map((_, i) => (
              <Cell key={`a-${i}`} fill={COLOR_A} />
            ))}
          </Bar>
          <Bar dataKey="B" name={conditionB.label} radius={[4, 4, 0, 0]} barSize={28}>
            {data.map((_, i) => (
              <Cell key={`b-${i}`} fill={COLOR_B} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stats labels below chart */}
      <div className="grid grid-cols-3 gap-2 mt-2 text-center">
        {data.map((d) => (
          <div key={d.metric}>
            {hasA && (
              <span className="font-body text-xs block" style={{ color: COLOR_A }}>
                {formatTick(d.A, d.metric)}
              </span>
            )}
            {hasB && (
              <span className="font-body text-xs block" style={{ color: COLOR_B }}>
                {formatTick(d.B, d.metric)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_A }} />
          <span className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">
            {conditionA.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_B }} />
          <span className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">
            {conditionB.label}
          </span>
        </div>
      </div>
    </div>
  )
}
