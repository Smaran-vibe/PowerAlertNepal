import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Calendar from './pages/Calendar'
import Report from './pages/Report'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import { useAuth } from './context/AuthContext'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function AuthRedirect({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const from = location.state?.from || '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }
  return children
}

function SignupRedirect() {
  const location = useLocation()
  return <Navigate to="/register" replace state={location.state} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
      <Route path="/register" element={<AuthRedirect><Signup /></AuthRedirect>} />
      <Route path="/signup" element={<SignupRedirect />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
      <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
      <Route path="/report" element={<Layout><Report /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
