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
    <footer className="bg-brand-navy text-gray-300 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ElectricPoleIcon className="w-5 h-5 text-brand-yellow" />
              <span className="font-display text-lg font-semibold text-white">PowerAlert Nepal</span>
            </div>
            <p className="text-xs text-gray-400">Area-based power cut alerts for NEA consumers</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
            {footerLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>2026 PowerAlert Nepal. Not real project</p>
          <p>No real NEA services are provided. All data is mock.</p>
        </div>
      </div>
    </footer>
  )
}
