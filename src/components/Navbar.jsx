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
  const { user, logout } = useAuth()

  function isActive(path) {
    return location.pathname === path
  }

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#081425]/85 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <ElectricPoleIcon className="h-5 w-5 text-auth-cyan-charge" />
          <span className="text-[1.05rem] font-semibold tracking-tight text-white">
            PowerAlert <span className="text-auth-cyan-charge">Nepal</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`relative py-1 transition-colors hover:text-auth-cyan-charge ${isActive(link.to) ? 'font-semibold text-white' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
              <span className="font-medium text-white">{user.fullName}</span>
              {user.role === 'admin' && (
                <>
                  <span className="text-slate-500">|</span>
                  <Link to="/admin" className="font-medium text-auth-cyan-charge hover:text-white">
                    Admin Portal
                  </Link>
                </>
              )}
              <span className="text-slate-500">|</span>
              <button type="button" onClick={handleLogout} className="font-medium text-auth-cyan-charge hover:text-white">
                Logout
              </button>
            </div>
          )}
          {!user && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-full bg-auth-volt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-2 border-t border-white/10 bg-[#07111F] px-4 py-4 md:hidden">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-auth-cyan-charge ${isActive(link.to) ? 'bg-white/10 text-white' : 'text-slate-300'}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <div className="mt-1 flex flex-col gap-2">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  Admin Portal
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                Logout
              </button>
            </div>
          )}
          {!user && (
            <div className="mt-1 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-auth-volt-blue px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:brightness-110"
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
