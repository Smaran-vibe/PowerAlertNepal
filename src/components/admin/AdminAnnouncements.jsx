import React from 'react'
import AnnouncementManager from './AnnouncementManager'

export default function AdminAnnouncements({
  announcements,
  loading,
  error,
  announcementForm,
  editingAnnouncementId,
  announcementSaving,
  busyAnnouncementId,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onClear,
}) {
  return (
    <AnnouncementManager
      announcements={announcements}
      loading={loading}
      error={error}
      announcementForm={announcementForm}
      editingAnnouncementId={editingAnnouncementId}
      announcementSaving={announcementSaving}
      busyAnnouncementId={busyAnnouncementId}
      onChange={onChange}
      onSubmit={onSubmit}
      onEdit={onEdit}
      onDelete={onDelete}
      onClear={onClear}
    />
  )
}
