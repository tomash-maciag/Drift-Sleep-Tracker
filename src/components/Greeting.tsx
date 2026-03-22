export function Greeting() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{dateStr}</span>
      <h2 className="font-headline text-2xl font-light tracking-tight text-tertiary">{greeting}</h2>
    </div>
  )
}
