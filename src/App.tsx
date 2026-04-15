import { HashRouter, Routes, Route } from 'react-router-dom'
import BasicLayout from './layouts/BasicLayout'
import RetargetCanvas from './pages/RetargetConfig'

const Home = () => {
  return <div>欢迎使用原型项目，请开始描述你的需求。</div>
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Home />} />
          <Route path="retarget-canvas" element={<RetargetCanvas />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
