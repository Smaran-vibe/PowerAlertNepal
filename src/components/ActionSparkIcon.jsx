import React from 'react'

export default function ActionSparkIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3.5z" />
      <path d="M12 2.5v1.2" />
      <path d="M12 20.3v1.2" />
      <path d="M3.7 12H2.5" />
      <path d="M21.5 12h-1.2" />
    </svg>
  )
}
