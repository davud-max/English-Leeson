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
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-900">
      <header className="border-b border-amber-200 bg-amber-50/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-semibold tracking-wide">
              Student Portal
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-stone-600 text-sm">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-6">
        <section className="rounded-lg border border-amber-200 bg-white p-6">
          <h1 className="font-serif text-3xl mb-2">
            Welcome back, {session.user?.name || 'Student'}
          </h1>
          <p className="text-stone-600">
            Continue your journey through the algorithms of thinking and cognition.
          </p>
        </section>

        {!enrollment && (
          <section className="rounded-lg border border-amber-300 bg-amber-50 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-amber-900 mb-1">Course access required</h2>
                <p className="text-amber-900/80 text-sm">Unlock all lessons with one-time enrollment.</p>
              </div>
              <Link
                href="/checkout"
                className="rounded-md bg-amber-900 px-5 py-3 text-center text-sm font-semibold text-amber-50 hover:bg-amber-800"
              >
                Enroll Now - $30
              </Link>
            </div>
          </section>
        )}

        {enrollment && (
          <section className="rounded-lg border border-amber-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-stone-900">Your Progress</h2>
              <span className="text-sm text-stone-500">
                Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-[120px,120px,1fr] sm:items-center mb-4">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <div className="text-3xl font-semibold text-amber-900">{completedLessons}</div>
                <div className="text-sm text-stone-600">Completed</div>
              </div>
              <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                <div className="text-3xl font-semibold text-stone-500">{totalLessons - completedLessons}</div>
                <div className="text-sm text-stone-600">Remaining</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">Progress</span>
                  <span className="font-medium text-stone-900">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-900 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {progressPercent === 100 && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-md flex items-center gap-3">
                <span className="text-xl">✓</span>
                <div>
                  <div className="font-bold">Congratulations</div>
                  <div className="text-sm">You&apos;ve completed all lessons. Download your certificate!</div>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="rounded-lg border border-amber-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-stone-900">Course Lessons</h2>
            <Link href="/lessons" className="text-stone-700 hover:text-stone-900 text-sm font-medium underline-offset-4 hover:underline">
              View all
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
                  className={`rounded-md p-4 border transition hover:bg-stone-50 ${
                    isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${lesson.color || 'from-blue-500 to-indigo-600'} text-white`}>
                      {lesson.emoji || '📖'}
                    </div>
                    {isCompleted ? (
                      <span className="text-emerald-600 text-xl">✓</span>
                    ) : !isUnlocked ? (
                      <span className="text-stone-400">🔒</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-stone-400 mb-1">Lesson {lesson.order}</div>
                  <h3 className="font-semibold text-stone-800 text-sm line-clamp-2">{lesson.title}</h3>
                  <div className="text-xs text-stone-400 mt-2">{lesson.duration} min</div>
                </Link>
              )
            })}
          </div>

          {lessons.length > 9 && (
            <div className="text-center mt-6">
              <Link
                href="/lessons"
                className="inline-block border border-stone-300 bg-white text-stone-700 px-6 py-2 rounded-md hover:bg-stone-100 transition"
              >
                View all {lessons.length} lessons
              </Link>
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <Link
            href="/lessons"
            className="rounded-lg p-6 border border-amber-200 bg-white hover:bg-stone-50 transition"
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-bold text-stone-900 mb-1">All Lessons</h3>
            <p className="text-sm text-stone-500">Browse the complete course</p>
          </Link>
          
          <Link
            href={`/lessons/${Math.max(1, completedLessons + 1)}`}
            className="rounded-lg p-6 border border-amber-800 bg-amber-900 text-amber-50 hover:bg-amber-800 transition"
          >
            <div className="text-2xl mb-2">▶️</div>
            <h3 className="font-bold mb-1">Continue Learning</h3>
            <p className="text-sm text-amber-100">Pick up where you left off</p>
          </Link>
          
          <div className="rounded-lg p-6 border border-amber-200 bg-white">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-bold text-stone-900 mb-1">Certificate</h3>
            <p className="text-sm text-stone-500">
              {progressPercent === 100 ? 'Download your certificate' : `Complete ${totalLessons - completedLessons} more lessons`}
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
