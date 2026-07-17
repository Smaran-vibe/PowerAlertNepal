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
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <ElectricPoleIcon className="h-5 w-5 text-brand-purple" />
          <span className="text-[1.05rem] font-semibold tracking-tight text-slate-900">
            PowerAlert <span className="text-brand-purple">Nepal</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`relative py-1 transition-colors hover:text-brand-purple ${isActive(link.to) ? 'font-semibold text-brand-purple' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {session && (
            <div className="flex items-center gap-3 border border-[#D8E7F0] bg-brand-lavender px-4 py-2 text-sm text-slate-700">
              <span className="font-medium text-slate-900">{session.name}</span>
              <span className="text-slate-300">|</span>
              <button type="button" onClick={handleLogout} className="font-medium text-brand-purple hover:text-brand-purple-dark">
                Logout
              </button>
            </div>
          )}
          {!session && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center rounded-md border border-[#D8E7F0] bg-brand-lavender px-4 py-2 text-sm font-medium text-brand-purple transition-colors hover:text-brand-purple-dark"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-md bg-brand-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-purple-dark"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-slate-700"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-2 border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-lavender hover:text-brand-purple ${isActive(link.to) ? 'bg-brand-purple-light text-brand-purple' : 'text-slate-700'}`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-left text-sm font-medium text-brand-purple transition-colors hover:border-brand-purple hover:bg-brand-purple-light"
            >
              Logout
            </button>
          )}
          {!session && (
            <div className="mt-1 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-left text-sm font-medium text-brand-purple transition-colors hover:border-brand-purple hover:bg-brand-purple-light"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-brand-purple px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-brand-purple-dark"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
