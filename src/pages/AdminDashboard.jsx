import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AdminLayout from '../components/admin/AdminLayout'
import AdminOverview from '../components/admin/AdminOverview'
import AdminReports from '../components/admin/AdminReports'
import AdminUsers from '../components/admin/AdminUsers'
import AdminMaintenance from '../components/admin/AdminMaintenance'
import AdminAnnouncements from '../components/admin/AdminAnnouncements'
import { useAdminDashboardState } from '../hooks/useAdminDashboard'

export default function AdminDashboard() {
  const admin = useAdminDashboardState()
  const navigate = useNavigate()

  const content = (() => {
    if (admin.activeSection === 'dashboard') {
      return (
        <AdminOverview
          loading={admin.summaryLoading}
          error={admin.summaryError}
          reportOverview={admin.reportOverview}
          recentReports={admin.recentReports}
          onSelectReport={(report) => {
            admin.setActiveSection('reports')
            admin.setSelectedReport(report)
          }}
        />
      )
    }

    if (admin.activeSection === 'reports') {
      return (
        <AdminReports
          reports={admin.reportRows}
          loading={admin.reportsLoading}
          error={admin.reportsError}
          page={admin.reportPage}
          total={admin.reportTotal}
          totalPages={admin.reportTotalPages}
          onPageChange={admin.setReportPage}
          onSelectReport={admin.setSelectedReport}
          selectedReport={admin.selectedReport}
          busyReportId={admin.busyReportId}
          apiOrigin={admin.API_ORIGIN}
          actionModal={admin.reportActionModal}
          actionModalValue={admin.reportActionValue}
          onActionModalValueChange={admin.setReportActionValue}
          onActionModalClose={() => {
            admin.setReportActionModal({ type: null, report: null })
            admin.setReportActionValue('')
          }}
          onActionModalSubmit={async (type, report, value) => {
            if (type === 'resolve' && !value) {
              toast.error('Estimated restore time is required.')
              return
            }

            if (type === 'reject' && !String(value || '').trim()) {
              toast.error('Rejection reason is required.')
              return
            }

            admin.setReportActionSubmitting(true)
            try {
              if (type === 'resolve') {
                await admin.handleReportAction('resolve', report, new Date(value).toISOString())
              } else {
                await admin.handleReportAction('reject', report, String(value).trim())
              }
            } finally {
              admin.setReportActionSubmitting(false)
            }
          }}
          actionModalSubmitting={admin.reportActionSubmitting}
          onVerify={(report) => admin.handleReportAction('verify', report)}
          onOpenResolve={(report) => {
            admin.setReportActionModal({ type: 'resolve', report })
            admin.setReportActionValue(admin.toDateTimeLocal(report.estimatedRestoreTime))
          }}
          onOpenReject={(report) => {
            admin.setReportActionModal({ type: 'reject', report })
            admin.setReportActionValue(report.rejectionReason || '')
          }}
          onDelete={(report) => admin.handleReportAction('delete', report)}
        />
      )
    }

    if (admin.activeSection === 'users') {
      return (
        <AdminUsers
          users={admin.userRows}
          loading={admin.usersLoading}
          error={admin.usersError}
          page={admin.userPage}
          total={admin.userTotal}
          totalPages={admin.userTotalPages}
          onPageChange={admin.setUserPage}
          onDeactivate={admin.handleUserDeactivate}
          currentUserId={admin.currentUserId}
          busyUserId={admin.busyUserId}
        />
      )
    }

    if (admin.activeSection === 'maintenance') {
      return (
        <AdminMaintenance
          notices={admin.notices}
          loading={admin.noticesLoading}
          error={admin.noticesError}
          noticeForm={admin.noticeForm}
          editingNoticeId={admin.editingNoticeId}
          noticeSaving={admin.noticeSaving}
          busyNoticeId={admin.busyNoticeId}
          onChange={(field, value) => admin.setNoticeForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={admin.saveNotice}
          onEdit={admin.startEditNotice}
          onDelete={admin.removeNotice}
          onClear={admin.clearNoticeForm}
        />
      )
    }

    return (
      <AdminAnnouncements
        announcements={admin.announcements}
        loading={admin.announcementsLoading}
        error={admin.announcementsError}
        announcementForm={admin.announcementForm}
        editingAnnouncementId={admin.editingAnnouncementId}
        announcementSaving={admin.announcementSaving}
        busyAnnouncementId={admin.busyAnnouncementId}
        onChange={(field, value) => admin.setAnnouncementForm((prev) => ({ ...prev, [field]: value }))}
        onSubmit={admin.saveAnnouncement}
        onEdit={admin.startEditAnnouncement}
        onDelete={admin.removeAnnouncement}
        onClear={admin.clearAnnouncementForm}
      />
    )
  })()

  return (
    <AdminLayout
      sections={admin.sections.map(({ id, label }) => ({ id, label }))}
      activeSection={admin.activeSection}
      onSectionChange={admin.setActiveSection}
      onLogout={async () => {
        await admin.logout()
        navigate('/')
      }}
      currentUserName={admin.currentUserName}
      currentUserRole={admin.currentUserRole}
      sectionTitle={admin.activeSectionMeta.title}
      sectionDescription={admin.activeSectionMeta.description}
    >
      {content}
    </AdminLayout>
  )
}
