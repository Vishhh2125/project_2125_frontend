import { useState } from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import './App.css'
import ChargingStationLocator from './chargingStation.jsx'
import AuthForm from './login.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChargingStationLocator />} />
          <Route path="/login" element={<AuthForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
