import React from 'react'
import { Link } from 'react-router-dom'

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.5l1.7 1.7 3.8-4.1" />
    </svg>
  )
}

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
    <div className="min-h-screen bg-[#F5FAFD] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[#D8E7F0] bg-white/90 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative flex flex-col justify-between overflow-hidden bg-brand-purple px-8 py-10 text-white lg:px-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.07)_0%,_transparent_38%,_rgba(59,175,218,0.16)_100%)]" />
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              <ShieldIcon />
              PowerAlert Nepal
            </div>
            <h1 className="font-sans text-4xl font-bold leading-tight text-white sm:text-5xl">
              Stay ahead of outages with one account.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Please authenticate our website to know the powercut beforehand.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-3 text-sm text-white/85 sm:grid-cols-2">
            {[
              'Login for returning users',
              'Register a new consumer account',
              'Consistent design across all auth pages',
            ].map(item => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                {item}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-yellow">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-sans text-3xl font-bold text-gray-900 sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#D8E7F0] bg-white p-6 shadow-sm sm:p-8">
              {children}
            </div>

            {footerText && footerLink && footerLinkLabel && (
              <p className="mt-6 text-center text-sm text-gray-600">
                {footerText}{' '}
                <Link to={footerLink} state={footerLinkState} className="font-semibold text-brand-purple hover:underline">
                  {footerLinkLabel}
                </Link>
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
