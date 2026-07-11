import React from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell'

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
    </svg>
  )
}

export default function ForgotPassword() {
  return (
    <AuthShell
      eyebrow="Authentication UI"
      title="Forgot Password"
      description="A password recovery page for the assignment. It is UI only, with no email delivery wired in."
      footerText="Remembered your password?"
      footerLink="/login"
      footerLinkLabel="Return to login"
    >
      <form className="flex flex-col gap-5" noValidate>
        <div className="rounded-2xl bg-brand-lavender px-4 py-4 text-sm leading-6 text-gray-700">
          Enter the email you used to register. In a full product, this would trigger a reset link or OTP flow.
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
            <span className="text-gray-400"><MailIcon /></span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            />
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-purple-dark"
        >
          Send Reset Link
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link to="/login" className="font-semibold text-brand-purple hover:underline">
            Back to login
          </Link>
          <Link to="/register" className="font-semibold text-brand-purple hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}
