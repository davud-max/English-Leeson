'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CourseSettings {
  id: string
  title: string
  description: string
  price: number
  currency: string
  published: boolean
}

export default function SettingsPage() {
  const [course, setCourse] = useState<CourseSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCourse()
  }, [])

  const fetchCourse = async () => {
    try {
      const res = await fetch('/api/admin/course')
      if (res.ok) {
        const data = await res.json()
        setCourse(data)
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCourse = async () => {
    if (!course) return
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/course', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      })

      if (res.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Error saving settings')
      }
    } catch (error) {
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⚙️ Settings</h1>
              <p className="text-gray-600 text-sm">Course configuration and settings</p>
            </div>
            <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            Loading...
          </div>
        ) : course ? (
          <div className="space-y-6">
            {/* Course Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">📚 Course Settings</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={course.price}
                      onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={course.currency}
                      onChange={(e) => setCourse({ ...course, currency: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="RUB">RUB (₽)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={course.published}
                      onChange={(e) => setCourse({ ...course, published: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Course is published and available for purchase</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Environment Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">🔧 Environment</h2>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-mono">Railway</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework</span>
                  <span className="font-mono">Next.js 14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database</span>
                  <span className="font-mono">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-mono">Stripe</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">🔗 Quick Links</h2>
              </div>
              <div className="p-6 space-y-2">
                <a 
                  href="https://railway.app" 
                  target="_blank"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  Railway Dashboard →
                </a>
                <a 
                  href="https://dashboard.stripe.com" 
                  target="_blank"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  Stripe Dashboard →
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  GitHub Repository →
                </a>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-between items-center">
              {message && (
                <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </span>
              )}
              <button
                onClick={saveCourse}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ml-auto"
              >
                {saving ? 'Saving...' : '💾 Save Settings'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No course found. Create one first.</p>
          </div>
        )}
      </main>
    </div>
  )
}
