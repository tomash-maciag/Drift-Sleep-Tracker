import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "./components/Layout"
import { Dashboard } from "./views/Dashboard"
import { Settings } from "./views/Settings"
import { LogForm } from "./views/LogForm"
import { Experiments } from "./views/Experiments"
import { History } from "./views/History"

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogForm />} />
          <Route path="history" element={<History />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
