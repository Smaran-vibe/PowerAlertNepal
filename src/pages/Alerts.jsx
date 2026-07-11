import React, { useState } from 'react'
import { outageData } from '../data/outages'
import OutageCard from '../components/OutageCard'

const statusFilters = ['all', 'active', 'scheduled', 'restored']

export default function Alerts() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = outageData.filter(o => {
    const matchesQuery = o.area.toLowerCase().includes(query.toLowerCase()) || o.ward.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Power Cut Alerts</h1>
          <p className="text-gray-500 text-sm">Search and filter all active and upcoming outages across Nepal</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by area or ward..."
            className="flex-1 border border-gray-200 bg-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors capitalize ${statusFilter === s ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-purple hover:text-brand-purple'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-base">No outages match your search.</p>
            <button onClick={() => { setQuery(''); setStatusFilter('all') }} className="mt-3 text-sm text-brand-purple font-semibold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5">Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(outage => (
                <OutageCard key={outage.id} outage={outage} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
