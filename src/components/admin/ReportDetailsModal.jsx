import React from 'react'

const statusTone = {
  Pending: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  Verified: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  Resolved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Rejected: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
}

function formatDateTime(value) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleString()
}

function Badge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[status] || 'border-white/10 bg-white/5 text-slate-200'}`}>
      {status}
    </span>
  )
}

function ActionButton({ tone = 'slate', children, ...props }) {
  const styles = {
    slate: 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
    cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15',
    amber: 'border-amber-400/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/15',
    sky: 'border-sky-400/30 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15',
  }

  return (
    <button
      type="button"
      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[tone] || styles.slate}`}
      {...props}
    >
      {children}
    </button>
  )
}

function EmptyBlock({ label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-6 text-sm text-slate-400 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      {label}
    </div>
  )
}

function Modal({ title, description, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A1222] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {description && <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-400 hover:text-white">
            Close
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

export default function ReportDetailsModal({
  report,
  apiOrigin,
  busyReportId,
  onVerify,
  onOpenResolve,
  onOpenReject,
  onDelete,
  actionModal,
  actionModalValue,
  onActionModalValueChange,
  onActionModalClose,
  onActionModalSubmit,
  actionModalSubmitting,
}) {
  if (!report) {
    return <EmptyBlock label="Select a report from the table to see details and actions." />
  }

  const badgeStatus = report.status

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Report ID</p>
            <p className="mt-1 break-all text-sm text-slate-300">{report._id}</p>
          </div>
          <Badge status={badgeStatus} />
        </div>

        <h3 className="mt-4 text-xl font-semibold text-white">{report.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{report.description}</p>

        <div className="mt-4 grid gap-3 text-sm text-slate-300">
          <div><span className="text-slate-500">Citizen:</span> {report.reportedBy?.fullName || 'Unknown'}</div>
          <div><span className="text-slate-500">Location:</span> {report.municipality}, Ward {report.ward}, {report.district}</div>
          <div><span className="text-slate-500">Outage type:</span> {report.outageType}</div>
          <div><span className="text-slate-500">Submitted:</span> {formatDateTime(report.createdAt)}</div>
          <div><span className="text-slate-500">Last update:</span> {formatDateTime(report.updatedAt)}</div>
          {report.estimatedRestoreTime && (
            <div><span className="text-slate-500">Estimated restore:</span> {formatDateTime(report.estimatedRestoreTime)}</div>
          )}
          {report.rejectionReason && (
            <div><span className="text-slate-500">Rejection reason:</span> {report.rejectionReason}</div>
          )}
        </div>

        {report.image && (
          <img
            src={`${apiOrigin}${report.image}`}
            alt={report.title}
            className="mt-4 h-44 w-full rounded-2xl border border-white/10 object-cover"
          />
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ActionButton
            tone="sky"
            disabled={busyReportId === `verify:${report._id}`}
            onClick={() => onVerify(report)}
          >
            {busyReportId === `verify:${report._id}` ? 'Working...' : 'Verify'}
          </ActionButton>
          <ActionButton
            tone="cyan"
            disabled={busyReportId === `resolve:${report._id}`}
            onClick={() => onOpenResolve(report)}
          >
            Resolve
          </ActionButton>
          <ActionButton
            tone="amber"
            disabled={busyReportId === `reject:${report._id}`}
            onClick={() => onOpenReject(report)}
          >
            Reject
          </ActionButton>
          <ActionButton
            tone="rose"
            disabled={busyReportId === `delete:${report._id}`}
            onClick={() => onDelete(report)}
          >
            Delete
          </ActionButton>
        </div>
      </div>

      {actionModal?.type && actionModal?.report?._id === report._id && (
        <Modal
          title={actionModal.type === 'resolve' ? 'Resolve report' : 'Reject report'}
          description={
            actionModal.type === 'resolve'
              ? 'Enter the estimated restore time in local datetime format.'
              : 'Enter a short rejection reason before submitting.'
          }
          onClose={onActionModalClose}
        >
          {actionModal.type === 'resolve' ? (
            <div className="space-y-4">
              <input
                type="datetime-local"
                value={actionModalValue}
                onChange={(e) => onActionModalValueChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={actionModalSubmitting}
                  onClick={() => onActionModalSubmit('resolve', report, actionModalValue)}
                  className="flex-1 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionModalSubmitting ? 'Saving...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={onActionModalClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                rows={4}
                value={actionModalValue}
                onChange={(e) => onActionModalValueChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                placeholder="Reason for rejection"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={actionModalSubmitting}
                  onClick={() => onActionModalSubmit('reject', report, actionModalValue)}
                  className="flex-1 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionModalSubmitting ? 'Saving...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={onActionModalClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
