interface ToggleFieldProps {
  label: string
  options: string[]
  value: number
  onChange: (value: number) => void
}

export function ToggleField({ label, options, value, onChange }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-sm text-tertiary-dim">{label}</span>
      <div className="flex bg-surface-container-low rounded-lg p-0.5">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => onChange(i)}
            className={`px-3 py-1.5 rounded-md font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
              value === i ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
