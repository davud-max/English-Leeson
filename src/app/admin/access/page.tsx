'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LessonInfo {
  id: string
  order: number
  title: string
  available: boolean
}

export default function AccessControlPage() {
  const [lessons, setLessons] = useState<LessonInfo[]>([])
  const [freeLessons, setFreeLessons] = useState<number[]>([1])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [lessonsRes, freeRes] = await Promise.all([
        fetch('/api/admin/lessons'),
        fetch('/api/admin/free-lessons'),
      ])

      if (lessonsRes.ok) {
        const data = await lessonsRes.json()
        setLessons(Array.isArray(data) ? data : data.lessons || [])
      }

      if (freeRes.ok) {
        const data = await freeRes.json()
        setFreeLessons(data.freeLessons || [1])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLesson = (order: number) => {
    setFreeLessons(prev =>
      prev.includes(order)
        ? prev.filter(n => n !== order)
        : [...prev, order].sort((a, b) => a - b)
    )
  }

  const selectAll = () => {
    setFreeLessons(lessons.map(l => l.order))
  }

  const selectNone = () => {
    setFreeLessons([])
  }

  const selectFirstOnly = () => {
    setFreeLessons([1])
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/free-lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freeLessons }),
      })

      if (res.ok) {
        setMessage('✅ Saved! Changes take effect immediately.')
      } else {
        setMessage('❌ Error saving')
      }
    } catch {
      setMessage('❌ Error saving')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 4000)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-amber-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-stone-900">🔓 Lesson Access Control</h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage which lessons are free and accessible without purchase or registration.
            </p>
          </div>
          <Link href="/admin" className="text-stone-600 hover:text-stone-900 text-sm">
            ← Dashboard
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="rounded-lg border border-amber-200 bg-white p-8 text-center">
          Loading...
        </div>
      ) : (
        <>
          <section className="rounded-lg border border-amber-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={selectAll}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                🔓 Open All Lessons
              </button>
              <button
                onClick={selectFirstOnly}
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                📖 Only Lesson 1 Free
              </button>
              <button
                onClick={selectNone}
                className="rounded-md bg-stone-600 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
              >
                🔒 Lock All
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900">
                Lessons ({freeLessons.length} of {lessons.length} free)
              </h2>
            </div>
            
            <div className="space-y-2">
              {lessons.map((lesson) => {
                const isFree = freeLessons.includes(lesson.order)
                return (
                  <label
                    key={lesson.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition ${
                      isFree
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-stone-50 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={() => toggleLesson(lesson.order)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className={`text-lg font-bold w-8 ${isFree ? 'text-green-700' : 'text-stone-400'}`}>
                      {lesson.order}
                    </span>
                    <span className="flex-1 text-stone-800">{lesson.title}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isFree
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-200 text-stone-600'
                    }`}>
                      {isFree ? '🔓 FREE' : '🔒 Locked'}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="flex items-center justify-between">
            {message && (
              <span className={`text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-amber-900 px-6 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800 disabled:opacity-50 ml-auto"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </section>
        </>
      )}
    </div>
  )
}
