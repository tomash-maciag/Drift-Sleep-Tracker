interface SectionProps {
  children: React.ReactNode
  className?: string
  accent?: boolean
}

export function Section({ children, className = '', accent }: SectionProps) {
  return (
    <section className={`bg-surface-container rounded-xl p-6 ${accent ? 'border-l-2 border-primary-container' : ''} ${className}`}>
      {children}
    </section>
  )
}
