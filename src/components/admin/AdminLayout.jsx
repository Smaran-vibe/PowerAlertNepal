import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout({
  sections,
  activeSection,
  onSectionChange,
  onLogout,
  currentUserName,
  currentUserRole,
  sectionTitle,
  sectionDescription,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#050B17] text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.15),transparent_26%),radial-gradient(circle_at_80%_15%,rgba(37,99,235,0.20),transparent_28%),linear-gradient(180deg,#050B17_0%,#071428_45%,#050B17_100%)]" />
        <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      <AdminSidebar
        sections={sections}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={onLogout}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
      />

      <div className="lg:pl-72">
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AdminHeader
            sectionTitle={sectionTitle}
            sectionDescription={sectionDescription}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
          />

          {children}
        </main>
      </div>
    </div>
  )
}
