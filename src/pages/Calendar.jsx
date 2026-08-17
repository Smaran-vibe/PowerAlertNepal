import React, { useEffect, useMemo, useState } from 'react'
import * as noticeService from '../services/notice.service'
import { getErrorMessage } from '../utils/errorHandler'
import CitizenSurfaceCard from '../components/citizen/CitizenSurfaceCard'

const statusFilters = ['all', 'upcoming', 'active', 'completed']

function StatusBadge({ status }) {
  const styles = {
    upcoming: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
    active: 'border-red-400/30 bg-red-400/10 text-red-100',
    completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  }

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-bold capitalize ${styles[status] || 'border-white/10 bg-white/5 text-slate-300'}`}>
      {status}
    </span>
  )
}

function SortIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  )
}

function deriveStatus(notice) {
  const now = new Date()
  const start = new Date(notice.scheduledStart)
  const end = new Date(notice.scheduledEnd)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'upcoming'
  }

  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'active'
  return 'completed'
}

function formatDate(value) {
  return new Date(value).toLocaleDateString()
}

function formatTimeWindow(start, end) {
  const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startTime} - ${endTime}`
}

export default function Calendar() {
  const [notices, setNotices] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadNotices() {
      setIsLoading(true)
      setError('')

      try {
        const result = await noticeService.getPublicNotices({
          page: 1,
          limit: 100,
        })

        if (!cancelled) {
          setNotices(result.data.notices || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err))
          setNotices([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadNotices()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return notices
      .map((notice) => ({ ...notice, status: deriveStatus(notice) }))
      .filter((notice) => statusFilter === 'all' || notice.status === statusFilter)
      .sort((a, b) => {
        const diff = new Date(a.scheduledStart) - new Date(b.scheduledStart)
        return sortAsc ? diff : -diff
      })
  }, [notices, sortAsc, statusFilter])

  return (
    <div className="min-h-screen bg-auth-deep-current px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan-charge">Maintenance calendar</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Maintenance Calendar</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Scheduled maintenance notices from the PowerAlert Nepal backend.
          </p>
        </div>

        <CitizenSurfaceCard className="mb-6 bg-white/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'border-auth-cyan-charge bg-auth-cyan-charge text-white'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-auth-cyan-charge hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSortAsc((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-auth-cyan-charge hover:text-white"
          >
            Sort by Date {sortAsc ? 'Asc' : 'Desc'}
            <SortIcon />
          </button>
          </div>
        </CitizenSurfaceCard>

        {isLoading ? (
          <CitizenSurfaceCard className="p-8 text-center text-sm text-slate-300">
            Loading maintenance notices...
          </CitizenSurfaceCard>
        ) : error ? (
          <CitizenSurfaceCard className="border-red-400/20 bg-red-400/10 p-8 text-center text-red-100">
            <p className="text-sm">{error}</p>
          </CitizenSurfaceCard>
        ) : (
          <CitizenSurfaceCard className="overflow-hidden bg-white/5">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-auth-deep-current text-white">
                <tr>
                  {['Date', 'Area', 'Type of Work', 'Time Window', 'Status'].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-300">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, index) => (
                    <tr key={row._id} className={`${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'} transition-colors hover:bg-white/15`}>
                      <td className="px-5 py-4 font-medium text-white">{formatDate(row.scheduledStart)}</td>
                      <td className="px-5 py-4 text-slate-200">
                        {row.municipality ? `${row.municipality}, ` : ''}
                        {row.district}
                      </td>
                      <td className="px-5 py-4 text-slate-200">{row.title}</td>
                      <td className="px-5 py-4 text-slate-200">{formatTimeWindow(row.scheduledStart, row.scheduledEnd)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </CitizenSurfaceCard>
        )}
      </div>
    </div>
  )
}
