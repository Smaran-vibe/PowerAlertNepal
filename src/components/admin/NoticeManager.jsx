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

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
      {children}
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

export default function NoticeManager({
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
    <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Maintenance</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Public notices + admin write actions</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Notice listing uses the public endpoint because the backend has no admin GET route. Create, update, and delete still use the admin routes.
          </p>
        </div>

        {loading ? (
          <LoadingBlock label="Loading notices..." />
        ) : error ? (
          <EmptyBlock label={error} />
        ) : notices.length === 0 ? (
          <EmptyBlock label="No maintenance notices found." />
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice._id} className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Maintenance notice</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{notice.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{notice.description}</p>
                  </div>
                  <Badge>{notice.district}</Badge>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-300">
                  <p><span className="text-slate-500">Municipality:</span> {notice.municipality || 'Not set'}</p>
                  <p><span className="text-slate-500">Start:</span> {formatDateTime(notice.scheduledStart)}</p>
                  <p><span className="text-slate-500">End:</span> {formatDateTime(notice.scheduledEnd)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton tone="cyan" onClick={() => onEdit(notice)}>
                    Edit
                  </ActionButton>
                  <ActionButton
                    tone="rose"
                    disabled={busyNoticeId === notice._id}
                    onClick={() => onDelete(notice)}
                  >
                    {busyNoticeId === notice._id ? 'Working...' : 'Delete'}
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
            {editingNoticeId ? 'Edit Notice' : 'Create Notice'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {editingNoticeId ? 'Update maintenance notice' : 'Publish a new notice'}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Fill the form to create or update a notice. Dates should be scheduled in local datetime format.
          </p>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-[#0B1528] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
              <input
                value={noticeForm.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Scheduled maintenance in Lalitpur"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={noticeForm.description}
                onChange={(e) => onChange('description', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Explain the maintenance work and affected area."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">District</label>
                <select
                  value={noticeForm.district}
                  onChange={(e) => onChange('district', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="">Select district</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Lalitpur">Lalitpur</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Municipality</label>
                <input
                  value={noticeForm.municipality}
                  onChange={(e) => onChange('municipality', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="Kathmandu Metropolitan City"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Start</label>
                <input
                  type="datetime-local"
                  value={noticeForm.scheduledStart}
                  onChange={(e) => onChange('scheduledStart', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">End</label>
                <input
                  type="datetime-local"
                  value={noticeForm.scheduledEnd}
                  onChange={(e) => onChange('scheduledEnd', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={noticeSaving}
                className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {noticeSaving ? 'Saving...' : editingNoticeId ? 'Update Notice' : 'Create Notice'}
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
