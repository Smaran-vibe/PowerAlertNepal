import React from 'react'
import CitizenOutageCard from './CitizenOutageCard'
import CitizenSurfaceCard from './CitizenSurfaceCard'
import SectionHeader from './SectionHeader'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export default function CitizenOutageSection({ outages, isLoading, error, results, onResetResults, onViewAllAlerts }) {
  const displayOutages = results || outages

  return (
    <section id="current-outages" className="bg-auth-deep-current px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Verified power cuts"
          title={results ? 'Search results' : 'Recent verified outages'}
          description={
            results
              ? `Showing ${results.length} result${results.length !== 1 ? 's' : ''} from the verified public feed.`
              : 'Verified outage information from the public feed.'
          }
          action={
            <button
              type="button"
              onClick={onViewAllAlerts}
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              View all alerts
            </button>
          }
        />

        {isLoading ? (
          <CitizenSurfaceCard className="bg-white/10 px-6 py-14 text-center text-slate-200">
            Loading current outage data...
          </CitizenSurfaceCard>
        ) : error ? (
          <CitizenSurfaceCard className="border-red-400/20 bg-red-400/10 px-6 py-14 text-center text-red-100">
            {error}
          </CitizenSurfaceCard>
        ) : displayOutages.length === 0 ? (
          <CitizenSurfaceCard className="bg-white/10 px-6 py-14 text-center text-slate-200">
            <SearchIcon />
            <p className="mt-4 text-base">
              No verified outages currently
            </p>
            {results && (
              <button
                type="button"
                onClick={onResetResults}
                className="mt-4 text-sm font-semibold text-auth-cyan-charge hover:underline"
              >
                Show all outages
              </button>
            )}
          </CitizenSurfaceCard>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayOutages.map((outage) => (
              <CitizenOutageCard key={outage.id} outage={outage} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
