import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as reportService from '../services/report.service'
import * as noticeService from '../services/notice.service'
import * as statsService from '../services/stats.service'
import { getErrorMessage } from '../utils/errorHandler'
import OutageCard from '../components/OutageCard'
import ActionSparkIcon from '../components/ActionSparkIcon'
import heroVideo from '../Reference/poweralert.mp4'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function deriveOutageStatus(report) {
  if (report.status === 'Verified') return 'active'
  if (report.status === 'Resolved') return 'restored'
  return 'scheduled'
}

function formatOutageReason(report) {
  return report.outageType || report.description || 'No reason provided'
}

function mapReportToOutage(report) {
  return {
    id: report._id,
    area: `${report.municipality}, Ward ${report.ward}, ${report.district}`,
    time: new Date(report.createdAt).toLocaleString(),
    reason: formatOutageReason(report),
    status: deriveOutageStatus(report),
    restoration: report.estimatedRestoreTime
      ? new Date(report.estimatedRestoreTime).toLocaleString()
      : 'TBD',
    ward: `Ward ${report.ward}`,
  }
}

function deriveMaintenanceStatus(notice) {
  const now = new Date()
  const start = new Date(notice.scheduledStart)
  const end = new Date(notice.scheduledEnd)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'planned'
  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'active'
  return 'completed'
}

