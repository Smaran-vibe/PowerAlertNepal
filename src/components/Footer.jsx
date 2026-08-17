import React from 'react'
import { Link } from 'react-router-dom'
import ElectricPoleIcon from './ElectricPoleIcon'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Power Cuts', to: '/alerts' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Report', to: '/report' },
  { label: 'About', to: '/about' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-navy px-4 py-12 text-slate-300">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <ElectricPoleIcon className="h-5 w-5 text-brand-yellow" />
              <span className="text-lg font-semibold tracking-tight text-white">PowerAlert Nepal</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Area-based power cut alerts for NEA consumers.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-6 text-slate-500">
              PowerAlert Nepal provides a unified view of public outage information, maintenance notices, and citizen reports.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-1 lg:justify-items-end">
            {footerLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 text-xs text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>2026 PowerAlert Nepal. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Informational service for public outage awareness and reporting.</p>
        </div>
      </div>
    </footer>
  )
}
