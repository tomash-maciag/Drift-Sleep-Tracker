export function AppBar() {
  return (
    <header className="bg-surface border-b border-white/5">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">bedtime</span>
          <h1 className="font-headline text-lg font-bold tracking-[0.1em] text-tertiary">DRIFT</h1>
        </div>
      </div>
    </header>
  )
}