function mapNoticeToMaintenanceRow(notice) {
  return {
    id: notice._id,
    date: new Date(notice.scheduledStart).toLocaleDateString(),
    area: `${notice.municipality ? `${notice.municipality}, ` : ''}${notice.district}`,
    work: notice.title,
    time: `${new Date(notice.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(notice.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    status: deriveMaintenanceStatus(notice),
  }
}

const maintenanceStatusStyles = {
  upcoming: 'border-amber-200 bg-amber-50 text-amber-700',
  active: 'border-red-200 bg-red-50 text-red-700',
  planned: 'border-amber-200 bg-amber-50 text-amber-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const maintenanceStatusLabels = {
  upcoming: 'Upcoming',
  active: 'Active',
  planned: 'Planned',
  completed: 'Completed',
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [publicReports, setPublicReports] = useState([])
  const [publicNotices, setPublicNotices] = useState([])
  const [publicStats, setPublicStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadHomeData() {
      setIsLoading(true)
      setError('')

      try {
        const [reportsResult, noticesResult, statsResult] = await Promise.all([
          reportService.getPublicReports({
            page: 1,
            limit: 100,
            sortBy: 'createdAt',
            order: 'desc',
          }),
          noticeService.getPublicNotices({
            page: 1,
            limit: 100,
          }),
          statsService.getPublicStats(),
        ])

        if (cancelled) return

        setPublicReports(reportsResult.data.reports || [])
        setPublicNotices(noticesResult.data.notices || [])
        setPublicStats(statsResult.data.stats || null)
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [])

  const outageCards = useMemo(() => publicReports.map(mapReportToOutage), [publicReports])
  const maintenanceCards = useMemo(() => publicNotices.map(mapNoticeToMaintenanceRow), [publicNotices])

  const activeOutageCount = publicStats?.totalActiveOutages ?? outageCards.filter(item => item.status === 'active').length
  const openMaintenanceCount = maintenanceCards.filter(item => item.status !== 'completed').length
  const uniqueAreaCount = new Set([
    ...outageCards.map(item => item.area),
    ...maintenanceCards.map(item => item.area),
  ]).size

  const stats = [
    { label: 'Current outage notices', value: String(publicReports.length) },
    { label: 'Active outages', value: String(activeOutageCount) },
    { label: 'Open maintenance items', value: String(openMaintenanceCount) },
    { label: 'Areas covered', value: String(uniqueAreaCount) },
  ]

  const helpCards = [
    {
      title: 'Check outages by area',
      body: 'Search your ward or neighborhood to see scheduled, active, and restored power cuts in one place.',
    },
    {
      title: 'Plan around maintenance',
      body: 'Review upcoming NEA work so homes, schools, and businesses can prepare backup power in advance.',
    },
    {
      title: 'Report unexpected faults',
      body: 'Send a simple report when power goes out without notice and keep track of what was submitted.',
    },
  ]

  function handleSearch() {
    const q = query.trim().toLowerCase()
    if (!q) {
      setResults(null)
      return
    }

    const filtered = outageCards.filter((item) =>
      item.area.toLowerCase().includes(q) ||
      item.ward.toLowerCase().includes(q) ||
      item.reason.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    )

    setResults(filtered)

    setTimeout(() => {
      document.getElementById('current-outages')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  const displayOutages = results || outageCards

  return (
    <div>
      <section className="relative overflow-hidden bg-white px-0 py-0">
        <div className="relative h-[470px] w-full overflow-hidden rounded-none border-y border-slate-200 shadow-[0_20px_60px_rgba(15,42,26,0.08)] sm:h-[520px] lg:h-[680px]">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster="/tower-sunset.jpg"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[#F5FAFD]/12" />

          <div className="absolute inset-0 flex items-center px-4 py-6 sm:px-6">
            <div className="w-full max-w-xl rounded-2xl border border-[#D8E7F0] bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:max-w-2xl sm:p-6 lg:ml-12 lg:max-w-xl lg:p-7">
              <div className="max-w-xl text-left">
                <span className="inline-flex items-center rounded-md border border-brand-purple-light bg-brand-purple-light px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-purple">
                  NEA Consumer Alert Platform
                </span>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Reliable power information for every Nepal consumer.
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  Find outages, review maintenance schedules, and report unexpected cuts with live data from the PowerAlert Nepal backend.
                </p>

                <div className="mt-5">
                  <label className="sr-only" htmlFor="home-search">
                    Search by area or ward
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="home-search"
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search by ward or area, for example Baneshwar"
                      className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10"
                    />
                    <button
                      onClick={handleSearch}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-purple px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-purple-dark"
                    >
                      <ActionSparkIcon className="h-4 w-4 text-white" />
                      Search
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate('/alerts')}
                    className="inline-flex items-center justify-center rounded-md border border-brand-purple bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-purple-dark"
                  >
                    View current outages
                  </button>
                  <button
                    onClick={() => navigate('/report')}
                    className="inline-flex items-center justify-center rounded-md border border-brand-purple bg-white px-5 py-3 text-sm font-semibold text-brand-purple transition-colors hover:border-brand-purple-dark hover:text-brand-purple-dark"
                  >
                    Report an outage
                  </button>
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-500">
                  Covering Kathmandu, Lalitpur, Bhaktapur, and nearby districts with live backend data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#D8E7F0] bg-brand-lavender px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center shadow-sm">
              <p className="text-3xl font-semibold tracking-tight text-brand-purple">{s.value}</p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-purple">How We Help</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Clear outage information for planning your day.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              PowerAlert Nepal keeps notices in one place so consumers can respond early, reduce uncertainty, and prepare around electricity interruptions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {helpCards.map(card => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="current-outages" className="bg-brand-lavender px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-purple">Current Outages</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {results ? 'Search Results' : 'Active and upcoming outages'}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {results
                  ? results.length === 0
                    ? 'No outages found for that area.'
                    : `Showing ${results.length} result${results.length !== 1 ? 's' : ''}.`
                  : 'Browse the latest outage data or search by ward and area to narrow the list.'}
              </p>
            </div>

            <button
              onClick={() => navigate('/alerts')}
              className="inline-flex items-center justify-center rounded-xl border border-brand-purple bg-white px-5 py-3 text-sm font-semibold text-brand-purple transition-colors hover:border-brand-purple-dark hover:text-brand-purple-dark"
            >
              View all alerts
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500 shadow-sm">
              Loading current outage data...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : displayOutages.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500 shadow-sm">
              <SearchIcon />
              <p className="mt-4 text-base">No outages found for that area. Try a different ward or area name.</p>
              <button onClick={() => setResults(null)} className="mt-4 text-sm font-semibold text-brand-purple hover:underline">
                Show all outages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {displayOutages.map(outage => (
                <OutageCard key={outage.id} outage={outage} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-purple">Maintenance</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Scheduled work published by NEA.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Use the maintenance schedule to plan around line work, transformer upgrades, and other planned service interruptions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {maintenanceCards.map(row => (
              <div key={row.id} className="rounded-2xl border border-[#D8E7F0] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{row.date}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{row.area}</h3>
                  </div>
                  <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${maintenanceStatusStyles[row.status]}`}>
                    {maintenanceStatusLabels[row.status]}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Work: </span>
                    {row.work}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Time window: </span>
                    {row.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
