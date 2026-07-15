import React from 'react'

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 2L1 21h22L12 2zm0 6a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  )
}

function StatusBadge({ status }) {
  if (status === 'active') {
    return (
      <span className="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
        <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
        Active
      </span>
    )
  }

  if (status === 'scheduled') {
    return <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">Scheduled</span>
  }

  return (
    <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
      Restored
    </span>
  )
}

function CardFooter({ status, restoration }) {
  if (status === 'active') {
    return (
      <p className="flex items-center gap-1 text-xs font-medium text-red-600">
        <WarnIcon /> Currently active - power is OFF
      </p>
    )
  }

  if (status === 'restored') {
    return (
      <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
        <CheckIcon /> Power restored at {restoration}
      </p>
    )
  }

  return <p className="text-xs text-slate-500">Estimated restoration by {restoration}</p>
}

export default function OutageCard({ outage }) {
  const isActive = outage.status === 'active'

  return (
    <div className={`flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${isActive ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Area</span>
        <StatusBadge status={outage.status} />
      </div>

      <h3 className="text-[1.05rem] font-semibold leading-snug text-slate-900">{outage.area}</h3>

      <p className="flex items-center gap-1 text-sm text-slate-600">
        <ClockIcon /> {outage.time}
      </p>

      <p className="text-sm leading-6 text-slate-600">
        <span className="font-medium text-slate-800">Reason: </span>{outage.reason}
      </p>

      <div className="mt-auto border-t border-slate-100 pt-3">
        <CardFooter status={outage.status} restoration={outage.restoration} />
      </div>
    </div>
  )
}
