import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { outageData, liveStatusData } from '../data/outages'
import OutageCard from '../components/OutageCard'
import ActionSparkIcon from '../components/ActionSparkIcon'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 2L1 21h22L12 2zm0 6a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  )
}

const stats = [
  { label: 'Districts Covered', value: '30+' },
  { label: 'Active Alerts Today', value: '12' },
  { label: 'Reports Submitted', value: '340+' },
  { label: 'Areas Monitored', value: '200+' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  function handleSearch() {
    const q = query.trim().toLowerCase()
    if (!q) { setResults(outageData); return }
    const filtered = outageData.filter(o => o.area.toLowerCase().includes(q) || o.ward.toLowerCase().includes(q))
    setResults(filtered)
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="text-white py-24 px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10,15,10,0.35) 0%, rgba(10,15,10,0.55) 55%, rgba(8,12,8,0.85) 100%), url('/tower-sunset.jpg')",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white bg-opacity-10 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full mb-5 border border-white border-opacity-20">
            NEA Consumer Alert Platform
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Know power cuts{' '}
            <span className="text-brand-yellow italic">before they happen.</span>
          </h1>
          <p className="text-white text-opacity-85 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Enter your area or ward to see upcoming power cuts with time, reason, and restoration estimate.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your ward or area (e.g. Baneshwar, Ward 10)"
              className="w-full sm:flex-1 px-5 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow border border-white border-opacity-20"
            />
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-brand-yellow hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2"
            >
              <ActionSparkIcon className="w-4 h-4 text-gray-900/80" />
              Get Alerts
            </button>
          </div>
          <p className="text-white text-opacity-70 text-xs mt-4">
            Covering Kathmandu, Lalitpur, Bhaktapur, Pokhara, and 30+ districts
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-brand-purple">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search Results / Default Cards */}
      <section id="search-results" className="py-16 px-4 bg-brand-lavender">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              {results ? 'Search Results' : 'Upcoming Power Cuts'}
            </h2>
            <p className="text-gray-500 text-sm">
              {results
                ? results.length === 0
                  ? 'No outages found for that area.'
                  : `Showing ${results.length} result${results.length !== 1 ? 's' : ''}`
                : 'Showing latest outage data. Search above to filter by your area.'}
            </p>
          </div>

          {results && results.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <SearchIcon />
              <p className="mt-3 text-base">No outages found for that area. Try a different ward or area name.</p>
              <button onClick={() => setResults(null)} className="mt-4 text-sm text-brand-purple font-semibold hover:underline">
                Show all outages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(results || outageData).map(outage => (
                <OutageCard key={outage.id} outage={outage} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/alerts')}
              className="inline-block bg-brand-purple hover:bg-brand-purple-dark text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              View All Alerts
            </button>
          </div>
        </div>
      </section>

      {/* Live Status */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Live Power Status</h2>
            <p className="text-gray-500 text-sm">Current power status for selected areas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {liveStatusData.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm ${item.status === 'on' ? 'border-green-200' : 'border-red-200'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`blink w-4 h-4 rounded-full ${item.status === 'on' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`font-bold text-lg ${item.status === 'on' ? 'text-green-700' : 'text-red-700'}`}>
                    Power is {item.status === 'on' ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-1">{item.area}</p>
                {item.status === 'on' ? (
                  <p className="text-sm text-gray-500">Next scheduled cut: <strong className="text-gray-700">{item.nextCut}</strong></p>
                ) : (
                  <p className="text-sm text-gray-500">Reason: <strong className="text-gray-700">{item.reason}</strong></p>
                )}
                <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-medium ${item.status === 'on' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-700'}`}>
                  {item.status === 'on' ? <CheckIcon /> : <WarnIcon />}
                  {item.status === 'on' ? item.message : `Estimated restoration: ${item.restoration}. ${item.message}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
