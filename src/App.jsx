import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Calendar from './pages/Calendar'
import Report from './pages/Report'
import About from './pages/About'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
      <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
      <Route path="/report" element={<Layout><Report /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
