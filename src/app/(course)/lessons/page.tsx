'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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
  const { data: session, status: sessionStatus } = useSession()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, available: 0 })
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    fetchLessons()
    if (session?.user) {
      checkAccess()
    }
  }, [session])

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/lessons')
      if (res.ok) {
        const data = await res.json()
        setLessons(data.lessons || [])
        setStats({ total: data.total || 0, available: data.available || 0 })
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAccess = async () => {
    try {
      const res = await fetch('/api/user/progress')
      if (res.ok) {
        const data = await res.json()
        setHasAccess(data.hasPurchased || !!data.enrollment)
      }
    } catch (error) {
      console.error('Failed to check access:', error)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-stone-900 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
                <span>🎓</span>
              </div>
              <span className="font-serif font-bold">Academy of Thought</span>
            </Link>
            <div className="flex items-center gap-6">
              {session ? (
                <Link href="/dashboard" className="text-stone-300 hover:text-white transition text-sm">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="text-stone-300 hover:text-white transition text-sm">
                  Sign In
                </Link>
              )}
              {!hasAccess && (
                <Link
                  href="/checkout"
                  className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium transition"
                >
                  Enroll
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-stone-900 text-white py-12 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Course Curriculum</h1>
          <p className="text-stone-400">
            {stats.total} lectures • Algorithms of Thinking and Cognition
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Access Banner */}
        {sessionStatus !== 'loading' && !hasAccess && (
          <div className="bg-stone-800 text-white rounded-lg p-6 mb-10 border-l-4 border-amber-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold mb-1">
                  {session ? '🔐 Enrollment Required' : '🔐 Sign In Required'}
                </h2>
                <p className="text-stone-400 text-sm">
                  {session 
                    ? 'Purchase the course to access all lecture materials.'
                    : 'Sign in or create an account to access the curriculum.'
                  }
                </p>
              </div>
              <div className="flex gap-3">
                {!session && (
                  <Link
                    href="/login"
                    className="border border-stone-600 hover:border-stone-500 text-stone-300 hover:text-white px-5 py-2 rounded text-sm transition"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/checkout"
                  className="bg-amber-700 hover:bg-amber-600 text-white px-5 py-2 rounded text-sm font-medium transition"
                >
                  Enroll — $30
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
          </div>
        ) : (
          /* Lessons List */
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.order}`}
                className="block bg-white border border-stone-200 rounded-lg p-5 hover:border-amber-700 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-5">
                  {/* Lesson Number */}
                  <div className="bg-stone-100 group-hover:bg-amber-700 group-hover:text-white text-stone-600 w-12 h-12 rounded flex items-center justify-center font-serif font-bold text-lg transition flex-shrink-0">
                    {lesson.order}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-amber-800 transition">
                      {lesson.title}
                    </h3>
                    <p className="text-stone-500 text-sm mt-1 line-clamp-1">
                      {lesson.description || 'No description available'}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-stone-400 text-sm hidden sm:inline">
                      {lesson.duration} min
                    </span>
                    {!hasAccess ? (
                      <span className="text-stone-400">🔒</span>
                    ) : (
                      <span className="text-stone-400 group-hover:text-amber-700 transition">→</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && lessons.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">No lectures available</h3>
            <p className="text-stone-500">Check back soon for new content.</p>
          </div>
        )}

        {/* CTA */}
        {!hasAccess && lessons.length > 0 && (
          <div className="mt-12 bg-stone-900 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-serif font-bold mb-3">Ready to Begin?</h2>
            <p className="text-stone-400 mb-6 max-w-lg mx-auto">
              Gain lifetime access to all {stats.total} lectures, audio narration, 
              AI assessments, and a certificate of completion.
            </p>
            <Link
              href="/checkout"
              className="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded transition"
            >
              Enroll Now — $30
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 py-8 mt-16 border-t-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm">
          <p>© 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
