import type { Theme } from '../themes'

interface Props {
  avgTst: string
  avgWake: string
  avgSe: string
  trend: 'up' | 'down' | 'stable'
  theme: Theme
}

const trendArrow = { up: '↑', down: '↓', stable: '→' }
const trendLabel = { up: 'Improving', down: 'Declining', stable: 'Stable' }

export function KPICards({ avgTst, avgWake, avgSe, trend, theme }: Props) {
  const cards = [
    { label: 'Avg TST (7d)', value: avgTst },
    { label: 'Avg Wake (7d)', value: avgWake },
    { label: 'Avg SE% (7d)', value: avgSe },
    { label: 'Trend', value: `${trendArrow[trend]}`, sub: trendLabel[trend] },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      padding: '12px 16px',
    }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: theme.vars['--kpi-bg'],
            borderRadius: theme.layout.chartCardRadius,
            padding: theme.layout.cardPadding,
            border: theme.vars['--border'] === 'transparent' ? 'none' : `1px solid ${theme.vars['--border']}`,
            minHeight: theme.layout.kpiMinHeight,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{
            fontSize: theme.layout.kpiLabelSize,
            fontWeight: 500,
            color: theme.vars['--text-secondary'],
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: theme.vars['--font-mono'],
          }}>
            {card.label}
          </div>
          <div>
            <div style={{
              fontSize: theme.layout.kpiValueSize,
              fontWeight: 700,
              color: theme.vars['--text-heading'],
              fontFamily: theme.vars['--font-heading'],
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}>
              {card.value}
            </div>
            {card.sub && (
              <div style={{
                fontSize: '13px',
                color: theme.vars['--text-secondary'],
                fontFamily: theme.vars['--font-mono'],
                marginTop: '4px',
              }}>
                {card.sub}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
