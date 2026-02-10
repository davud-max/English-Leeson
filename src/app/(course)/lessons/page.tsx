'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Lesson {
  id: string
  order: number
  title: string
  description: string
  duration: number
  emoji: string
  color: string
  available: boolean
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, available: 0 })
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/lessons')
      if (res.ok) {
        const data = await res.json()
        if (res.status === 401 || res.status === 403) {
          // Неавторизованный доступ или нет прав доступа
          setUnauthorized(true)
          return
        }
        setLessons(data.lessons || [])
        setStats({ total: data.total || 0, available: data.available || 0 })
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-amber-700 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-stone-800">Course Lessons</h1>
              <p className="text-stone-600">Algorithms of Thinking and Cognition</p>
            </div>
            <Link 
              href="/" 
              className="text-stone-600 hover:text-stone-800 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-stone-700">
              {stats.available} of {stats.total} lessons available
            </p>
            <div className="w-48 bg-stone-200 h-2">
              <div 
                className="bg-amber-700 h-2 transition-all" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Unauthorized State */}
        {unauthorized ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-stone-700 mb-4">Access Denied</h3>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Please log in to access the course lessons.
            </p>
            <div className="space-x-4">
              <Link 
                href="/login" 
                className="inline-block bg-amber-700 text-white hover:bg-amber-800 px-6 py-3 rounded-lg transition"
              >
                Sign In
              </Link>
              <Link 
                href="/checkout" 
                className="inline-block bg-stone-700 text-white hover:bg-stone-800 px-6 py-3 rounded-lg transition"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          </div>
        ) : (
          /* Lessons Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <Link 
                key={lesson.id}
                href={lesson.available ? `/lessons/${lesson.order}` : '#'}
                className={`block bg-white border-2 border-stone-200 p-6 transition-all ${
                  lesson.available 
                    ? 'hover:border-amber-700 hover:shadow-md' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-amber-700">
                    {lesson.order}
                  </span>
                  <h3 className="text-lg font-semibold text-stone-800 leading-tight">
                    {lesson.title}
                  </h3>
                </div>
                
                {!lesson.available && (
                  <div className="mt-3 text-sm text-stone-500">
                    Locked
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Empty State - только если не unauthorized */}
        {!loading && lessons.length === 0 && !unauthorized && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No lessons available</h3>
            <p className="text-stone-500">Check back soon for new content!</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-amber-50 border-4 border-amber-700 p-10 text-center">
          <h2 className="text-3xl font-bold mb-4 text-stone-800">Unlock All {stats.total} Lessons</h2>
          <p className="text-stone-600 mb-8 text-lg max-w-2xl mx-auto">
            Get lifetime access to the complete course with AI-generated questions, voice input, and a certificate of completion.
          </p>
          <Link 
            href="/checkout" 
            className="inline-block bg-amber-700 text-white hover:bg-amber-800 px-10 py-4 font-bold text-lg transition"
          >
            Enroll Now - $30
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-8 mt-16 border-t-4 border-amber-700">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
