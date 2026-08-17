import React, { useEffect, useMemo, useState } from 'react'
import * as reportService from '../services/report.service'
import { getErrorMessage } from '../utils/errorHandler'
import CitizenSurfaceCard from '../components/citizen/CitizenSurfaceCard'

const STATUS_FILTERS = ['all', 'Verified', 'Resolved']
const PAGE_LIMIT = 100

function StatusBadge({ status }) {
  const styles = {
    Verified: 'border-sky-400/30 bg-sky-400/10 text-sky-700',
    Resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] || 'border-white/10 bg-white/5 text-slate-300'}`}>
      {status}
    </span>
  )
}

function formatDateTime(value) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleString()
}

function ReportCard({ report }) {
  return (
    <CitizenSurfaceCard className="bg-white/5 p-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-auth-cyan-charge">Report</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{report.title}</h3>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-200">
        <p>
          <span className="font-medium text-white">Location: </span>
          {report.municipality}, Ward {report.ward}, {report.district}
        </p>
        <p>
          <span className="font-medium text-white">Citizen: </span>
          {report.reportedBy?.fullName || 'Unknown'}
        </p>
        <p>
          <span className="font-medium text-white">Outage type: </span>
          {report.outageType}
        </p>
        <p className="leading-6">{report.description}</p>
        <p className="text-xs text-slate-300">Submitted {formatDateTime(report.createdAt)}</p>
      </div>

      {report.estimatedRestoreTime && (
        <p className="mt-3 text-xs font-medium text-emerald-200">
          Estimated restore: {formatDateTime(report.estimatedRestoreTime)}
        </p>
      )}

      {report.rejectionReason && (
        <p className="mt-3 text-xs font-medium text-rose-200">
          Rejection reason: {report.rejectionReason}
        </p>
      )}

      {report.image && (
        <img
          src={`${import.meta.env.VITE_API_URL}${report.image}`}
          alt={report.title}
          className="mt-4 h-32 w-full rounded-2xl border border-white/10 object-cover"
        />
      )}
    </CitizenSurfaceCard>
  )
}

export default function Alerts() {
  const [reports, setReports] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadReports() {
      setIsLoading(true)
      setError('')

      try {
        const result = await reportService.getPublicReports({
          page: 1,
          limit: PAGE_LIMIT,
          sortBy: 'createdAt',
          order: 'desc',
        })

        if (!cancelled) {
          setReports(result.data.reports || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err))
          setReports([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return reports.filter((report) => {
      const searchableText = `${report.title} ${report.description} ${report.district} ${report.municipality} Ward ${report.ward} ${report.outageType}`.toLowerCase()
      const matchesQuery = !q || searchableText.includes(q)
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, reports, statusFilter])

  return (
    <div className="min-h-screen bg-auth-deep-current px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan-charge">Public feed</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Power Cut Alerts</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Live verified outage reports from the PowerAlert Nepal backend.
          </p>
        </div>

        <CitizenSurfaceCard className="mb-8 bg-white/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by area, ward, district, or outage type..."
            className="flex-1 rounded-2xl border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20"
          />
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'border-auth-cyan-charge bg-auth-cyan-charge text-white'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-auth-cyan-charge hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          </div>
        </CitizenSurfaceCard>

        {isLoading ? (
          <CitizenSurfaceCard className="p-8 text-center text-sm text-slate-300">
            Loading outage reports...
          </CitizenSurfaceCard>
        ) : error ? (
          <CitizenSurfaceCard className="border-red-400/20 bg-red-400/10 p-8 text-center text-red-100">
            <p className="text-sm">{error}</p>
          </CitizenSurfaceCard>
        ) : filtered.length === 0 ? (
          <CitizenSurfaceCard className="p-8 text-center text-slate-300">
            <p className="text-sm">No outage reports found.</p>
          </CitizenSurfaceCard>
        ) : (
          <>
            <p className="mb-5 text-sm text-slate-300">
              Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
