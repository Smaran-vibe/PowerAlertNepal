import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import * as authService from '../services/auth.service'
import { getErrorMessage } from '../utils/errorHandler'
import toast from '../components/Toast/toast'

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

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSendCode(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setIsSubmitting(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      toast.success('If an account exists, a reset code has been sent.')
      setStep('otp')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError('')
    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await authService.verifyResetOtp({ email: email.trim(), otp: otp.trim() })
      setResetToken(result.data.resetToken)
      setStep('password')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    try {
      await authService.resetPassword({ resetToken, newPassword })
      toast.success('Password reset successfully. Please log in.')
      navigate('/login', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepConfig = {
    email: { title: 'Forgot Password', description: 'Enter the email you used to register.' },
    otp: { title: 'Enter code', description: `We sent a 6-digit code to ${email}.` },
    password: { title: 'New password', description: 'Choose a new password for your account.' },
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title={stepConfig[step].title}
      description={stepConfig[step].description}
      footerText="Remembered your password?"
      footerLink="/login"
      footerLinkLabel="Return to login"
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === 'email' && (
        <form className="flex flex-col gap-5" onSubmit={handleSendCode} noValidate>
          <div className="rounded-2xl bg-brand-lavender px-4 py-4 text-sm leading-6 text-gray-700">
            Enter the email you used to register and we'll send you a reset code.
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <span className="text-gray-400"><MailIcon /></span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form className="flex flex-col gap-5" onSubmit={handleVerifyOtp} noValidate>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Verification code</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isSubmitting}
                className="w-full border-0 p-0 text-center text-lg tracking-[0.5em] outline-none placeholder:text-gray-400 placeholder:tracking-normal focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form className="flex flex-col gap-5" onSubmit={handleResetPassword} noValidate>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">New password</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <span className="text-gray-400"><LockIcon /></span>
              <input
                type="password"
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Confirm password</label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <span className="text-gray-400"><LockIcon /></span>
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/login" className="font-semibold text-brand-purple hover:underline">
          Back to login
        </Link>
        <Link to="/register" className="font-semibold text-brand-purple hover:underline">
          Create account
        </Link>
      </div>
    </AuthShell>
  )
}