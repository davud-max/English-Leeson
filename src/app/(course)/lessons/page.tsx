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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">📚 Course Lessons</h1>
              <p className="text-blue-100">Algorithms of Thinking and Cognition</p>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <Link 
                  href="/dashboard" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Sign In
                </Link>
              )}
              <Link 
                href="/" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300"
              >
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Access Status */}
        {sessionStatus !== 'loading' && !hasAccess && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">🔐 {session ? 'Unlock Full Course' : 'Sign In to Access'}</h2>
                <p className="text-amber-100">
                  {session 
                    ? 'Purchase the course to unlock all lessons and features.'
                    : 'Create an account or sign in to access the course content.'
                  }
                </p>
              </div>
              <div className="flex gap-3">
                {!session && (
                  <Link
                    href="/login"
                    className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/checkout"
                  className="bg-white text-amber-600 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition shadow-lg"
                >
                  Enroll Now - $30
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Course Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Overview</h2>
              <p className="text-gray-600">
                {stats.total} lessons • {hasAccess ? 'Full access' : 'Preview mode'}
              </p>
            </div>
            {hasAccess && (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">✓</div>
                  <div className="text-sm text-gray-500">Enrolled</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          /* Lessons Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  hasAccess 
                    ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' 
                    : 'opacity-90'
                }`}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${lesson.color || 'from-blue-500 to-indigo-600'} p-4 text-white relative`}>
                  {!hasAccess && (
                    <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                      🔒 Locked
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      Lesson {lesson.order}
                    </span>
                    <span className="text-sm">⏱️ {lesson.duration} min</span>
                  </div>
                  <div className="text-4xl mt-2">{lesson.emoji || '📖'}</div>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {lesson.description || 'No description available'}
                  </p>
                  
                  {hasAccess ? (
                    <Link 
                      href={`/lessons/${lesson.order}`}
                      className={`block w-full text-center bg-gradient-to-r ${lesson.color || 'from-blue-500 to-indigo-600'} text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity`}
                    >
                      Start Lesson →
                    </Link>
                  ) : (
                    <Link
                      href={`/lessons/${lesson.order}`}
                      className="block w-full text-center bg-gray-100 text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                    >
                      Preview →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && lessons.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No lessons available</h3>
            <p className="text-gray-500">Check back soon for new content!</p>
          </div>
        )}

        {/* CTA Section */}
        {!hasAccess && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🚀 Unlock All {stats.total} Lessons!</h2>
            <p className="text-blue-100 mb-8 text-xl max-w-2xl mx-auto">
              Get lifetime access to the complete course with AI-generated questions, voice input, and a certificate of completion.
            </p>
            <Link 
              href="/checkout" 
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Enroll Now - $30
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
