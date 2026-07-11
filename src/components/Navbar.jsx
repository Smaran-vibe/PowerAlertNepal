import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ElectricPoleIcon from './ElectricPoleIcon'
import { useAuth } from '../context/AuthContext'

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Power Cuts', to: '/alerts' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Report', to: '/report' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { session, logout } = useAuth()

  function isActive(path) {
    return location.pathname === path
  }

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ElectricPoleIcon className="w-5 h-5 text-brand-yellow" />
          <span className="font-display text-xl font-bold text-brand-purple tracking-tight">
            PowerAlert <span className="text-gray-800">Nepal</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`transition-colors hover:text-brand-purple ${isActive(link.to) ? 'text-brand-purple font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {session && (
            <div className="hidden lg:flex items-center gap-3 rounded-full bg-brand-lavender px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold text-brand-purple">{session.name}</span>
              <span className="text-gray-400">|</span>
              <button type="button" onClick={handleLogout} className="font-semibold text-gray-700 hover:text-brand-purple">
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-brand-purple ${isActive(link.to) ? 'text-brand-purple font-semibold' : 'text-gray-600'}`}
              >
                {link.label}
              </Link>
          ))}
          {session && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-brand-purple px-4 py-2 text-sm font-semibold text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
