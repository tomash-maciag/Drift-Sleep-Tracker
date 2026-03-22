import type { Insight } from '../types'
import { Section } from './Section'

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null

  return (
    <Section accent>
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">Insights</span>
      <div className="space-y-3">
        {insights.map((insight) => (
          <p key={insight.id} className="font-body text-sm text-tertiary-dim leading-relaxed">
            {insight.severity === 'warning' && <span className="text-error font-semibold">{'\u26A0'} </span>}
            {insight.severity === 'info' && <span className="text-primary font-semibold">{'\u2192'} </span>}
            {insight.message}
          </p>
        ))}
      </div>
    </Section>
  )
}
