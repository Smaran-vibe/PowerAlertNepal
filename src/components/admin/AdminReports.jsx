import React from 'react'
import ReportsTable from './ReportsTable'
import ReportDetailsModal from './ReportDetailsModal'

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  )
}

export default function AdminReports({
  reports,
  loading,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onSelectReport,
  selectedReport,
  busyReportId,
  apiOrigin,
  actionModal,
  actionModalValue,
  onActionModalValueChange,
  onActionModalClose,
  onActionModalSubmit,
  actionModalSubmitting,
  onVerify,
  onOpenResolve,
  onOpenReject,
  onDelete,
}) {
  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        <SectionTitle
          eyebrow="Reports"
          title="Report management"
          description="Review reports, inspect details, and apply verification, resolution, rejection, or deletion actions."
        />
        <ReportsTable
          reports={reports}
          loading={loading}
          error={error}
          page={page}
          total={total}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onSelectReport={onSelectReport}
          emptyLabel="No outage reports found."
        />
      </div>

      <div className="space-y-4">
        <SectionTitle
          eyebrow="Selected Report"
          title="Details and actions"
          description="Open a report to review the citizen submission and apply the available admin actions."
        />
        <ReportDetailsModal
          report={selectedReport}
          apiOrigin={apiOrigin}
          busyReportId={busyReportId}
          onVerify={onVerify}
          onOpenResolve={onOpenResolve}
          onOpenReject={onOpenReject}
          onDelete={onDelete}
          actionModal={actionModal}
          actionModalValue={actionModalValue}
          onActionModalValueChange={onActionModalValueChange}
          onActionModalClose={onActionModalClose}
          onActionModalSubmit={onActionModalSubmit}
          actionModalSubmitting={actionModalSubmitting}
        />
      </div>
    </section>
  )
}
