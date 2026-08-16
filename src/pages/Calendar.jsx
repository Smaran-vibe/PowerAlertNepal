import React, { useEffect, useMemo, useState } from 'react'
import * as noticeService from '../services/notice.service'
import { getErrorMessage } from '../utils/errorHandler'

const statusFilters = ['all', 'upcoming', 'active', 'completed']

function StatusBadge({ status }) {
  const styles = {
    upcoming: 'border-amber-400/30 bg-amber-400/10 text-amber-700',
    active: 'border-red-400/30 bg-red-400/10 text-red-700',
    completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-700',
  }

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-bold capitalize ${styles[status] || styles.upcoming}`}>
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
    <div className="min-h-screen bg-brand-lavender px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="mb-2 font-sans text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
          <p className="text-sm text-gray-500">Scheduled maintenance notices from the PowerAlert Nepal backend.</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'border-brand-purple bg-brand-purple text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-purple hover:text-brand-purple'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSortAsc((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg border border-brand-purple bg-white px-4 py-2 text-sm font-medium text-brand-purple transition-colors hover:border-brand-purple-dark hover:text-brand-purple-dark"
          >
            Sort by Date {sortAsc ? 'Asc' : 'Desc'}
            <SortIcon />
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            Loading maintenance notices...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#D8E7F0] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-navy text-white">
                <tr>
                  {['Date', 'Area', 'Type of Work', 'Time Window', 'Status'].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, index) => (
                    <tr key={row._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFE]'} transition-colors hover:bg-brand-lavender`}>
                      <td className="px-5 py-4 font-medium text-slate-700">{formatDate(row.scheduledStart)}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {row.municipality ? `${row.municipality}, ` : ''}
                        {row.district}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{row.title}</td>
                      <td className="px-5 py-4 text-slate-600">{formatTimeWindow(row.scheduledStart, row.scheduledEnd)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
