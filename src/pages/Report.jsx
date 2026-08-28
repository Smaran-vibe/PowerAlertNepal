import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionSparkIcon from '../components/ActionSparkIcon'
import * as reportService from '../services/report.service'
import { getErrorMessage } from '../utils/errorHandler'
import { PROVINCE, DISTRICTS, OUTAGE_TYPES } from '../constants/report'
import { useAuth } from '../context/AuthContext'
import toast from '../components/Toast/toast'

const initialForm = {
  title: '',
  description: '',
  district: '',
  municipality: '',
  ward: '',
  outageType: '',
}

const REPORT_DRAFT_KEY = 'poweralert-report-draft'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read selected image.'))
    reader.readAsDataURL(file)
  })
}

async function dataUrlToFile(dataUrl, filename, mimeType) {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: mimeType || blob.type || 'image/jpeg' })
}

function readDraft() {
  try {
    const raw = sessionStorage.getItem(REPORT_DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeDraft(payload) {
  try {
    sessionStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(payload))
  } catch {

  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(REPORT_DRAFT_KEY)
  } catch {

  }
}

export default function Report() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [imageMeta, setImageMeta] = useState(null)
  const [coords, setCoords] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showMyReportsPrompt, setShowMyReportsPrompt] = useState(false)
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false)

  function resetReportForm() {
    setForm(initialForm)
    setImageFile(null)
    setImagePreviewUrl(null)
    setImageMeta(null)
    setCoords(null)
    setError('')
  }

  useEffect(() => {
    const draft = readDraft()
    if (!draft) {
      setHasHydratedDraft(true)
      return
    }

    if (draft.form) setForm({ ...initialForm, ...draft.form })
    if (draft.coords) setCoords(draft.coords)
    if (draft.image?.dataUrl) {
      setImagePreviewUrl(draft.image.dataUrl)
      setImageMeta({ name: draft.image.name, type: draft.image.type })
    }

    setHasHydratedDraft(true)
  }, [])

  useEffect(() => {
    if (!hasHydratedDraft) return

    writeDraft({
      form,
      coords,
      image: imagePreviewUrl
        ? {
          dataUrl: imagePreviewUrl,
          name: imageMeta?.name || 'report-image',
          type: imageMeta?.type || 'image/jpeg',
        }
        : null,
    })
  }, [form, coords, imagePreviewUrl, imageMeta, hasHydratedDraft])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0] || null
    setImageFile(file)

    if (!file) {
      setImagePreviewUrl(null)
      setImageMeta(null)
      return
    }

    const dataUrl = await fileToDataUrl(file)
    setImagePreviewUrl(String(dataUrl))
    setImageMeta({ name: file.name, type: file.type })
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast.error('Location is not supported on this device.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsLocating(false)
        toast.success('Location captured.')
      },
      () => {
        setIsLocating(false)
        toast.error('Could not get your location. You can still submit without it.')
      }
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!isAuthenticated) {
      setShowAuthPrompt(true)
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('province', PROVINCE)
    formData.append('district', form.district)
    formData.append('municipality', form.municipality)
    formData.append('ward', form.ward)
    formData.append('outageType', form.outageType)
    if (coords) {
      formData.append('latitude', coords.latitude)
      formData.append('longitude', coords.longitude)
    }
    let reportImage = imageFile
    if (!reportImage && imagePreviewUrl && imageMeta) {
      reportImage = await dataUrlToFile(imagePreviewUrl, imageMeta.name || 'report-image', imageMeta.type)
    }
    if (reportImage) {
      formData.append('image', reportImage)
    }

    try {
      await reportService.createReport(formData)
      toast.success('Report submitted successfully.')

      resetReportForm()
      clearDraft()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1E4A] py-12 px-4 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-auth-cyan-charge">Citizen report</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white mb-2">Report a Power Cut</h1>
            <p className="text-sm text-slate-300">Experiencing an unscheduled outage? Submit a report and we will flag it to NEA.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                setShowMyReportsPrompt(true)
                return
              }

              navigate('/my-reports')
            }}
            className="shrink-0 whitespace-nowrap rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
          >
            My Reports
          </button>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_16px_40px_rgba(2,8,23,0.22)] backdrop-blur-sm">
          {error && (
            <div className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. No power since morning in Baneshwar"
                value={form.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className="rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe what happened, since when, any visible damage..."
                value={form.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className="resize-none rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select district...</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-200">Ward</label>
                <input
                  name="ward"
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={form.ward}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">Municipality</label>
              <input
                name="municipality"
                type="text"
                placeholder="e.g. Kathmandu Metropolitan City"
                value={form.municipality}
                onChange={handleChange}
                disabled={isSubmitting}
                className="rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200">Type of Issue</label>
              <select
                name="outageType"
                value={form.outageType}
                onChange={handleChange}
                disabled={isSubmitting}
                className="rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3 text-sm text-white outline-none focus:border-auth-cyan-charge focus:ring-2 focus:ring-auth-cyan-charge/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select issue type...</option>
                {OUTAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">Photo (optional, JPEG/PNG/WEBP, max 5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-auth-volt-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Selected preview" className="mt-2 h-32 w-32 rounded-lg border border-white/10 object-cover" />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#0F244F] px-4 py-3">
              <div className="text-sm text-slate-200">
                {coords
                  ? `Location captured (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
                  : 'Location not shared (optional)'}
              </div>
              <button
                type="button"
                onClick={useMyLocation}
                disabled={isSubmitting || isLocating}
                className="shrink-0 whitespace-nowrap text-sm font-semibold text-auth-cyan-charge hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLocating ? 'Locating...' : 'Use my current location'}
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  resetReportForm()
                  clearDraft()
                }}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-auth-volt-blue py-3 text-sm font-bold text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ActionSparkIcon className="w-5 h-5 text-brand-yellow" />
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1E4A] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-auth-cyan-charge">Sign in required</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Sign in to submit your report</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Your report is ready. Please sign in or create an account to submit it.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/report' } })}
                className="rounded-xl bg-auth-volt-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { from: '/report' } })}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showMyReportsPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1E4A] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-auth-cyan-charge">Login required</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">To view your report, please log in</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Sign in first to see the reports you submitted and track their status.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/my-reports' } })}
                className="rounded-xl bg-auth-volt-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setShowMyReportsPrompt(false)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
