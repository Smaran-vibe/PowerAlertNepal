import React from 'react'
import { Link } from 'react-router-dom'
import PAMonogram from './PAMonogram'

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkLabel,
  footerLinkState,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-auth-deep-current px-4 py-10">
      {/* Abstract blue/cyan gradient background — pure CSS, no image asset */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,_rgba(243,231,206,0.16)_0%,_transparent_35%),radial-gradient(circle_at_85%_15%,_rgba(56,221,224,0.20)_0%,_transparent_45%),linear-gradient(160deg,_#0A1E4A_0%,_#123A8F_45%,_#2451D6_75%,_#0A1E4A_100%)]" />
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-auth-cyan-charge/20 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-auth-volt-blue/30 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col items-center justify-center">
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-auth-cyan-charge/40 blur-xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm">
              <PAMonogram className="h-7 w-7" />
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            PowerAlert Nepal
          </p>
        </div>

        <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_25px_70px_rgba(6,15,40,0.45)] backdrop-blur-md sm:p-8">
          <div className="mb-6">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-auth-cyan-charge">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm leading-6 text-white/70">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>

        {footerText && footerLink && footerLinkLabel && (
          <p className="mt-6 text-center text-sm text-white/70">
            {footerText}{' '}
            <Link to={footerLink} state={footerLinkState} className="font-semibold text-auth-cyan-charge hover:underline">
              {footerLinkLabel}
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}