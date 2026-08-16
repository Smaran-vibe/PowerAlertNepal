import React from 'react'
import NoticeManager from './NoticeManager'

export default function AdminMaintenance({
  notices,
  loading,
  error,
  noticeForm,
  editingNoticeId,
  noticeSaving,
  busyNoticeId,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onClear,
}) {
  return (
    <NoticeManager
      notices={notices}
      loading={loading}
      error={error}
      noticeForm={noticeForm}
      editingNoticeId={editingNoticeId}
      noticeSaving={noticeSaving}
      busyNoticeId={busyNoticeId}
      onChange={onChange}
      onSubmit={onSubmit}
      onEdit={onEdit}
      onDelete={onDelete}
      onClear={onClear}
    />
  )
}
