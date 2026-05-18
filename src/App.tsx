import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Navigation } from './components/Navigation'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { Journey } from './pages/Journey'
import { Standards } from './pages/Standards'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/standards" element={<Standards />} />
      </Routes>
    </Router>
  )
}

export default App
