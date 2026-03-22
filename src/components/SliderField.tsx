interface SliderFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  leftLabel: string
  rightLabel: string
}

export function SliderField({ label, value, onChange, min, max, leftLabel, rightLabel }: SliderFieldProps) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-body text-sm text-tertiary-dim">{label}</span>
        <span className="font-headline text-lg font-extralight text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-surface-container-low rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between mt-1">
        <span className="font-label text-[9px] text-on-surface-variant/40">{leftLabel}</span>
        <span className="font-label text-[9px] text-on-surface-variant/40">{rightLabel}</span>
      </div>
    </div>
  )
}
