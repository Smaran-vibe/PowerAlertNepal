import React from 'react'
import CitizenSurfaceCard from './CitizenSurfaceCard'
import SectionHeader from './SectionHeader'

export default function CitizenAnnouncementsSection({ announcements, loading, error }) {
  return (
    <section className="bg-auth-deep-current px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Public updates"
          title="Latest announcements from NEA"
          description="Published announcements appear here so citizens can see official updates in one place."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <CitizenSurfaceCard className="bg-white/10 px-6 py-14 text-center text-slate-200 md:col-span-2">
              Loading announcements...
            </CitizenSurfaceCard>
          ) : error ? (
            <CitizenSurfaceCard className="border-red-400/20 bg-red-400/10 px-6 py-14 text-center text-red-100 md:col-span-2">
              {error}
            </CitizenSurfaceCard>
          ) : announcements.length === 0 ? (
            <CitizenSurfaceCard className="bg-white/10 px-6 py-14 text-center text-slate-200 md:col-span-2">
              No public announcements have been posted yet.
            </CitizenSurfaceCard>
          ) : (
            announcements.map((announcement) => (
              <CitizenSurfaceCard key={announcement._id} className="bg-white/5 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-auth-cyan-charge">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">{announcement.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{announcement.content}</p>
              </CitizenSurfaceCard>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
