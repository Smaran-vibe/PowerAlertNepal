import React from 'react'

export default function CitizenSurfaceCard({ className = '', children }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#0A1E4A]/95 shadow-[0_14px_34px_rgba(2,8,23,0.22)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
