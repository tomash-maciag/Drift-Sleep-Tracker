import { SliderField } from './SliderField'
import { TagPicker } from './TagPicker'
import { Section } from './Section'

const INFLAMMATION_OPTIONS = [
  'Back pain',
  'Morning stiffness',
  'Psoriasis flare',
  'Joint pain',
  'Fatigue',
  'None',
]

interface WeeklyReviewProps {
  stress: number
  onStressChange: (v: number) => void
  activity: string
  onActivityChange: (v: string) => void
  inflammation: string[]
  onInflammationChange: (v: string[]) => void
  rating: number
  onRatingChange: (v: number) => void
}

export function WeeklyReview({
  stress,
  onStressChange,
  activity,
  onActivityChange,
  inflammation,
  onInflammationChange,
  rating,
  onRatingChange,
}: WeeklyReviewProps) {
  const inflammationTags = INFLAMMATION_OPTIONS.map((label) => ({
    id: label,
    label,
    active: inflammation.includes(label),
  }))

  const handleInflammationToggle = (id: string) => {
    if (id === 'None') {
      onInflammationChange(inflammation.includes('None') ? [] : ['None'])
    } else {
      const without = inflammation.filter((s) => s !== 'None')
      if (without.includes(id)) {
        onInflammationChange(without.filter((s) => s !== id))
      } else {
        onInflammationChange([...without, id])
      }
    }
  }

  return (
    <Section accent className="space-y-5">
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary block">Weekly Review</span>

      <SliderField
        label="Weekly stress"
        value={stress}
        onChange={onStressChange}
        min={1}
        max={10}
        leftLabel="Low"
        rightLabel="High"
      />

      <div>
        <span className="font-body text-sm text-tertiary-dim block mb-2">Physical activity</span>
        <textarea
          value={activity}
          onChange={(e) => onActivityChange(e.target.value)}
          placeholder="e.g. 3x this week, mornings"
          rows={1}
          className="w-full bg-surface-container-low rounded-lg p-3 font-body text-sm text-tertiary placeholder:text-on-surface-variant/30 border-none outline-none resize-none"
        />
      </div>

      <div>
        <span className="font-body text-sm text-tertiary-dim block mb-2">Inflammatory symptoms</span>
        <TagPicker tags={inflammationTags} onToggle={handleInflammationToggle} />
      </div>

      <SliderField
        label="Overall week rating"
        value={rating}
        onChange={onRatingChange}
        min={1}
        max={10}
        leftLabel="Poor"
        rightLabel="Excellent"
      />
    </Section>
  )
}
