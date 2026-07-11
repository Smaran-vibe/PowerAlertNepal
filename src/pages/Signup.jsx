import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

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
  const { signup, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const result = signup(form)
    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <AuthShell
      eyebrow="Authentication UI"
      title="Registration"
      description="Create an account and store it in localStorage. The app opens after signup or login."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Login instead"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Full name</label>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
            <span className="text-gray-400"><UserIcon /></span>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <span className="text-gray-400"><LockIcon /></span>
              <input
                name="password"
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Confirm password</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <span className="text-gray-400"><LockIcon /></span>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
              />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
          <span>I agree to receive outage alerts and updates from PowerAlert Nepal.</span>
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-purple-dark"
        >
          Create Account
        </button>

        <p className="text-center text-xs leading-5 text-gray-500">
          Your registration is saved locally in this browser.
        </p>
      </form>
    </AuthShell>
  )
}
