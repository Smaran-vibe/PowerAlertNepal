import React from 'react'
import { Link } from 'react-router-dom'
import CitizenSurfaceCard from './CitizenSurfaceCard'

export default function CitizenReportCta() {
  return (
    <section className="bg-[#07111F] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <CitizenSurfaceCard className="overflow-hidden border-white/10 !bg-[linear-gradient(135deg,rgba(36,81,214,0.22),rgba(56,221,224,0.12),rgba(255,255,255,0.06))] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan-charge">
                Report an outage
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Found an unexpected power cut?
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-base">
                Submit a report so the issue can be reviewed and verified. Your report helps keep the public outage view accurate.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/report"
                className="inline-flex items-center justify-center rounded-2xl bg-auth-volt-blue px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(36,81,214,0.25)] transition hover:brightness-110"
              >
                Submit report
              </Link>
              <Link
                to="/alerts"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/18"
              >
                Browse alerts
              </Link>
            </div>
          </div>
        </CitizenSurfaceCard>
      </div>
    </section>
  )
}
