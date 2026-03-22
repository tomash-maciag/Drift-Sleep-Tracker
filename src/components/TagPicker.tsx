interface Tag {
  id: string
  label: string
  active: boolean
}

interface TagPickerProps {
  tags: Tag[]
  onToggle: (id: string) => void
}

export function TagPicker({ tags, onToggle }: TagPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onToggle(tag.id)}
          className={`px-3 py-1.5 rounded-lg font-label text-xs transition-all ${
            tag.active
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-surface-container-low text-on-surface-variant border border-transparent'
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  )
}
