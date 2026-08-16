import React from 'react'

export default function AdminStatCard({ label, value, hint, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-cyan-400/30 bg-cyan-400/10',
    amber: 'border-amber-400/30 bg-amber-400/10',
    sky: 'border-sky-400/30 bg-sky-400/10',
    emerald: 'border-emerald-400/30 bg-emerald-400/10',
    rose: 'border-rose-400/30 bg-rose-400/10',
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
          {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className={`h-11 w-11 rounded-2xl border ${tones[tone] || tones.cyan}`} />
      </div>
    </div>
  )
}
