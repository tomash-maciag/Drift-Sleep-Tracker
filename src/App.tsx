import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "./components/Layout"
import { Dashboard } from "./views/Dashboard"
import { Settings } from "./views/Settings"
import { LogForm } from "./views/LogForm"
import { Experiments } from "./views/Experiments"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogForm />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
