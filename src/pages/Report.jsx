import React, { useState, useEffect } from 'react'
import ActionSparkIcon from '../components/ActionSparkIcon'

const issueTypes = [
  'Scheduled outage (known)',
  'Unexpected power cut',
  'Transformer issue',
  'Fallen electric pole or wire',
  'Voltage fluctuation',
  'Other',
]

export default function Report() {
  const [form, setForm] = useState({ name: '', area: '', issue: '', details: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
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
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }

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
    setErrors({})
    setSuccess(true)
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Report a Power Cut</h1>
          <p className="text-gray-500 text-sm">Experiencing an unscheduled outage? Submit a report and we will flag it to NEA.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              Report submitted successfully. NEA has been notified.
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
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4">Submitted Reports</h2>
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
