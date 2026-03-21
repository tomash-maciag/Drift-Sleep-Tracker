import type { Theme } from '../themes'

interface Props {
  theme: Theme
}

const navItems = [
  { label: 'Home', icon: '◉' },
  { label: 'Experiments', icon: '⚗' },
  { label: 'Settings', icon: '⚙' },
]

export function BottomNav({ theme }: Props) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '400px',
      background: theme.layout.navGlass ? theme.vars['--bg-nav'] : theme.vars['--bg-nav'],
      borderTop: theme.vars['--border'] === 'transparent' ? 'none' : `1px solid ${theme.vars['--border']}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '12px 16px 16px',
      zIndex: 50,
      ...(theme.layout.navGlass ? {
        backdropFilter: 'blur(16px)',
        borderTopLeftRadius: theme.layout.navRadius,
        borderTopRightRadius: theme.layout.navRadius,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
      } : {}),
    }}>
      {navItems.map((item, i) => (
        <button
          key={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: i === 0 && theme.layout.navGlass
              ? (theme.name === 'ethereal' ? 'rgba(65, 78, 143, 0.4)' : 'rgba(99, 102, 241, 0.15)')
              : 'none',
            border: 'none',
            cursor: 'pointer',
            color: i === 0 ? theme.vars['--nav-active'] : theme.vars['--nav-inactive'],
            fontSize: '18px',
            padding: i === 0 && theme.layout.navGlass ? '8px 20px' : '4px 12px',
            borderRadius: i === 0 && theme.layout.navGlass ? '16px' : '0',
            fontFamily: theme.vars['--font-body'],
            transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
          }}
        >
          <span>{item.icon}</span>
          <span style={{
            fontSize: theme.layout.kpiLabelSize,
            fontWeight: i === 0 ? 600 : 400,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: theme.vars['--font-mono'],
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
