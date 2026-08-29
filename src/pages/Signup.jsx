import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errorHandler'
import toast from '../components/Toast/toast'

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}

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

export default function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await signup({ fullName: form.name, email: form.email, password: form.password })
      toast.success('Account created! Check your email for a verification code.')
      navigate('/verify-email', { replace: true, state: { email: form.email } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Registration"
      description="Create your PowerAlert Nepal account to report and track outages."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Login instead"
      footerLinkState={location.state}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white/80">Full name</label>
          <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 focus-within:border-auth-cyan-charge focus-within:ring-2 focus-within:ring-auth-cyan-charge/30">
            <span className="text-gray-400"><UserIcon /></span>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 focus-within:border-auth-cyan-charge focus-within:ring-2 focus-within:ring-auth-cyan-charge/30">
              <span className="text-gray-400"><LockIcon /></span>
              <input
                name="password"
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Confirm password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 focus-within:border-auth-cyan-charge focus-within:ring-2 focus-within:ring-auth-cyan-charge/30">
              <span className="text-gray-400"><LockIcon /></span>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border-0 p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-white/70">
          <input type="checkbox" disabled={isSubmitting} className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10 text-auth-cyan-charge focus:ring-auth-cyan-charge disabled:cursor-not-allowed disabled:opacity-60" />
          <span>I agree to receive outage alerts and updates from PowerAlert Nepal.</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-auth-volt-blue px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  )
}
