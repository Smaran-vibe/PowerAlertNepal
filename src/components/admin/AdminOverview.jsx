import React from 'react'
import AdminStatCard from './AdminStatCard'
import ReportsTable from './ReportsTable'

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  )
}

function StatusRow({ label, value, tone = 'cyan', total }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0
  const bars = {
    cyan: 'bg-cyan-400',
    amber: 'bg-amber-400',
    sky: 'bg-sky-400',
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5">
        <div className={`h-2 rounded-full ${bars[tone] || bars.cyan}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function AdminOverview({
  loading,
  error,
  reportOverview,
  recentReports,
  onSelectReport,
}) {
  const total = reportOverview.total || 0

  return (
    <section className="mt-6 space-y-4">
      <SectionTitle
        eyebrow="Dashboard"
        title="Monitor outage reports and manage operations."
        description="Overview of live citizen reports from PowerAlert Nepal."
      />

      {error ? (
        <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-6 text-sm text-slate-400 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AdminStatCard
              label="Total Reports"
              value={loading ? '...' : String(reportOverview.total)}
              hint="Live report data"
              tone="cyan"
            />
            <AdminStatCard label="Pending" value={loading ? '...' : String(reportOverview.pending)} tone="amber" />
            <AdminStatCard label="Verified" value={loading ? '...' : String(reportOverview.verified)} tone="sky" />
            <AdminStatCard label="Resolved" value={loading ? '...' : String(reportOverview.resolved)} tone="emerald" />
            <AdminStatCard label="Rejected" value={loading ? '...' : String(reportOverview.rejected)} tone="rose" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Report Status Overview</h3>
              <div className="mt-5 space-y-4">
                <StatusRow label="Pending" value={reportOverview.pending || 0} tone="amber" total={total} />
                <StatusRow label="Verified" value={reportOverview.verified || 0} tone="sky" total={total} />
                <StatusRow label="Resolved" value={reportOverview.resolved || 0} tone="emerald" total={total} />
                <StatusRow label="Rejected" value={reportOverview.rejected || 0} tone="rose" total={total} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Recent Reports</h3>
              <p className="mt-2 text-sm text-slate-400">Latest citizen outage submissions.</p>
              <div className="mt-4">
                <ReportsTable
                  reports={recentReports}
                  loading={loading}
                  error={error}
                  emptyLabel="No outage reports found."
                  showPagination={false}
                  onSelectReport={onSelectReport}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
