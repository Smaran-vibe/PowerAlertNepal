import React from 'react'

function LoadingBlock({ label = 'Loading...' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-6 text-sm text-slate-400 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      {label}
    </div>
  )
}

function EmptyBlock({ label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-6 text-sm text-slate-400 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      {label}
    </div>
  )
}

function Badge({ tone, children }) {
  const tones = {
    slate: 'border-white/10 bg-white/5 text-slate-200',
    emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
    sky: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  )
}

function ActionButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  )
}

function Pagination({ page, totalPages, total, onPageChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0B1528] px-4 py-4 text-sm">
      <p className="text-slate-400">
        Page {page} of {totalPages} - {total} total users
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default function UsersTable({
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
  emptyLabel = 'No users found for the selected page.',
}) {
  if (loading) return <LoadingBlock label="Loading users..." />
  if (error) return <EmptyBlock label={error} />
  if (!users || users.length === 0) return <EmptyBlock label={emptyLabel} />

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1528] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-4 font-semibold">Full name</th>
                <th className="px-4 py-4 font-semibold">Email</th>
                <th className="px-4 py-4 font-semibold">Role</th>
                <th className="px-4 py-4 font-semibold">Active</th>
                <th className="px-4 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((userRow) => {
                const isSelf = String(userRow._id) === String(currentUserId)

                return (
                  <tr key={userRow._id} className="text-slate-200">
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{userRow.fullName}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{userRow.email}</td>
                    <td className="px-4 py-4">
                      <Badge tone={userRow.role === 'admin' ? 'sky' : 'slate'}>{userRow.role}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone={userRow.isActive ? 'emerald' : 'rose'}>
                        {userRow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {isSelf ? (
                        <Badge tone="slate">Current admin</Badge>
                      ) : (
                        <ActionButton
                          disabled={busyUserId === userRow._id || !userRow.isActive}
                          onClick={() => onDeactivate(userRow)}
                        >
                          {busyUserId === userRow._id ? 'Working...' : 'Deactivate'}
                        </ActionButton>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
    </>
  )
}
