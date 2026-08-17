import React from 'react'

export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan-charge">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
