export interface Theme {
  name: string
  label: string
  description: string
  vars: Record<string, string>
  layout: {
    sectionGap: string
    cardPadding: string
    kpiMinHeight: string
    kpiLabelSize: string
    kpiValueSize: string
    chartCardRadius: string
    navRadius: string
    navGlass: boolean
    fabRadius: string
    insightIcon: boolean
  }
  chartColors: {
    sleep: string
    sleepLight: string
    line: string
    lineMA: string
    reference: string
    quality: (q: number) => string
    grid: string
    text: string
  }
}

export const themes: Theme[] = [
  {
    name: 'clinical',
    label: 'A) Clinical Calm',
    description: 'Light, clean, spacious. Teal accent on white.',
    vars: {
      '--bg': '#f8fafc',
      '--bg-card': '#ffffff',
      '--bg-nav': '#ffffff',
      '--text': '#334155',
      '--text-secondary': '#94a3b8',
      '--text-heading': '#0f172a',
      '--accent': '#0d9488',
      '--accent-light': '#ccfbf1',
      '--accent-muted': '#99f6e4',
      '--border': '#e2e8f0',
      '--shadow': '0 1px 3px rgba(0,0,0,0.08)',
      '--shadow-card': '0 1px 3px rgba(0,0,0,0.06)',
      '--radius': '8px',
      '--radius-lg': '12px',
      '--font-heading': "'Inter', 'Segoe UI', system-ui, sans-serif",
      '--font-body': "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', 'Consolas', monospace",
      '--kpi-bg': '#f0fdfa',
      '--insight-bg': '#f0fdfa',
      '--insight-border': '#99f6e4',
      '--nav-active': '#0d9488',
      '--nav-inactive': '#94a3b8',
      '--fab-bg': '#0d9488',
      '--fab-text': '#ffffff',
      '--tag-bg': '#e2e8f0',
      '--tag-text': '#475569',
      '--streak-color': '#0d9488',
    },
    layout: {
      sectionGap: '16px',
      cardPadding: '12px',
      kpiMinHeight: '80px',
      kpiLabelSize: '11px',
      kpiValueSize: '22px',
      chartCardRadius: '12px',
      navRadius: '0',
      navGlass: false,
      fabRadius: '50%',
      insightIcon: false,
    },
    chartColors: {
      sleep: '#0d9488',
      sleepLight: '#99f6e4',
      line: '#0d9488',
      lineMA: '#0891b2',
      reference: '#f59e0b',
      quality: (q: number) => {
        if (q >= 8) return '#10b981'
        if (q >= 6) return '#0d9488'
        if (q >= 4) return '#f59e0b'
        return '#ef4444'
      },
      grid: '#e2e8f0',
      text: '#94a3b8',
    },
  },
  {
    name: 'oura',
    label: 'B) Rise/Oura Dark',
    description: 'Deep navy, vibrant data colors, glass cards.',
    vars: {
      '--bg': '#0c1220',
      '--bg-card': 'rgba(30, 41, 66, 0.7)',
      '--bg-nav': 'rgba(12, 18, 32, 0.95)',
      '--text': '#94a3c4',
      '--text-secondary': '#5b6b8a',
      '--text-heading': '#e2e8f0',
      '--accent': '#6366f1',
      '--accent-light': 'rgba(99, 102, 241, 0.15)',
      '--accent-muted': 'rgba(99, 102, 241, 0.3)',
      '--border': 'rgba(99, 102, 241, 0.12)',
      '--shadow': '0 4px 24px rgba(0,0,0,0.3)',
      '--shadow-card': '0 2px 16px rgba(0,0,0,0.2)',
      '--radius': '16px',
      '--radius-lg': '20px',
      '--font-heading': "'Inter', 'Segoe UI', system-ui, sans-serif",
      '--font-body': "'Inter', 'Segoe UI', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', 'Consolas', monospace",
      '--kpi-bg': 'rgba(99, 102, 241, 0.08)',
      '--insight-bg': 'rgba(99, 102, 241, 0.08)',
      '--insight-border': 'rgba(99, 102, 241, 0.2)',
      '--nav-active': '#6366f1',
      '--nav-inactive': '#5b6b8a',
      '--fab-bg': '#6366f1',
      '--fab-text': '#ffffff',
      '--tag-bg': 'rgba(99, 102, 241, 0.15)',
      '--tag-text': '#a5b4fc',
      '--streak-color': '#a78bfa',
    },
    layout: {
      sectionGap: '20px',
      cardPadding: '16px',
      kpiMinHeight: '100px',
      kpiLabelSize: '11px',
      kpiValueSize: '24px',
      chartCardRadius: '16px',
      navRadius: '0',
      navGlass: true,
      fabRadius: '16px',
      insightIcon: false,
    },
    chartColors: {
      sleep: '#6366f1',
      sleepLight: '#a78bfa',
      line: '#6366f1',
      lineMA: '#a78bfa',
      reference: '#fbbf24',
      quality: (q: number) => {
        if (q >= 8) return '#34d399'
        if (q >= 6) return '#6366f1'
        if (q >= 4) return '#fbbf24'
        return '#f87171'
      },
      grid: 'rgba(99, 102, 241, 0.08)',
      text: '#5b6b8a',
    },
  },
  {
    name: 'ethereal',
    label: 'C) Ethereal Nocturnal',
    description: 'Digital Lullaby — tonal depth, indigo/lavender, Manrope + Inter, no borders.',
    vars: {
      '--bg': '#0e0e0e',
      '--bg-card': '#131313',
      '--bg-nav': 'rgba(10, 10, 10, 0.8)',
      '--text': '#acabaa',
      '--text-secondary': '#767575',
      '--text-heading': '#e7e5e4',
      '--accent': '#b9c3ff',
      '--accent-light': 'rgba(185, 195, 255, 0.1)',
      '--accent-muted': 'rgba(185, 195, 255, 0.2)',
      '--border': 'transparent',
      '--shadow': '0 0 32px rgba(159, 172, 244, 0.06)',
      '--shadow-card': 'none',
      '--radius': '1.5rem',
      '--radius-lg': '2rem',
      '--font-heading': "'Manrope', system-ui, sans-serif",
      '--font-body': "'Manrope', system-ui, sans-serif",
      '--font-mono': "'Inter', system-ui, sans-serif",
      '--kpi-bg': '#131313',
      '--insight-bg': 'rgba(65, 78, 143, 0.2)',
      '--insight-border': 'transparent',
      '--nav-active': '#b9c3ff',
      '--nav-inactive': '#767575',
      '--fab-bg': '#b9c3ff',
      '--fab-text': '#2e3b7b',
      '--tag-bg': '#1f2020',
      '--tag-text': '#b9c3ff',
      '--streak-color': '#b9c3ff',
    },
    layout: {
      sectionGap: '32px',
      cardPadding: '24px',
      kpiMinHeight: '140px',
      kpiLabelSize: '0.6875rem',
      kpiValueSize: '1.75rem',
      chartCardRadius: '2rem',
      navRadius: '1.5rem',
      navGlass: true,
      fabRadius: '1rem',
      insightIcon: true,
    },
    chartColors: {
      sleep: '#b9c3ff',
      sleepLight: '#d4bbff',
      line: '#d4bbff',
      lineMA: '#9facf4',
      reference: 'rgba(72, 72, 72, 0.3)',
      quality: (q: number) => {
        if (q >= 8) return '#b9c3ff'
        if (q >= 6) return '#9facf4'
        if (q >= 4) return '#d4bbff'
        return '#f97386'
      },
      grid: 'rgba(72, 72, 72, 0.15)',
      text: '#767575',
    },
  },
]
