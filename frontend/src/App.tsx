import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OTPVerification from './pages/OTPVerification'
import Navbar from './components/Navbar'
import PublicRoute from './components/layout/PublicRoute'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/verify-otp" element={
          <PublicRoute>
            <OTPVerification />
          </PublicRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
