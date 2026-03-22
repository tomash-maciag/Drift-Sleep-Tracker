import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { computeExperimentComparison } from '../hooks/useExperiments'
import { ComparisonChart } from './charts/ComparisonChart'
import { Section } from './Section'
import type { Experiment } from '../types'

interface ExperimentCardProps {
  experiment: Experiment
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const [expanded, setExpanded] = useState(false)

  const comparison = useLiveQuery(
    () => expanded ? computeExperimentComparison(experiment.id) : null,
    [expanded, experiment.id]
  )

  const dateRange = experiment.endDate
    ? `${experiment.startDate} — ${experiment.endDate}`
    : `${experiment.startDate} — ongoing`

  return (
    <Section>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-headline text-base font-light tracking-tight text-tertiary">
            {experiment.name}
          </h3>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-0.5 block">
            {dateRange}
          </span>
          {experiment.notes && !expanded && (
            <p className="font-body text-xs text-tertiary-dim mt-1 truncate">
              {experiment.notes}
            </p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-on-surface-variant mt-1 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {experiment.notes && (
            <p className="font-body text-sm text-tertiary-dim">
              {experiment.notes}
            </p>
          )}

          {comparison ? (
            <>
              <ComparisonChart comparison={comparison} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-1">
                    {comparison.conditionA.label}
                  </span>
                  <span className="font-body text-xs text-tertiary-dim">
                    {comparison.conditionA.dayCount} nights logged
                  </span>
                </div>
                <div>
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-1">
                    {comparison.conditionB.label}
                  </span>
                  <span className="font-body text-xs text-tertiary-dim">
                    {comparison.conditionB.dayCount} nights logged
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <span className="font-body text-xs text-on-surface-variant">Loading comparison data...</span>
            </div>
          )}
        </div>
      )}
    </Section>
  )
}
