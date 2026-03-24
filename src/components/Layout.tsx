import { Outlet, useNavigate } from "react-router"
import { AppBar } from "./AppBar"
import { BottomNav } from "./BottomNav"

export function Layout() {
  const navigate = useNavigate()
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-32 selection:bg-primary-container selection:text-primary">
      <AppBar />
      <main className="pt-20 px-6 space-y-6">
        <Outlet />
      </main>
      {/* FAB */}
      <button
        className="fixed bottom-24 right-6 bg-primary text-on-primary h-14 w-14 rounded-2xl shadow-[0_0_32px_0_rgba(217,102,52,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        aria-label="Log sleep"
        onClick={() => navigate('/log')}
      >
        <span className="material-symbols-outlined">add</span>
      </button>
      <BottomNav />
    </div>
  )
}
