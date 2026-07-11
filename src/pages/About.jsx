import React, { useState } from 'react'

const aboutCards = [
  {
    id: 1,
    title: 'The Problem',
    body: 'NEA publishes power cut notices on Facebook pages, WhatsApp groups, and scattered PDF notices. There is no single searchable, area-based web platform. Consumers find out about cuts only when their lights go off.',
  },
  {
    id: 2,
    title: 'Our Solution',
    body: 'PowerAlert Nepal organizes all NEA maintenance notices in one place. Search by ward or area, see upcoming cuts with time and reason, track live status, and report unscheduled outages — all in one clean platform.',
  },
  {
    id: 3,
    title: 'The Impact',
    body: 'Students can plan study time, offices can schedule backups, hospitals can prepare generators, and businesses can avoid losses. Knowing 24 hours ahead turns a disruption into a manageable event.',
  },
]

const contactInfo = [
  { label: 'Email', value: 'support@poweralertnepal.mock' },
  { label: 'Phone', value: '+977-1-XXXXXXX' },
  { label: 'Office', value: 'Kathmandu, Bagmati Province, Nepal' },
  { label: 'Response Time', value: 'Within 24 hours (weekdays)' },
]

export default function About() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.message.trim()) e.message = 'Message cannot be empty.'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
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
    setSuccess(true)
    setForm({ name: '', email: '', message: '' })
    setErrors({})
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="min-h-screen bg-brand-lavender">

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">About PowerAlert Nepal</h1>
            <p className="text-gray-500 text-sm">Why this platform was built</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutCards.map(card => (
              <div key={card.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-gray-800 mb-3 text-base">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-500 text-sm">Questions, feedback, or partnership inquiries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {success && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                  Message sent. We will get back to you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={handleChange}
                    className={`border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.message && <span className="text-xs text-red-500">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-5 justify-center">
              {contactInfo.map(info => (
                <div key={info.label} className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{info.label}</p>
                  <p className="text-sm text-gray-700 font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
