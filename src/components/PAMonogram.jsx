import React from 'react'

export default function PAMonogram({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* P */}
      <path
        d="M6 24V8h5.2a4 4 0 0 1 0 8H6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* A */}
      <path
        d="M17 24l4.3-16 4.3 16M18.7 18h5.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}