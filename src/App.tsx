import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "./components/Layout"

function DashboardPlaceholder() {
  return <div className="text-tertiary">Dashboard</div>
}

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
          <Route index element={<DashboardPlaceholder />} />
          <Route path="log" element={<LogPlaceholder />} />
          <Route path="experiments" element={<ExperimentsPlaceholder />} />
          <Route path="settings" element={<SettingsPlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
