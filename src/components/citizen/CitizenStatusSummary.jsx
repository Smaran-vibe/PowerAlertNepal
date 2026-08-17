import React from 'react'
import CitizenSurfaceCard from './CitizenSurfaceCard'

const tones = {
  cyan: 'from-auth-cyan-charge/20 to-transparent text-white',
  blue: 'from-auth-volt-blue/20 to-transparent text-white',
  slate: 'from-white/10 to-transparent text-white',
  amber: 'from-amber-400/15 to-transparent text-white',
}

export default function CitizenStatusSummary({ stats }) {
  return (
    <section className="bg-auth-deep-current px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <CitizenSurfaceCard
            key={stat.label}
            className={`!bg-gradient-to-br ${tones[stat.tone] || tones.slate} border-white/10 px-5 py-5`}
          >
            <p className="text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-white/90">{stat.label}</p>
            {stat.helper && <p className="mt-3 text-xs leading-5 text-slate-200">{stat.helper}</p>}
          </CitizenSurfaceCard>
        ))}
      </div>
    </section>
  )
}
