import React, { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Calendar from './pages/Calendar'
import Report from './pages/Report'
import MyReports from './pages/MyReports'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ToastProvider from './components/Toast/ToastProvider'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function AppShimmer() {
  return (
    <div className="min-h-screen bg-brand-lavender flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="shimmer h-8 w-1/2 rounded-md mx-auto" />
        <div className="shimmer h-4 w-3/4 rounded-md mx-auto" />
        <div className="shimmer h-40 w-full rounded-2xl mt-4" />
      </div>
    </div>
  )
}

function AuthRedirect({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const from = location.state?.from || (user?.role === 'admin' ? '/admin' : '/')

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }
  return children
}

function SignupRedirect() {
  const location = useLocation()
  return <Navigate to="/register" replace state={location.state} />
}

function AdminHomeGuard() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const prevUserRef = useRef(null)

  useEffect(() => {
    const wasLoggedOut = !prevUserRef.current
    const isAdminNow = user?.role === 'admin'

    if (wasLoggedOut && isAdminNow && location.pathname === '/') {
      navigate('/admin', { replace: true })
    }

    prevUserRef.current = user
  }, [user, location.pathname, navigate])

  return null
}

export default function App() {
  const { isRestoring } = useAuth()

  if (isRestoring) {
    return (
      <ToastProvider>
        <AppShimmer />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <AdminHomeGuard />
      <Routes>
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect><Signup /></AuthRedirect>} />
        <Route path="/signup" element={<SignupRedirect />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
        <Route path="/report" element={<Layout><Report /></Layout>} />
        <Route path="/my-reports" element={<ProtectedRoute><Layout><MyReports /></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}