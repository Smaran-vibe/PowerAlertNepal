import React from 'react'
import UsersTable from './UsersTable'

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  )
}

export default function AdminUsers({
  users,
  loading,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onDeactivate,
  currentUserId,
  busyUserId,
}) {
  return (
    <section className="mt-6 space-y-4">
      <SectionTitle
        eyebrow="Users"
        title="User management"
        description="Browse registered users and deactivate accounts when needed. Self-deactivation is blocked."
      />
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onDeactivate={onDeactivate}
        currentUserId={currentUserId}
        busyUserId={busyUserId}
      />
    </section>
  )
}
