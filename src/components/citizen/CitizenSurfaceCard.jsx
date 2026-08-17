import React from 'react'

export default function CitizenSurfaceCard({ className = '', children }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#0A1E4A]/95 shadow-[0_18px_45px_rgba(2,8,23,0.28)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
