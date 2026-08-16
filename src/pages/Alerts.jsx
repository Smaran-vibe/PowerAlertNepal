import React, { useEffect, useMemo, useState } from 'react'
import * as reportService from '../services/report.service'
import { getErrorMessage } from '../utils/errorHandler'

const STATUS_FILTERS = ['all', 'Pending', 'Verified', 'Resolved']
const PAGE_LIMIT = 100

function StatusBadge({ status }) {
  const styles = {
    Pending: 'border-amber-400/30 bg-amber-400/10 text-amber-700',
    Verified: 'border-sky-400/30 bg-sky-400/10 text-sky-700',
    Resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-700',
    Rejected: 'border-rose-400/30 bg-rose-400/10 text-rose-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] || styles.Pending}`}>
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
    <div className="rounded-2xl border border-[#D8E7F0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Report</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{report.title}</h3>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Location: </span>
          {report.municipality}, Ward {report.ward}, {report.district}
        </p>
        <p>
          <span className="font-medium text-slate-800">Citizen: </span>
          {report.reportedBy?.fullName || 'Unknown'}
        </p>
        <p>
          <span className="font-medium text-slate-800">Outage type: </span>
          {report.outageType}
        </p>
        <p className="leading-6">{report.description}</p>
        <p className="text-xs text-slate-400">Submitted {formatDateTime(report.createdAt)}</p>
      </div>

      {report.estimatedRestoreTime && (
        <p className="mt-3 text-xs font-medium text-emerald-700">
          Estimated restore: {formatDateTime(report.estimatedRestoreTime)}
        </p>
      )}

      {report.rejectionReason && (
        <p className="mt-3 text-xs font-medium text-rose-700">
          Rejection reason: {report.rejectionReason}
        </p>
      )}

      {report.image && (
        <img
          src={`${import.meta.env.VITE_API_URL}${report.image}`}
          alt={report.title}
          className="mt-4 h-32 w-full rounded-lg border border-gray-200 object-cover"
        />
      )}
    </div>
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
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="mb-2 font-sans text-3xl font-bold text-gray-900">Power Cut Alerts</h1>
          <p className="text-sm text-gray-500">Live outage reports from the PowerAlert Nepal backend.</p>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by area, ward, district, or outage type..."
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'border-brand-purple bg-brand-purple text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-purple hover:text-brand-purple'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            Loading outage reports...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">No outage reports found.</p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-400">
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
