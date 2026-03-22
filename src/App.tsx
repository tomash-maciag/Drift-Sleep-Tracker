import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "./components/Layout"
import { Dashboard } from "./views/Dashboard"

function LogPlaceholder() {
  return <div className="text-tertiary">Log Form</div>
}

function ExperimentsPlaceholder() {
  return <div className="text-tertiary">Experiments</div>
}

function SettingsPlaceholder() {
  return <div className="text-tertiary">Settings</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogPlaceholder />} />
          <Route path="experiments" element={<ExperimentsPlaceholder />} />
          <Route path="settings" element={<SettingsPlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
