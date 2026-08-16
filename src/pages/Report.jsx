import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ActionSparkIcon from '../components/ActionSparkIcon'
import * as reportService from '../services/report.service'
import { getErrorMessage } from '../utils/errorHandler'
import { PROVINCE, DISTRICTS, OUTAGE_TYPES } from '../constants/report'
import { useAuth } from '../context/AuthContext'

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
    // Ignore storage failures and keep the current in-memory draft.
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(REPORT_DRAFT_KEY)
  } catch {
    // Ignore storage failures.
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

  useEffect(() => {
    const draft = readDraft()
    if (!draft) return

    if (draft.form) setForm({ ...initialForm, ...draft.form })
    if (draft.coords) setCoords(draft.coords)
    if (draft.image?.dataUrl) {
      setImagePreviewUrl(draft.image.dataUrl)
      setImageMeta({ name: draft.image.name, type: draft.image.type })
    }
  }, [])

  useEffect(() => {
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
  }, [form, coords, imagePreviewUrl, imageMeta])

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

      setForm(initialForm)
      setImageFile(null)
      setImagePreviewUrl(null)
      setImageMeta(null)
      setCoords(null)
      clearDraft()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-lavender py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl font-bold text-gray-900 mb-2">Report a Power Cut</h1>
            <p className="text-gray-500 text-sm">Experiencing an unscheduled outage? Submit a report and we will flag it to NEA.</p>
          </div>
          <Link
            to="/my-reports"
            className="shrink-0 whitespace-nowrap rounded-lg border border-brand-purple px-4 py-2 text-sm font-semibold text-brand-purple transition-colors hover:bg-brand-purple-light"
          >
            My Reports
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. No power since morning in Baneshwar"
                value={form.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe what happened, since when, any visible damage..."
                value={form.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition resize-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select district...</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Ward</label>
                <input
                  name="ward"
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={form.ward}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Municipality</label>
              <input
                name="municipality"
                type="text"
                placeholder="e.g. Kathmandu Metropolitan City"
                value={form.municipality}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type of Issue</label>
              <select
                name="outageType"
                value={form.outageType}
                onChange={handleChange}
                disabled={isSubmitting}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select issue type...</option>
                {OUTAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Photo (optional, JPEG/PNG/WEBP, max 5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-purple-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-purple hover:file:bg-brand-lavender disabled:cursor-not-allowed disabled:opacity-60"
              />
              {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Selected preview" className="mt-2 h-32 w-32 rounded-lg object-cover border border-gray-200" />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-600">
                {coords
                  ? `Location captured (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
                  : 'Location not shared (optional)'}
              </div>
              <button
                type="button"
                onClick={useMyLocation}
                disabled={isSubmitting || isLocating}
                className="shrink-0 whitespace-nowrap text-sm font-semibold text-brand-purple hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLocating ? 'Locating...' : 'Use my current location'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-lg transition-colors text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ActionSparkIcon className="w-5 h-5 text-brand-yellow" />
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>

      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-purple">Sign in required</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Sign in to submit your report</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your report is ready. Please sign in or create an account to submit it.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/report' } })}
                className="rounded-xl bg-brand-purple px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-purple-dark"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { from: '/report' } })}
                className="rounded-xl border border-brand-purple px-4 py-3 text-sm font-semibold text-brand-purple transition-colors hover:bg-brand-purple-light"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
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
