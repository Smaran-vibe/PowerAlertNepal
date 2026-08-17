import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CitizenHero from '../components/citizen/CitizenHero'
import CitizenStatusSummary from '../components/citizen/CitizenStatusSummary'
import CitizenOutageSection from '../components/citizen/CitizenOutageSection'
import CitizenMaintenanceSection from '../components/citizen/CitizenMaintenanceSection'
import CitizenAnnouncementsSection from '../components/citizen/CitizenAnnouncementsSection'
import CitizenReportCta from '../components/citizen/CitizenReportCta'
import { useCitizenPortalData } from '../hooks/useCitizenPortalData'
import heroVideo from '../Reference/poweralert.mp4'

export default function Home() {
  const navigate = useNavigate()
  const {
    publicStats,
    outageCards,
    maintenanceCards,
    publicAnnouncements,
    isLoading,
    error,
    announcementsLoading,
    announcementsError,
  } = useCitizenPortalData()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  const summaryStats = useMemo(() => {
    const districtCount = publicStats?.reportsByDistrict?.length ?? 0

    return [
      {
        label: 'Verified reports',
        value: String(publicStats?.verifiedReports ?? 0),
        tone: 'cyan',
        helper: 'Public reports confirmed by the admin team.',
      },
      {
        label: 'Active outages',
        value: String(publicStats?.totalActiveOutages ?? 0),
        tone: 'blue',
        helper: 'Verified incidents currently affecting supply.',
      },
      {
        label: 'Resolved reports',
        value: String(publicStats?.resolvedReports ?? 0),
        tone: 'slate',
        helper: 'Public outages that have already been restored.',
      },
      {
        label: 'Reports today',
        value: String(publicStats?.reportsToday ?? 0),
        tone: 'amber',
        helper: `${districtCount} district${districtCount === 1 ? '' : 's'} represented in the live feed.`,
      },
    ]
  }, [publicStats])

  function handleSearch() {
    const q = query.trim().toLowerCase()
    if (!q) {
      setResults(null)
      return
    }

    const filtered = outageCards.filter((item) =>
      item.area.toLowerCase().includes(q) ||
      item.ward.toLowerCase().includes(q) ||
      item.reason.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    )

    setResults(filtered)

    setTimeout(() => {
      document.getElementById('current-outages')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="bg-auth-deep-current text-white">
      <CitizenHero
        videoSrc={heroVideo}
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
      />

      <CitizenStatusSummary stats={summaryStats} />

      <CitizenOutageSection
        outages={outageCards}
        isLoading={isLoading}
        error={error}
        results={results}
        onResetResults={() => setResults(null)}
        onViewAllAlerts={() => navigate('/alerts')}
      />

      <CitizenMaintenanceSection notices={maintenanceCards} />

      <CitizenAnnouncementsSection
        announcements={publicAnnouncements}
        loading={announcementsLoading}
        error={announcementsError}
      />

      <CitizenReportCta />
    </div>
  )
}
