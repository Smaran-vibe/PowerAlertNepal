import React from 'react'

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
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

function StatusBadge({ status }) {
  if (status === 'active') {
    return (
      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
        <span className="blink inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
        Active
      </span>
    )
  }
  if (status === 'scheduled') {
    return <span className="bg-brand-purple-light text-brand-purple text-xs font-bold px-2 py-0.5 rounded-full">Scheduled</span>
  }
  return <span className="bg-gray-200 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">Restored</span>
}

function CardFooter({ status, restoration }) {
  if (status === 'active') {
    return (
      <p className="text-xs flex items-center gap-1 text-red-500 font-medium">
        <WarnIcon /> Currently active — power is OFF
      </p>
    )
  }
  if (status === 'restored') {
    return (
      <p className="text-xs flex items-center gap-1 text-green-600 font-medium">
        <CheckIcon /> Power restored at {restoration}
      </p>
    )
  }
  return <p className="text-xs text-gray-400">Estimated restoration by {restoration}</p>
}

export default function OutageCard({ outage }) {
  const isActive = outage.status === 'active'
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${isActive ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Area</span>
        <StatusBadge status={outage.status} />
      </div>
      <h3 className="text-base font-bold text-gray-800">{outage.area}</h3>
      <p className="text-sm flex items-center gap-1 text-gray-500">
        <ClockIcon /> {outage.time}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Reason: </span>{outage.reason}
      </p>
      <div className="mt-auto pt-3 border-t border-gray-100">
        <CardFooter status={outage.status} restoration={outage.restoration} />
      </div>
    </div>
  )
}
