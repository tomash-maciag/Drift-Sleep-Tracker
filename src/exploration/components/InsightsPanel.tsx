import type { Insight } from '../../types'
import type { Theme } from '../themes'

interface Props {
  insights: Insight[]
  theme: Theme
}

export function InsightsPanel({ insights, theme }: Props) {
  if (insights.length === 0) return null

  return (
    <div style={{
      background: theme.vars['--insight-bg'],
      borderRadius: theme.layout.chartCardRadius,
      border: theme.vars['--insight-border'] === 'transparent' ? 'none' : `1px solid ${theme.vars['--insight-border']}`,
      padding: theme.layout.cardPadding,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
        color: theme.vars['--accent'],
      }}>
        {theme.layout.insightIcon && (
          <span style={{ fontSize: '20px' }}>💡</span>
        )}
        <h3 style={{
          margin: 0,
          fontSize: '14px',
          fontWeight: 700,
          color: theme.vars['--text-heading'],
          fontFamily: theme.vars['--font-heading'],
        }}>
          {theme.layout.insightIcon ? 'Daily Insight' : 'Insights'}
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {insights.map((insight) => (
          <div
            key={insight.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            {theme.layout.insightIcon ? (
              <div style={{
                flexShrink: 0,
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: insight.severity === 'warning'
                  ? 'rgba(135, 28, 52, 0.2)'
                  : theme.vars['--accent-light'],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: insight.severity === 'warning' ? '#f97386' : theme.vars['--accent'],
              }}>
                {insight.severity === 'warning' ? '⚠' : 'ℹ'}
              </div>
            ) : (
              <span style={{
                flexShrink: 0,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: insight.severity === 'warning'
                  ? theme.chartColors.reference
                  : theme.vars['--accent'],
                marginTop: '6px',
              }} />
            )}
            <span style={{
              fontSize: '13px',
              lineHeight: '1.5',
              color: theme.vars['--text'],
              fontFamily: theme.vars['--font-body'],
            }}>
              {insight.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
