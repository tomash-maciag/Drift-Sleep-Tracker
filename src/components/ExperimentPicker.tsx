import { useActiveExperimentLive } from '../hooks/reactive'
import { Section } from './Section'

interface ExperimentPickerProps {
  value: string | null
  onChange: (condition: string | null) => void
}

export function ExperimentPicker({ value, onChange }: ExperimentPickerProps) {
  const experiment = useActiveExperimentLive()

  // Don't render if no active experiment or still loading
  if (!experiment) return null

  const options: { value: string | null; label: string }[] = [
    { value: null, label: 'None' },
    { value: experiment.conditionA, label: experiment.conditionA },
    { value: experiment.conditionB, label: experiment.conditionB },
  ]

  return (
    <Section>
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">
        Experiment: {experiment.name}
      </span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
              value === opt.value
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-surface-container-low text-on-surface-variant border border-transparent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Section>
  )
}
