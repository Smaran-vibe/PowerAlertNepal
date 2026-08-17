import { useEffect, useMemo, useState } from 'react'
import toast from '../components/Toast/toast'
import { useAuth } from '../context/AuthContext'
import * as adminService from '../services/admin.service'
import { getErrorMessage } from '../utils/errorHandler'

const API_ORIGIN = import.meta.env.VITE_API_URL
const REPORT_PAGE_SIZE = 8
const USER_PAGE_SIZE = 8
const LIST_LIMIT = 100

const sections = [
  { id: 'dashboard', label: 'Dashboard', title: 'Dashboard', description: 'Monitor outage reports and manage operations.' },
  { id: 'reports', label: 'Reports', title: 'Reports', description: 'Review reports, verify status, and resolve incidents.' },
  { id: 'users', label: 'Users', title: 'Users', description: 'Browse registered users and deactivate accounts when needed.' },
  { id: 'maintenance', label: 'Maintenance', title: 'Maintenance', description: 'Manage public maintenance notices.' },
  { id: 'announcements', label: 'Announcements', title: 'Announcements', description: 'Manage public announcements.' },
]

function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
}

export function useAdminDashboardState() {
  const { user, logout } = useAuth()

  const [activeSection, setActiveSection] = useState('dashboard')

  const [summaryStats, setSummaryStats] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState('')

  const [reportRows, setReportRows] = useState([])
  const [reportPage, setReportPage] = useState(1)
  const [reportTotal, setReportTotal] = useState(0)
  const [reportTotalPages, setReportTotalPages] = useState(1)
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportsError, setReportsError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [busyReportId, setBusyReportId] = useState('')
  const [reportActionModal, setReportActionModal] = useState({ type: null, report: null })
  const [reportActionValue, setReportActionValue] = useState('')
  const [reportActionSubmitting, setReportActionSubmitting] = useState(false)

  const [userRows, setUserRows] = useState([])
  const [userPage, setUserPage] = useState(1)
  const [userTotal, setUserTotal] = useState(0)
  const [userTotalPages, setUserTotalPages] = useState(1)
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [busyUserId, setBusyUserId] = useState('')

  const [notices, setNotices] = useState([])
  const [noticesLoading, setNoticesLoading] = useState(true)
  const [noticesError, setNoticesError] = useState('')
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    district: '',
    municipality: '',
    scheduledStart: '',
    scheduledEnd: '',
  })
  const [editingNoticeId, setEditingNoticeId] = useState(null)
  const [noticeSaving, setNoticeSaving] = useState(false)
  const [busyNoticeId, setBusyNoticeId] = useState('')

  const [announcements, setAnnouncements] = useState([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)
  const [announcementsError, setAnnouncementsError] = useState('')
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    isPublished: true,
  })
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null)
  const [announcementSaving, setAnnouncementSaving] = useState(false)
  const [busyAnnouncementId, setBusyAnnouncementId] = useState('')

  async function loadReportSummary() {
    setSummaryLoading(true)
    setSummaryError('')

    try {
      const result = await adminService.getAdminStats()
      setSummaryStats(result.data.stats)
    } catch (error) {
      setSummaryError(getErrorMessage(error))
      setSummaryStats(null)
    } finally {
      setSummaryLoading(false)
    }
  }

  async function loadReportPage(pageToLoad) {
    setReportsLoading(true)
    setReportsError('')

    try {
      const result = await adminService.getAdminReports({
        page: pageToLoad,
        limit: REPORT_PAGE_SIZE,
        sortBy: 'createdAt',
        order: 'desc',
      })

      const { reports, total, totalPages } = result.data
      setReportRows(reports || [])
      setReportTotal(total || 0)
      setReportTotalPages(Math.max(totalPages || 1, 1))
    } catch (error) {
      setReportsError(getErrorMessage(error))
      setReportRows([])
      setReportTotal(0)
      setReportTotalPages(1)
    } finally {
      setReportsLoading(false)
    }
  }

  async function loadUsers(pageToLoad) {
    setUsersLoading(true)
    setUsersError('')

    try {
      const result = await adminService.getAdminUsers({
        page: pageToLoad,
        limit: USER_PAGE_SIZE,
      })

      const { users, total, totalPages } = result.data
      setUserRows(users || [])
      setUserTotal(total || 0)
      setUserTotalPages(Math.max(totalPages || 1, 1))
    } catch (error) {
      setUsersError(getErrorMessage(error))
      setUserRows([])
      setUserTotal(0)
      setUserTotalPages(1)
    } finally {
      setUsersLoading(false)
    }
  }

  async function loadNotices() {
    setNoticesLoading(true)
    setNoticesError('')

    try {
      const result = await adminService.getPublicNotices({
        page: 1,
        limit: LIST_LIMIT,
      })

      setNotices(result.data.notices || [])
    } catch (error) {
      setNoticesError(getErrorMessage(error))
      setNotices([])
    } finally {
      setNoticesLoading(false)
    }
  }

  async function loadAnnouncements() {
    setAnnouncementsLoading(true)
    setAnnouncementsError('')

    try {
      const result = await adminService.getAdminAnnouncements({
        page: 1,
        limit: LIST_LIMIT,
      })

      setAnnouncements(result.data.announcements || [])
    } catch (error) {
      setAnnouncementsError(getErrorMessage(error))
      setAnnouncements([])
    } finally {
      setAnnouncementsLoading(false)
    }
  }

  useEffect(() => {
    loadReportSummary()
  }, [])

  useEffect(() => {
    loadReportPage(reportPage)
  }, [reportPage])

  useEffect(() => {
    if (activeSection === 'users') {
      loadUsers(userPage)
    }
  }, [activeSection, userPage])

  useEffect(() => {
    if (activeSection === 'maintenance') {
      loadNotices()
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection === 'announcements') {
      loadAnnouncements()
    }
  }, [activeSection])

  useEffect(() => {
    if (reportRows.length === 0) {
      setSelectedReport(null)
      return
    }

    if (!selectedReport) {
      setSelectedReport(reportRows[0])
    }
  }, [reportRows, selectedReport])

  const reportOverview = useMemo(() => ({
    total: summaryStats?.totalReports || 0,
    pending: summaryStats?.pendingReports || 0,
    verified: summaryStats?.verifiedReports || 0,
    resolved: summaryStats?.resolvedReports || 0,
    rejected: summaryStats?.rejectedReports || 0,
  }), [summaryStats])

  const currentUserId = user?._id || user?.id || ''
  const currentUserName = user?.fullName || 'Admin'
  const currentUserRole = user?.role || 'admin'
  const activeSectionMeta = sections.find((section) => section.id === activeSection) || sections[0]
  const recentReports = summaryStats?.recentReports || []

  function refreshReports() {
    loadReportSummary()
    loadReportPage(reportPage)
  }

  async function handleReportAction(type, report, value) {
    if (!report) return

    let confirmMessage = ''
    if (type === 'verify') confirmMessage = `Verify "${report.title}"?`
    if (type === 'resolve') confirmMessage = `Resolve "${report.title}"?`
    if (type === 'reject') confirmMessage = `Reject "${report.title}"?`
    if (type === 'delete') confirmMessage = `Delete "${report.title}" permanently?`

    if (confirmMessage && !window.confirm(confirmMessage)) {
      return
    }

    const key = `${type}:${report._id}`
    setBusyReportId(key)

    try {
      if (type === 'verify') {
        await adminService.verifyReport(report._id)
        toast.success('Report verified.')
      } else if (type === 'resolve') {
        await adminService.resolveReport(report._id, value)
        toast.success('Report resolved.')
      } else if (type === 'reject') {
        await adminService.rejectReport(report._id, value)
        toast.success('Report rejected.')
      } else if (type === 'delete') {
        await adminService.deleteReport(report._id)
        toast.success('Report deleted.')
      }

      setReportActionModal({ type: null, report: null })
      setReportActionValue('')
      if (type === 'delete' && selectedReport?._id === report._id) {
        setSelectedReport(null)
      }
      refreshReports()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyReportId('')
    }
  }

  async function handleUserDeactivate(userRow) {
    if (!userRow) return
    if (!window.confirm(`Deactivate ${userRow.fullName}?`)) return

    setBusyUserId(userRow._id)
    try {
      await adminService.deactivateUser(userRow._id)
      toast.success('User deactivated.')
      loadUsers(userPage)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyUserId('')
    }
  }

  function clearNoticeForm() {
    setEditingNoticeId(null)
    setNoticeForm({
      title: '',
      description: '',
      district: '',
      municipality: '',
      scheduledStart: '',
      scheduledEnd: '',
    })
  }

  function startEditNotice(notice) {
    setEditingNoticeId(notice._id)
    setNoticeForm({
      title: notice.title || '',
      description: notice.description || '',
      district: notice.district || '',
      municipality: notice.municipality || '',
      scheduledStart: toDateTimeLocal(notice.scheduledStart),
      scheduledEnd: toDateTimeLocal(notice.scheduledEnd),
    })
  }

  async function saveNotice(e) {
    e.preventDefault()

    const startDate = new Date(noticeForm.scheduledStart)
    const endDate = new Date(noticeForm.scheduledEnd)

    if (!noticeForm.title.trim() || !noticeForm.description.trim() || !noticeForm.district) {
      toast.error('Title, description, and district are required.')
      return
    }

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      toast.error('Please enter valid start and end times.')
      return
    }

    if (endDate <= startDate) {
      toast.error('End time must be after start time.')
      return
    }

    setNoticeSaving(true)

    const payload = {
      title: noticeForm.title.trim(),
      description: noticeForm.description.trim(),
      district: noticeForm.district,
      municipality: noticeForm.municipality.trim(),
      scheduledStart: startDate.toISOString(),
      scheduledEnd: endDate.toISOString(),
    }

    try {
      if (editingNoticeId) {
        await adminService.updateNotice(editingNoticeId, payload)
        toast.success('Maintenance notice updated.')
      } else {
        const result = await adminService.createNotice(payload)
        setEditingNoticeId(result.data.notice._id)
        toast.success('Maintenance notice created.')
      }

      loadNotices()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setNoticeSaving(false)
    }
  }

  async function removeNotice(notice) {
    if (!notice) return
    if (!window.confirm(`Delete notice "${notice.title}"?`)) return

    setBusyNoticeId(notice._id)
    try {
      await adminService.deleteNotice(notice._id)
      toast.success('Maintenance notice deleted.')
      if (editingNoticeId === notice._id) {
        clearNoticeForm()
      }
      loadNotices()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyNoticeId('')
    }
  }

  function clearAnnouncementForm() {
    setEditingAnnouncementId(null)
    setAnnouncementForm({
      title: '',
      content: '',
      isPublished: true,
    })
  }

  function startEditAnnouncement(announcement) {
    setEditingAnnouncementId(announcement._id)
    setAnnouncementForm({
      title: announcement.title || '',
      content: announcement.content || '',
      isPublished: Boolean(announcement.isPublished),
    })
  }

  async function saveAnnouncement(e) {
    e.preventDefault()
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      toast.error('Title and content are required.')
      return
    }

    setAnnouncementSaving(true)

    const payload = {
      title: announcementForm.title.trim(),
      content: announcementForm.content.trim(),
      isPublished: Boolean(announcementForm.isPublished),
    }

    try {
      if (editingAnnouncementId) {
        await adminService.updateAnnouncement(editingAnnouncementId, payload)
        toast.success('Announcement updated.')
      } else {
        const result = await adminService.createAnnouncement(payload)
        setEditingAnnouncementId(result.data.announcement._id)
        toast.success('Announcement created.')
      }

      loadAnnouncements()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setAnnouncementSaving(false)
    }
  }

  async function removeAnnouncement(announcement) {
    if (!announcement) return
    if (!window.confirm(`Delete announcement "${announcement.title}"?`)) return

    setBusyAnnouncementId(announcement._id)
    try {
      await adminService.deleteAnnouncement(announcement._id)
      toast.success('Announcement deleted.')
      if (editingAnnouncementId === announcement._id) {
        clearAnnouncementForm()
      }
      loadAnnouncements()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyAnnouncementId('')
    }
  }

  return {
    API_ORIGIN,
    sections,
    activeSection,
    setActiveSection,
    activeSectionMeta,
    currentUserId,
    currentUserName,
    currentUserRole,
    logout,
    reportOverview,
    recentReports,
    summaryLoading,
    summaryError,
    reportRows,
    reportPage,
    reportTotal,
    reportTotalPages,
    reportsLoading,
    reportsError,
    selectedReport,
    setSelectedReport,
    busyReportId,
    reportActionModal,
    setReportActionModal,
    reportActionValue,
    setReportActionValue,
    reportActionSubmitting,
    setReportActionSubmitting,
    userRows,
    userPage,
    userTotal,
    userTotalPages,
    usersLoading,
    usersError,
    busyUserId,
    notices,
    noticesLoading,
    noticesError,
    noticeForm,
    editingNoticeId,
    noticeSaving,
    busyNoticeId,
    announcements,
    announcementsLoading,
    announcementsError,
    announcementForm,
    editingAnnouncementId,
    announcementSaving,
    busyAnnouncementId,
    setReportPage,
    setUserPage,
    setNoticeForm,
    setAnnouncementForm,
    refreshReports,
    handleReportAction,
    handleUserDeactivate,
    clearNoticeForm,
    startEditNotice,
    saveNotice,
    removeNotice,
    clearAnnouncementForm,
    startEditAnnouncement,
    saveAnnouncement,
    removeAnnouncement,
    toDateTimeLocal,
  }
}
