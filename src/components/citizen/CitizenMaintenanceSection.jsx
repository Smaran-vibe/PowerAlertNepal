import React from 'react'
import CitizenSurfaceCard from './CitizenSurfaceCard'
import SectionHeader from './SectionHeader'

const statusLabels = {
  upcoming: 'Upcoming',
  active: 'Active',
  planned: 'Planned',
  completed: 'Completed',
}

const statusStyles = {
  upcoming: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  active: 'border-red-400/30 bg-red-400/10 text-red-100',
  planned: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
}

export default function CitizenMaintenanceSection({ notices }) {
  return (
    <section className="bg-[#07111F] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Maintenance notices"
          title="Scheduled work published by NEA"
          description="Use the maintenance schedule to plan around line work, transformer upgrades, and other planned service interruptions."
        />

        {notices.length === 0 ? (
          <CitizenSurfaceCard className="bg-white/10 px-6 py-14 text-center text-slate-200">
            No maintenance notices available right now.
          </CitizenSurfaceCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notices.map((row) => (
              <CitizenSurfaceCard key={row.id} className="bg-white/5 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{row.date}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{row.area}</h3>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[row.status] || statusStyles.upcoming}`}>
                    {statusLabels[row.status] || 'Upcoming'}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  <p>
                    <span className="font-medium text-white">Work: </span>
                    {row.work}
                  </p>
                  <p>
                    <span className="font-medium text-white">Time window: </span>
                    {row.time}
                  </p>
                </div>
              </CitizenSurfaceCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
