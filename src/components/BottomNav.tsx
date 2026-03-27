import { NavLink, useNavigate } from "react-router"

interface NavItemProps {
  to: string
  icon: string
  label: string
  end?: boolean
}

function NavItem({ to, icon, label, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center ${isActive ? 'text-primary' : 'text-secondary hover:text-tertiary'} transition-all active:scale-90 duration-300`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined text-2xl"
            style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {icon}
          </span>
          <span className="font-label uppercase tracking-[0.1em] text-[9px] mt-1">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function BottomNav() {
  const navigate = useNavigate()
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 items-center px-2 pb-6 pt-3 bg-surface-container-low/90 backdrop-blur-xl rounded-t-[20px] border-t border-white/5">
      <NavItem to="/" icon="bedtime" label="Home" end />
      <NavItem to="/history" icon="history" label="History" />
      <button
        onClick={() => navigate('/log')}
        aria-label="Log sleep"
        className="flex flex-col items-center transition-all active:scale-90 duration-300"
      >
        <span className="bg-primary text-on-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_24px_0_rgba(217,102,52,0.3)]">
          <span className="material-symbols-outlined text-2xl">add</span>
        </span>
      </button>
      <NavItem to="/experiments" icon="science" label="Tests" />
      <NavItem to="/settings" icon="settings" label="Settings" />
    </footer>
  )
}
