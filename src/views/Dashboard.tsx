import { useState, useMemo } from 'react'
import { Greeting } from '../components/Greeting'
import { LastNight } from '../components/LastNight'
import { SleepPattern } from '../components/charts/SleepPattern'
import { InsightsPanel } from '../components/InsightsPanel'
import { KPICards } from '../components/KPICards'
import { WakeTrend } from '../components/charts/WakeTrend'
import { EfficiencyChart } from '../components/charts/EfficiencyChart'
import { ChartCard } from '../components/ChartCard'
import { useKPILive, useSleepLogsLive, useSettingLive } from '../hooks/reactive'
import { computeSleepMetrics } from '../utils/sleep-math'
import { generateInsights } from '../utils/insights-engine'
import { minutesToTimeRounded, todayDate } from '../utils/date'
import type { SleepLogWithMetrics } from '../types'

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function Dashboard() {
  const [days, setDays] = useState<7 | 14 | 30>(7)
  const today = todayDate()
  const kpi = useKPILive(today, days)
  const targetWake = useSettingLive<string>('sleepWindowEnd', '06:00')

  // For insights: get last 14 days of logs, split into current 7 and previous 7
  const fourteenDaysAgo = offsetDate(today, -13)
  const rawLogs = useSleepLogsLive(fourteenDaysAgo, today)

  const { insights } = useMemo(() => {
    const withMetrics: SleepLogWithMetrics[] = rawLogs.map(log => ({
      ...log,
      metrics: computeSleepMetrics(log),
    }))
    const sevenDaysAgo = offsetDate(today, -6)
    const current = withMetrics.filter(l => l.date >= sevenDaysAgo)
    const previous = withMetrics.filter(l => l.date < sevenDaysAgo)
    const ins = generateInsights(current, previous)
    return { insights: ins }
  }, [rawLogs, today])

  return (
    <>
      <Greeting />
      <LastNight />
      <SleepPattern />
      <InsightsPanel insights={insights} />
      <KPICards kpi={kpi} days={days} setDays={setDays} />
      {kpi && kpi.avgWakeTime !== null && (
        <ChartCard
          title="Wake Trend"
          subLabel={`Target ${targetWake ?? '06:00'}`}
          legendDash
          value={minutesToTimeRounded(kpi.avgWakeTime!)}
          valueLabel="Avg"
          variant="high"
        >
          <WakeTrend days={days} />
        </ChartCard>
      )}
      {kpi && kpi.avgSe !== null && (
        <ChartCard
          title="Efficiency"
          subLabel="Target 85%"
          legendDash
          value={`${kpi.avgSe!.toFixed(0)}%`}
          valueLabel="Avg"
        >
          <EfficiencyChart days={days} />
        </ChartCard>
      )}
    </>
  )
}
