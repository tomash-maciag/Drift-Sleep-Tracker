export function AppBar() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 bg-[#161712]/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">bedtime</span>
          <h1 className="font-headline text-lg font-bold tracking-[0.1em] text-tertiary">DRIFT</h1>
        </div>
      </div>
    </header>
  )
}
