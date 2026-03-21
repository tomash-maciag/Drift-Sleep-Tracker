import { useState } from 'react'
import { EtherealDashboard } from './exploration/EtherealDashboard'
import { LogForm } from './exploration/LogForm'
import { Settings } from './exploration/Settings'

function App() {
  const [view, setView] = useState<'dashboard' | 'log' | 'settings'>('dashboard')

  if (view === 'log') {
    return <LogForm onClose={() => setView('dashboard')} />
  }

  if (view === 'settings') {
    return <Settings onClose={() => setView('dashboard')} />
  }

  return <EtherealDashboard onOpenLog={() => setView('log')} onOpenSettings={() => setView('settings')} />
}

export default App
