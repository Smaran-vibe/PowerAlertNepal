import React from 'react'
import { Link } from 'react-router-dom'
import ActionSparkIcon from '../ActionSparkIcon'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export default function CitizenHero({
  videoSrc,
  query,
  onQueryChange,
  onSearch,
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-auth-deep-current">
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          poster="/tower-sunset.jpg"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,18,42,0.92),rgba(10,30,74,0.68)),radial-gradient(circle_at_top_right,rgba(56,221,224,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(36,81,214,0.32),transparent_38%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-auth-cyan-charge backdrop-blur-sm">
            PowerAlert Nepal
          </span>

          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Clear power intelligence for citizens, built around verified public data.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Track verified outages, review maintenance notices, and publish a new report when power cuts hit without notice.
          </p>

          <div className="mt-8">
            <label className="sr-only" htmlFor="home-search">
              Search by area or ward
            </label>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3">
                <SearchIcon />
                <input
                  id="home-search"
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch()
                  }}
                  placeholder="Search by ward or area, for example Baneshwar"
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>

              <button
                type="button"
                onClick={onSearch}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-auth-volt-blue px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                <ActionSparkIcon className="h-4 w-4 text-auth-cyan-charge" />
                Search
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/alerts"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              View verified outages
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center justify-center rounded-2xl border border-auth-cyan-charge/40 bg-auth-cyan-charge/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-auth-cyan-charge/20"
            >
              Report an outage
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
