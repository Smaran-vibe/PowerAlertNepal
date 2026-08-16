import React from 'react'

export default function AdminSidebar({
  sections,
  activeSection,
  onSectionChange,
  onLogout,
  currentUserName,
  currentUserRole,
}) {
  function iconFor(sectionId) {
    const common = 'h-4 w-4 stroke-current'

    switch (sectionId) {
      case 'dashboard':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={common}>
            <path d="M4 13h6V4H4v9Zm10 7h6V11h-6v9ZM14 4v5h6V4h-6ZM4 20h6v-5H4v5Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'reports':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={common}>
            <path d="M6 4h9l3 3v13H6V4Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 4v3h3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12h6M9 16h6" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )
      case 'users':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={common}>
            <circle cx="9" cy="7" r="3" strokeWidth="1.6" />
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 21v-2a3.5 3.5 0 0 0-2.5-3.35" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M16.5 4.5a3 3 0 0 1 0 5.9" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )
      case 'maintenance':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={common}>
            <path d="M14.7 6.3a4 4 0 0 0-5.7 5.7L4 17v3h3l5-5.03a4 4 0 0 0 2.7-1.17l4.9 4.9a2 2 0 0 0 2.8-2.8l-4.7-4.7a4 4 0 0 0-3-4.9Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'announcements':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={common}>
            <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 9a4 4 0 0 1 0 6" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M17.5 6.5a8 8 0 0 1 0 11" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r border-white/10 bg-[#07101E]/95 px-5 py-6 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
            <span className="text-lg font-bold">PA</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">POWERALERT</p>
            <p className="text-xs tracking-[0.24em] text-slate-400">ADMIN</p>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === section.id
                  ? 'bg-cyan-400/15 text-white shadow-[inset_0_0_0_1px_rgba(34,211,238,0.22)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-3">
                <span className={activeSection === section.id ? 'text-cyan-200' : 'text-slate-400'}>
                  {iconFor(section.id)}
                </span>
                <span>{section.label}</span>
              </span>
              {activeSection === section.id && <span className="h-2 w-2 rounded-full bg-cyan-300" />}
            </button>
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Logged in</p>
          <p className="mt-1 text-sm font-semibold text-white">{currentUserName}</p>
          <p className="mt-1 text-xs text-slate-400">{currentUserRole}</p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#06101D]/80 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-white">POWERALERT</p>
            <p className="text-xs tracking-[0.24em] text-slate-400">ADMIN</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"
          >
            Logout
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-4">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${activeSection === section.id
                  ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                  : 'border-white/10 bg-white/5 text-slate-300'
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
