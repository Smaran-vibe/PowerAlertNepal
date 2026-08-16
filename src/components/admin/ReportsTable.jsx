import React from 'react'

const statusTone = {
  Pending: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  Verified: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  Resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Rejected: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
}

function formatDateOnly(value) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleDateString()
}

function Badge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[status] || 'border-white/10 bg-white/5 text-slate-200'}`}>
      {status}
    </span>
  )
}

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

function ActionButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  )
}

export default function ReportsTable({
  reports,
  loading,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onSelectReport,
  emptyLabel = 'No reports available yet.',
  showPagination = true,
}) {
  if (loading) return <LoadingBlock label="Loading reports..." />
  if (error) return <EmptyBlock label={error} />
  if (!reports || reports.length === 0) return <EmptyBlock label={emptyLabel} />

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1528] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-4 font-semibold">Report</th>
                <th className="px-4 py-4 font-semibold">Citizen</th>
                <th className="px-4 py-4 font-semibold">Location</th>
                <th className="px-4 py-4 font-semibold">Outage Type</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reports.map((report) => (
                <tr key={report._id} className="text-slate-200">
                  <td className="px-4 py-4">
                    <p className="max-w-[16rem] truncate font-medium text-white">{report.title}</p>
                  </td>
                  <td className="px-4 py-4">{report.reportedBy?.fullName || 'Unknown'}</td>
                  <td className="px-4 py-4">
                    {report.municipality}, Ward {report.ward}, {report.district}
                  </td>
                  <td className="px-4 py-4">{report.outageType}</td>
                  <td className="px-4 py-4">
                    <Badge status={report.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-400">{formatDateOnly(report.createdAt)}</td>
                  <td className="px-4 py-4">
                    <ActionButton onClick={() => onSelectReport(report)}>
                      View
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0B1528] px-4 py-4 text-sm">
          <p className="text-slate-400">
            Page {page} of {totalPages} - {total} total reports
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
      )}
    </>
  )
}
