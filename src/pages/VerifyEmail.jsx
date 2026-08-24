import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import * as authService from '../services/auth.service'
import { getErrorMessage } from '../utils/errorHandler'
import toast from '../components/Toast/toast'

export default function VerifyEmail() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''

    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        if (!email) {
            navigate('/register', { replace: true })
        }
    }, [email, navigate])

    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [cooldown])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (otp.trim().length !== 6) {
            setError('Please enter the 6-digit code.')
            return
        }

        setIsSubmitting(true)
        try {
            await authService.verifyEmail({ email, otp: otp.trim() })
            toast.success('Email verified! You can now log in.')
            navigate('/login', { replace: true })
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleResend() {
        setError('')
        setIsResending(true)
        try {
            await authService.resendVerificationOtp({ email })
            toast.success('A new code has been sent.')
            setCooldown(30)
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setIsResending(false)
        }
    }

    return (
        <AuthShell
            eyebrow="Almost there"
            title="Verify your email"
            description={`Enter the 6-digit code we sent to ${email}.`}
            footerText="Wrong email?"
            footerLink="/register"
            footerLinkLabel="Go back"
        >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                {error && (
                    <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/80">Verification code</label>
                    <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-4 py-3 focus-within:border-auth-cyan-charge focus-within:ring-2 focus-within:ring-auth-cyan-charge/30">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            disabled={isSubmitting}
                            className="w-full border-0 p-0 text-center text-lg tracking-[0.5em] text-gray-900 outline-none placeholder:text-gray-400 placeholder:tracking-normal focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-auth-volt-blue px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? 'Verifying...' : 'Verify Email'}
                </button>

                <p className="text-center text-sm text-white/70">
                    Didn't get a code?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || cooldown > 0}
                        className="font-semibold text-auth-cyan-charge hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : isResending ? 'Sending...' : 'Resend code'}
                    </button>
                </p>
            </form>
        </AuthShell>
    )
}