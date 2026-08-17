import React from 'react'

function formatDateTime(value) {
  if (!value) return 'Not set'
  return new Date(value).toLocaleString()
}

function LoadingBlock({ label = 'Loading...' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-6 text-sm text-slate-400 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      {label}
    </div>
  )
}

function EmptyBlock({ label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1528] p-6 text-sm text-slate-400 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
      {label}
    </div>
  )
}

function Badge({ published }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${published ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/30 bg-amber-400/10 text-amber-200'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

function ActionButton({ tone = 'cyan', children, ...props }) {
  const styles = {
    cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15',
  }

  return (
    <button
      type="button"
      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[tone]}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function AnnouncementManager({
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
    <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Announcements</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Announcement feed</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Manage public announcements from one place. Published items appear in the citizen portal, while drafts can be saved, edited, or removed here.
          </p>
        </div>

        {loading ? (
          <LoadingBlock label="Loading announcements..." />
        ) : error ? (
          <EmptyBlock label={error} />
        ) : announcements.length === 0 ? (
          <EmptyBlock label="No announcements available." />
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Announcement</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{announcement.title}</h3>
                  </div>
                  <Badge published={announcement.isPublished} />
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">{announcement.content}</p>
                <div className="mt-4 text-sm text-slate-300">
                  <p><span className="text-slate-500">Created:</span> {formatDateTime(announcement.createdAt)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton tone="cyan" onClick={() => onEdit(announcement)}>
                    Edit
                  </ActionButton>
                  <ActionButton
                    tone="rose"
                    disabled={busyAnnouncementId === announcement._id}
                    onClick={() => onDelete(announcement)}
                  >
                    {busyAnnouncementId === announcement._id ? 'Working...' : 'Delete'}
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            {editingAnnouncementId ? 'Edit Announcement' : 'Create Announcement'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {editingAnnouncementId ? 'Update announcement' : 'Publish an announcement'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Use this form to create or update an announcement, then choose whether it should be published immediately.
          </p>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
              <input
                value={announcementForm.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Service interruption update"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Content</label>
              <textarea
                value={announcementForm.content}
                onChange={(e) => onChange('content', e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Write the announcement details."
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={announcementForm.isPublished}
                onChange={(e) => onChange('isPublished', e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400"
              />
              Make this announcement visible to the public
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={announcementSaving}
                className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {announcementSaving ? 'Saving...' : editingAnnouncementId ? 'Update Announcement' : 'Create Announcement'}
              </button>
              <button
                type="button"
                onClick={onClear}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
