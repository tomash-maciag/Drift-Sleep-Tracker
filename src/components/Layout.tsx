import { Outlet } from "react-router"
import { AppBar } from "./AppBar"
import { BottomNav } from "./BottomNav"

export function Layout() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-32 selection:bg-primary-container selection:text-primary">
      <AppBar />
      <main className="px-4 py-4 space-y-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
