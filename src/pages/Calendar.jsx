import React, { useState } from 'react'
import { maintenanceData } from '../data/outages'

const statusFilters = ['all', 'active', 'upcoming', 'planned', 'completed']

function StatusBadge({ status }) {
  const styles = {
    upcoming: 'bg-amber-50 text-amber-700',
    active: 'bg-red-100 text-red-700',
    planned: 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
  }
  const labels = { upcoming: 'Upcoming', active: 'Active', planned: 'Planned', completed: 'Completed' }
  return (
    <span className={`${styles[status]} text-xs font-bold px-2 py-0.5 rounded-full capitalize`}>
      {labels[status]}
    </span>
  )
}

function SortIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  )
}

export default function Calendar() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = maintenanceData
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date)
      return sortAsc ? diff : -diff
    })

  return (
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-sans text-3xl font-bold text-gray-900 mb-2">Maintenance Calendar</h1>
          <p className="text-gray-500 text-sm">Scheduled maintenance published by NEA — updated weekly</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors capitalize ${statusFilter === s ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-purple hover:text-brand-purple'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortAsc(prev => !prev)}
            className="flex items-center gap-1 rounded-lg border border-brand-purple bg-white px-4 py-2 text-sm font-medium text-brand-purple transition-colors hover:border-brand-purple-dark hover:text-brand-purple-dark"
          >
            Sort by Date {sortAsc ? 'Asc' : 'Desc'}
            <SortIcon />
          </button>
        </div>

        {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#D8E7F0] shadow-sm bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-navy text-white">
              <tr>
                {['Date', 'Area', 'Type of Work', 'Time Window', 'Status'].map(h => (
                  <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">No records found.</td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFE]'} hover:bg-brand-lavender transition-colors`}>
                    <td className="px-5 py-4 font-medium text-slate-700">{row.date}</td>
                    <td className="px-5 py-4 text-slate-600">{row.area}</td>
                    <td className="px-5 py-4 text-slate-600">{row.work}</td>
                    <td className="px-5 py-4 text-slate-600">{row.time}</td>
                    <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
