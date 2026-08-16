import React from 'react'

function initials(name) {
  if (!name) return 'A'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function AdminHeader({ sectionTitle, sectionDescription, currentUserName, currentUserRole }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#081120]/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{sectionTitle}</h1>
        {sectionDescription ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{sectionDescription}</p> : null}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">
          {initials(currentUserName)}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
          <p className="text-sm font-semibold text-white">{currentUserName}</p>
          <p className="text-xs text-slate-500">{currentUserRole}</p>
        </div>
      </div>
    </div>
  )
}
