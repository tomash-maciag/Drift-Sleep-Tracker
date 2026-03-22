import { NavLink } from "react-router"

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
        `flex flex-col items-center ${isActive ? 'text-primary' : 'text-secondary hover:text-tertiary'} transition-all active:scale-90 duration-300`
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
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function BottomNav() {
  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-surface-container-low/90 backdrop-blur-xl rounded-t-[20px] border-t border-white/5">
      <NavItem to="/" icon="bedtime" label="Home" end />
      <NavItem to="/experiments" icon="science" label="Experiments" />
      <NavItem to="/settings" icon="settings" label="Settings" />
    </footer>
  )
}
