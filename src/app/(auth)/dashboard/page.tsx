'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Lesson {
  id: string
  order: number
  title: string
  emoji: string
  color: string
  duration: number
}

interface Progress {
  lessonId: string
  completed: boolean
}

interface Enrollment {
  courseId: string
  enrolledAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // Fetch lessons
      const lessonsRes = await fetch('/api/lessons')
      const lessonsData = await lessonsRes.json()
      setLessons(lessonsData.lessons || [])

      // Fetch user progress
      const progressRes = await fetch('/api/user/progress')
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setProgress(progressData.progress || [])
        setEnrollment(progressData.enrollment || null)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedLessons = progress.filter(p => p.completed).length
  const totalLessons = lessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <span>🧠</span>
              <span>Thinking Course</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your journey through the algorithms of thinking and cognition.
          </p>
        </div>

        {/* Enrollment Status */}
        {!enrollment && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">🔒 Course Not Purchased</h2>
                <p className="text-amber-100">Unlock all lessons with lifetime access</p>
              </div>
              <Link
                href="/checkout"
                className="bg-white text-amber-600 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition"
              >
                Enroll Now - $30
              </Link>
            </div>
          </div>
        )}

        {/* Progress Card */}
        {enrollment && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <span className="text-sm text-gray-500">
                Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-8 mb-4">
              <div>
                <div className="text-4xl font-bold text-blue-600">{completedLessons}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-300">{totalLessons - completedLessons}</div>
                <div className="text-sm text-gray-500">Remaining</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {progressPercent === 100 && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <div className="font-bold">Congratulations!</div>
                  <div className="text-sm">You&apos;ve completed all lessons. Download your certificate!</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Course Lessons</h2>
            <Link href="/lessons" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.slice(0, 9).map((lesson) => {
              const isCompleted = progress.some(p => p.lessonId === lesson.id && p.completed)
              const isUnlocked = enrollment || lesson.order <= 2 // Free preview for first 2 lessons

              return (
                <Link
                  key={lesson.id}
                  href={isUnlocked ? `/lessons/${lesson.order}` : '/checkout'}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition hover:shadow-md ${
                    isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${lesson.color || 'from-blue-500 to-indigo-600'} text-white`}>
                      {lesson.emoji || '📖'}
                    </div>
                    {isCompleted ? (
                      <span className="text-green-500 text-xl">✓</span>
                    ) : !isUnlocked ? (
                      <span className="text-gray-400">🔒</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">Lesson {lesson.order}</div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{lesson.title}</h3>
                  <div className="text-xs text-gray-400 mt-2">{lesson.duration} min</div>
                </Link>
              )
            })}
          </div>

          {lessons.length > 9 && (
            <div className="text-center mt-6">
              <Link
                href="/lessons"
                className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                View all {lessons.length} lessons
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/lessons"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-bold text-gray-900 mb-1">All Lessons</h3>
            <p className="text-sm text-gray-500">Browse the complete course</p>
          </Link>
          
          <Link
            href={`/lessons/${Math.max(1, completedLessons + 1)}`}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-md text-white hover:opacity-90 transition"
          >
            <div className="text-2xl mb-2">▶️</div>
            <h3 className="font-bold mb-1">Continue Learning</h3>
            <p className="text-sm text-blue-100">Pick up where you left off</p>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-bold text-gray-900 mb-1">Certificate</h3>
            <p className="text-sm text-gray-500">
              {progressPercent === 100 ? 'Download your certificate' : `Complete ${totalLessons - completedLessons} more lessons`}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
