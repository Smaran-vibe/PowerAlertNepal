import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ActionSparkIcon from '../components/ActionSparkIcon'
import { useAuth } from '../context/AuthContext'

const REPORT_DRAFT_KEY = 'pa_report_draft'

const issueTypes = [
  'Scheduled outage (known)',
  'Unexpected power cut',
  'Transformer issue',
  'Fallen electric pole or wire',
  'Voltage fluctuation',
  'Other',
]

function readDraft() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REPORT_DRAFT_KEY) || 'null')
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function getInitialForm(routeDraft) {
  const savedDraft = readDraft()
  const draft = routeDraft && typeof routeDraft === 'object' ? routeDraft : null

  return {
    name: draft?.name || savedDraft?.name || '',
    area: draft?.area || savedDraft?.area || '',
    issue: draft?.issue || savedDraft?.issue || '',
    details: draft?.details || savedDraft?.details || '',
  }
}

export default function Report() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [form, setForm] = useState(() => getInitialForm(location.state?.reportDraft))
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [reports, setReports] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pa_reports') || '[]')
    setReports(saved)
  }, [])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.area.trim()) e.area = 'Area is required.'
    if (!form.issue) e.issue = 'Please select an issue type.'
    if (!form.details.trim()) e.details = 'Please describe the issue.'
    return e
  }

  function handleChange(e) {
    const nextForm = { ...form, [e.target.name]: e.target.value }
    setForm(nextForm)
    localStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(nextForm))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }

    if (!isAuthenticated) {
      localStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(form))
      setShowAuthPrompt(true)
      return
    }

    const newReport = {
      id: Date.now(),
      name: form.name.trim(),
      area: form.area.trim(),
      issue: form.issue,
      details: form.details.trim(),
      submittedAt: new Date().toLocaleString(),
    }

    const updated = [newReport, ...reports]
    setReports(updated)
    localStorage.setItem('pa_reports', JSON.stringify(updated))

    setForm({ name: '', area: '', issue: '', details: '' })
    localStorage.removeItem(REPORT_DRAFT_KEY)
    setErrors({})
    setSuccess(true)
    setTimeout(() => setSuccess(false), 4000)
  }

  function goToAuth(path) {
    navigate(path, {
      state: {
        from: '/report',
        reportDraft: form,
      },
    })
  }

  return (
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="font-sans text-3xl font-bold text-gray-900 mb-2">Report a Power Cut</h1>
          <p className="text-gray-500 text-sm">Experiencing an unscheduled outage? Submit a report and we will flag it to NEA.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              Report submitted successfully. NEA has been notified.
            </div>
          )}

          {showAuthPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => setShowAuthPrompt(false)}
                aria-hidden="true"
              />

              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="submit-report-auth-title"
                className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-purple">
                      Submit Your Report
                    </p>
                    <h2 id="submit-report-auth-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                      Sign in to Submit Your Report
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAuthPrompt(false)}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Continue editing"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  To help us verify outage reports and prevent spam, please sign in or create an account before submitting.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Your draft has been saved and will be restored after signing in.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => goToAuth('/login')}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-brand-purple px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-purple-dark"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => goToAuth('/register')}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-brand-purple bg-white px-5 py-3 text-sm font-bold text-brand-purple transition-colors hover:bg-brand-purple-light"
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAuthPrompt(false)}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:hidden"
                  >
                    Continue Editing
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAuthPrompt(false)}
                  className="mt-4 hidden text-sm font-semibold text-brand-purple hover:underline sm:inline-flex"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Luffy Aryal"
                value={form.name}
                onChange={handleChange}
                className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Ward / Area</label>
              <input
                name="area"
                type="text"
                placeholder="e.g. Baneshwar, Ward 10, Kathmandu"
                value={form.area}
                onChange={handleChange}
                className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition ${errors.area ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.area && <span className="text-xs text-red-500">{errors.area}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type of Issue</label>
              <select
                name="issue"
                value={form.issue}
                onChange={handleChange}
                className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition bg-white text-gray-700 ${errors.issue ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">Select issue type...</option>
                {issueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.issue && <span className="text-xs text-red-500">{errors.issue}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Additional Details</label>
              <textarea
                name="details"
                rows={4}
                placeholder="Describe what happened, since when, any visible damage..."
                value={form.details}
                onChange={handleChange}
                className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition resize-none ${errors.details ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.details && <span className="text-xs text-red-500">{errors.details}</span>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-lg transition-colors text-sm"
            >
              <ActionSparkIcon className="w-5 h-5 text-brand-yellow" />
              Submit Report
            </button>
          </form>
        </div>

        {/* Submitted Reports */}
        <div>
          <h2 className="font-sans text-xl font-bold text-gray-800 mb-4">Submitted Reports</h2>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No reports submitted yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {reports.map(r => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-800 text-sm">{r.name} — {r.area}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{r.submittedAt}</span>
                  </div>
                  <p className="text-xs text-brand-purple font-medium mb-1">{r.issue}</p>
                  <p className="text-sm text-gray-600">{r.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
