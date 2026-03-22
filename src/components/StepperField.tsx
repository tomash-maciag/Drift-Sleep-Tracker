interface StepperFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  unit: string
  step?: number
}

export function StepperField({ label, value, onChange, min, max, unit, step = 5 }: StepperFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-sm text-tertiary-dim">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="font-headline text-lg font-extralight text-tertiary w-12 text-center">{value}{unit}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  )
}
