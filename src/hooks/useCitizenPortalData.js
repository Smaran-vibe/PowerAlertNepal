import { useEffect, useMemo, useState } from 'react'
import * as reportService from '../services/report.service'
import * as noticeService from '../services/notice.service'
import * as announcementService from '../services/announcement.service'
import * as statsService from '../services/stats.service'
import { getErrorMessage } from '../utils/errorHandler'

function deriveOutageStatus(report) {
  if (report.status === 'Verified') return 'active'
  if (report.status === 'Resolved') return 'restored'
  return null
}

function formatOutageReason(report) {
  return report.outageType || report.description || 'No reason provided'
}

function mapReportToOutage(report) {
  const status = deriveOutageStatus(report)
  if (!status) return null

  return {
    id: report._id,
    area: `${report.municipality}, Ward ${report.ward}, ${report.district}`,
    time: new Date(report.createdAt).toLocaleString(),
    reason: formatOutageReason(report),
    status,
    restoration: report.estimatedRestoreTime
      ? new Date(report.estimatedRestoreTime).toLocaleString()
      : 'TBD',
    ward: `Ward ${report.ward}`,
  }
}

function deriveMaintenanceStatus(notice) {
  const now = new Date()
  const start = new Date(notice.scheduledStart)
  const end = new Date(notice.scheduledEnd)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'planned'
  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'active'
  return 'completed'
}

function mapNoticeToMaintenanceRow(notice) {
  return {
    id: notice._id,
    date: new Date(notice.scheduledStart).toLocaleDateString(),
    area: `${notice.municipality ? `${notice.municipality}, ` : ''}${notice.district}`,
    work: notice.title,
    time: `${new Date(notice.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(notice.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    status: deriveMaintenanceStatus(notice),
  }
}

export function useCitizenPortalData() {
  const [publicReports, setPublicReports] = useState([])
  const [publicNotices, setPublicNotices] = useState([])
  const [publicAnnouncements, setPublicAnnouncements] = useState([])
  const [publicStats, setPublicStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)
  const [announcementsError, setAnnouncementsError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadHomeData() {
      setIsLoading(true)
      setError('')

      try {
        const [reportsResult, noticesResult, statsResult] = await Promise.all([
          reportService.getPublicReports({
            page: 1,
            limit: 100,
            sortBy: 'createdAt',
            order: 'desc',
          }),
          noticeService.getPublicNotices({
            page: 1,
            limit: 100,
          }),
          statsService.getPublicStats(),
        ])

        if (cancelled) return

        setPublicReports(reportsResult.data.reports || [])
        setPublicNotices(noticesResult.data.notices || [])
        setPublicStats(statsResult.data.stats || null)
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadAnnouncements() {
      setAnnouncementsLoading(true)
      setAnnouncementsError('')

      try {
        const result = await announcementService.getPublicAnnouncements({
          page: 1,
          limit: 3,
        })

        if (!cancelled) {
          setPublicAnnouncements(result.data.announcements || [])
        }
      } catch (err) {
        if (!cancelled) {
          setAnnouncementsError(getErrorMessage(err))
          setPublicAnnouncements([])
        }
      } finally {
        if (!cancelled) {
          setAnnouncementsLoading(false)
        }
      }
    }

    loadAnnouncements()

    return () => {
      cancelled = true
    }
  }, [])

  const outageCards = useMemo(
    () => publicReports.map(mapReportToOutage).filter(Boolean),
    [publicReports]
  )

  const maintenanceCards = useMemo(
    () => publicNotices.map(mapNoticeToMaintenanceRow),
    [publicNotices]
  )

  return {
    publicReports,
    publicNotices,
    publicAnnouncements,
    publicStats,
    outageCards,
    maintenanceCards,
    isLoading,
    error,
    announcementsLoading,
    announcementsError,
  }
}
