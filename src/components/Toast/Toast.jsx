import React from 'react'

const iconStyles = {
  success: 'text-cyan-200',
  info: 'text-sky-200',
  warning: 'text-amber-200',
  error: 'text-rose-200',
  loading: 'text-cyan-200',
}

const borderStyles = {
  success: 'border-cyan-400/30',
  info: 'border-sky-400/30',
  warning: 'border-amber-400/30',
  error: 'border-rose-400/30',
  loading: 'border-cyan-400/30',
}

const accentStyles = {
  success: 'bg-cyan-400',
  info: 'bg-sky-400',
  warning: 'bg-amber-400',
  error: 'bg-rose-400',
  loading: 'bg-cyan-400',
}

const iconBgStyles = {
  success: 'bg-cyan-400/10 ring-1 ring-cyan-400/20',
  info: 'bg-sky-400/10 ring-1 ring-sky-400/20',
  warning: 'bg-amber-400/10 ring-1 ring-amber-400/20',
  error: 'bg-rose-400/10 ring-1 ring-rose-400/20',
  loading: 'bg-cyan-400/10 ring-1 ring-cyan-400/20',
}

function ToastIcon({ type }) {
  if (type === 'error') {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconStyles[type]}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 4h.01M10.29 3.86l-8.14 14A2 2 0 0 0 3.88 21h16.24a2 2 0 0 0 1.73-3.14l-8.14-14a2 2 0 0 0-3.42 0Z" />
      </svg>
    )
  }

  if (type === 'warning') {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconStyles[type]}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-8.14 14A2 2 0 0 0 3.88 21h16.24a2 2 0 0 0 1.73-3.14l-8.14-14a2 2 0 0 0-3.42 0Z" />
      </svg>
    )
  }

  if (type === 'loading') {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconStyles[type]} animate-spin`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m6.36.64-2.83 2.83M22 12h-4m-.64 6.36-2.83-2.83M12 22v-4m-6.36-.64 2.83-2.83M2 12h4m.64-6.36 2.83 2.83" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconStyles[type]}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export default function Toast({ toast, onDismiss }) {
  return (
    <div
      className={`pointer-events-auto overflow-hidden rounded-2xl border ${borderStyles[toast.type] || borderStyles.info} bg-[#081425]/95 shadow-[0_16px_38px_rgba(2,8,23,0.35)] backdrop-blur-md transition-all duration-200 ${
        toast.closing ? 'translate-y-2 scale-[0.98] opacity-0' : 'translate-y-0 scale-100 opacity-100'
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-4">
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBgStyles[toast.type] || iconBgStyles.info}`}>
          <ToastIcon type={toast.type} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      </div>

      {toast.duration !== Infinity && !toast.closing && (
        <div className="h-1 w-full bg-white/5">
          <div
            className={`toast-progress h-full ${accentStyles[toast.type] || accentStyles.info}`}
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  )
}
