import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import BasicLayout from './layouts/BasicLayout'
import RetargetCanvas from './pages/RetargetConfig'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Navigate to="/retarget-canvas" replace />} />
          <Route path="retarget-canvas" element={<RetargetCanvas />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
