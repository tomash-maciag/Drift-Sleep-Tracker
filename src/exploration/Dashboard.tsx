import { useState } from 'react'
import { themes, type Theme } from './themes'
import { mockLogs, mockKPI, mockInsights, streakCount } from './mockData'
import { KPICards } from './components/KPICards'
import { SleepTimeline } from './components/SleepTimeline'
import { WakeTimeTrend } from './components/WakeTimeTrend'
import { EfficiencyChart } from './components/EfficiencyChart'
import { InsightsPanel } from './components/InsightsPanel'
import { BottomNav } from './components/BottomNav'
import { formatMinutesAsHM, minutesToTime } from '../utils/date'

export function Dashboard() {
  const [themeIndex, setThemeIndex] = useState(0)
  const [days, setDays] = useState<7 | 14 | 30>(14)
  const theme = themes[themeIndex]

  const style = Object.fromEntries(
    Object.entries(theme.vars).map(([k, v]) => [k, v])
  ) as React.CSSProperties

  const filteredLogs = mockLogs.slice(-days)

  return (
    <div
      style={{
        ...style,
        background: theme.vars['--bg'],
        color: theme.vars['--text'],
        fontFamily: theme.vars['--font-body'],
        minHeight: '100vh',
        maxWidth: '400px',
        margin: '0 auto',
        position: 'relative',
        paddingBottom: '80px',
      }}
    >
      {/* Theme Switcher */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: theme.vars['--bg'],
        borderBottom: `1px solid ${theme.vars['--border']}`,
        padding: '8px 16px',
        display: 'flex',
        gap: '4px',
      }}>
        {themes.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setThemeIndex(i)}
            style={{
              flex: 1,
              padding: '8px 4px',
              fontSize: '11px',
              fontWeight: i === themeIndex ? 700 : 400,
              background: i === themeIndex ? theme.vars['--accent'] : 'transparent',
              color: i === themeIndex ? theme.vars['--fab-text'] : theme.vars['--text-secondary'],
              border: theme.vars['--border'] === 'transparent' ? 'none' : `1px solid ${i === themeIndex ? 'transparent' : theme.vars['--border']}`,
              borderRadius: theme.vars['--radius'],
              cursor: 'pointer',
              fontFamily: theme.vars['--font-body'],
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            fontFamily: theme.vars['--font-heading'],
            color: theme.vars['--text-heading'],
            letterSpacing: '-0.5px',
          }}>
            Drift
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: theme.vars['--streak-color'],
            fontFamily: theme.vars['--font-mono'],
            fontSize: '14px',
            fontWeight: 600,
          }}>
            <span style={{ fontSize: '16px' }}>🔥</span>
            {streakCount} days
          </div>
        </div>
        <p style={{
          margin: '4px 0 0',
          fontSize: '13px',
          color: theme.vars['--text-secondary'],
        }}>
          {theme.description}
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards
        avgTst={formatMinutesAsHM(mockKPI.avgTst!)}
        avgWake={minutesToTime(mockKPI.avgWakeTime!)}
        avgSe={`${mockKPI.avgSe!.toFixed(0)}%`}
        trend={mockKPI.trend!}
        theme={theme}
      />

      {/* Time Range Toggle */}
      <div style={{
        display: 'inline-flex',
        gap: '2px',
        padding: '4px',
        margin: `${theme.layout.sectionGap} 16px 12px`,
        background: theme.name === 'ethereal' ? '#131313' : 'transparent',
        borderRadius: '12px',
      }}>
        {([7, 14, 30] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: d === days ? 600 : 500,
              background: d === days
                ? (theme.name === 'ethereal' ? '#262626' : theme.vars['--accent'])
                : 'transparent',
              color: d === days
                ? (theme.name === 'ethereal' ? theme.vars['--accent'] : theme.vars['--fab-text'])
                : theme.vars['--text-secondary'],
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: theme.vars['--font-mono'],
              transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            {d} Days
          </button>
        ))}
      </div>

      {/* Charts */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: theme.layout.sectionGap }}>
        <ChartCard title="Sleep Timeline" theme={theme}>
          <SleepTimeline logs={filteredLogs} theme={theme} />
        </ChartCard>

        <ChartCard title="Wake Time Trend" theme={theme}>
          <WakeTimeTrend logs={filteredLogs} theme={theme} />
        </ChartCard>

        <ChartCard title="Sleep Efficiency" theme={theme}>
          <EfficiencyChart logs={filteredLogs} theme={theme} />
        </ChartCard>
      </div>

      {/* Insights */}
      <div style={{ padding: `${theme.layout.sectionGap} 16px 0` }}>
        <InsightsPanel insights={mockInsights} theme={theme} />
      </div>

      {/* FAB */}
      <button style={{
        position: 'fixed',
        bottom: '90px',
        right: 'calc(50% - 200px + 16px)',
        width: '56px',
        height: '56px',
        borderRadius: theme.layout.fabRadius,
        background: theme.vars['--fab-bg'],
        color: theme.vars['--fab-text'],
        border: 'none',
        fontSize: '24px',
        fontWeight: 300,
        cursor: 'pointer',
        boxShadow: theme.name === 'ethereal'
          ? '0 0 32px rgba(159, 172, 244, 0.3)'
          : theme.vars['--shadow'],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
      }}>
        +
      </button>

      {/* Bottom Nav */}
      <BottomNav theme={theme} />
    </div>
  )
}

function ChartCard({ title, theme, children }: { title: string; theme: Theme; children: React.ReactNode }) {
  return (
    <div style={{
      background: theme.vars['--bg-card'],
      borderRadius: theme.layout.chartCardRadius,
      border: theme.vars['--border'] === 'transparent' ? 'none' : `1px solid ${theme.vars['--border']}`,
      boxShadow: theme.vars['--shadow-card'],
      padding: theme.layout.cardPadding,
    }}>
      <h3 style={{
        margin: '0 0 16px',
        fontSize: theme.name === 'ethereal' ? '18px' : '14px',
        fontWeight: 700,
        color: theme.vars['--text-heading'],
        fontFamily: theme.vars['--font-heading'],
        letterSpacing: '-0.3px',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}
