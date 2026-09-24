import React from 'react'

export function Skeleton({ className = '', dark = false }) {
  return <div className={`${dark ? 'shimmer-dark' : 'shimmer'} rounded-md ${className}`} />
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      <Skeleton className="h-5 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonAvatar({ size = 'h-10 w-10' }) {
  return <Skeleton className={`${size} rounded-full`} />
}