import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0 1 10 0v3" />
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const from = location.state?.from || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true, state: location.state })
    }
  }, [from, isAuthenticated, location.state, navigate])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    const result = login(form)
    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate(from, { replace: true, state: location.state })
  }

  return (
    <AuthShell
      eyebrow="Authentication UI"
      title="Login"
      description="Sign up"
      footerText="New here?"
      footerLink="/register"
      footerLinkLabel="Create an account"
      footerLinkState={location.state}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
            <span className="text-gray-400"><MailIcon /></span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
            <span className="text-gray-400"><LockIcon /></span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-brand-purple hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-purple-dark"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600">
          <Link to="/" className="font-semibold text-brand-purple hover:underline">
            Return to home
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
