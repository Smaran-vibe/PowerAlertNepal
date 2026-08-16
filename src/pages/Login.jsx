import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errorHandler'

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
  const { login, isAuthenticated, user } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const from = location.state?.from || (user?.role === 'admin' ? '/admin' : '/')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true, state: location.state })
    }
  }, [from, isAuthenticated, location.state, navigate])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const authenticatedUser = await login(form)
      toast.success('Welcome back!')
      const destination = location.state?.from || (authenticatedUser?.role === 'admin' ? '/admin' : '/')
      navigate(destination, { replace: true, state: location.state })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Login"
      description="Sign in to track outages and manage your reports."
      footerText="New here?"
      footerLink="/register"
      footerLinkLabel="Create an account"
      footerLinkState={location.state}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/80">Email address</label>
          <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 focus-within:border-auth-cyan-charge focus-within:ring-2 focus-within:ring-auth-cyan-charge/30">
            <span className="text-gray-400"><MailIcon /></span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/80">Password</label>
          <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 focus-within:border-auth-cyan-charge focus-within:ring-2 focus-within:ring-auth-cyan-charge/30">
            <span className="text-gray-400"><LockIcon /></span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" disabled={isSubmitting} className="h-4 w-4 rounded border-white/30 bg-white/10 text-auth-cyan-charge focus:ring-auth-cyan-charge disabled:cursor-not-allowed disabled:opacity-60" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-auth-cyan-charge hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-auth-volt-blue px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-white/70">
          <Link to="/" className="font-semibold text-auth-cyan-charge hover:underline">
            Return to home
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
