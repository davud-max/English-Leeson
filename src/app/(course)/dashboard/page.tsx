import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getDashboardData(userId: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!enrollment) {
    return null
  }

  const progress = await prisma.progress.findMany({
    where: { userId },
  })

  const progressMap = new Map(
    progress.map((p) => [p.lessonId, p])
  )

  return {
    course: enrollment.course,
    progress: progressMap,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const data = await getDashboardData(session!.user.id)

  if (!data) {
    return <div>No access</div>
  }

  const { course, progress } = data
  const completedLessons = Array.from(progress.values()).filter(p => p.completed).length
  const totalLessons = course.lessons.length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-600">
          Continue your journey through the Algorithms of Thinking and Cognition
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="flex items-center mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="ml-4 text-sm font-medium text-gray-700">
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {progressPercent.toFixed(0)}% Complete
        </p>
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Course Lessons</h2>
        <div className="space-y-4">
          {course.lessons.map((lesson) => {
            const lessonProgress = progress.get(lesson.id)
            const isCompleted = lessonProgress?.completed || false
            const isAccessible = lesson.published

            return (
              <div
                key={lesson.id}
                className={`border rounded-lg p-4 ${
                  isAccessible
                    ? 'hover:shadow-md transition-shadow'
                    : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-500 mr-3">
                        Lesson {lesson.order}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Completed
                        </span>
                      )}
                      {!isAccessible && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {lesson.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Duration: {lesson.duration} minutes
                    </p>
                  </div>
                  <div className="ml-4">
                    {isAccessible ? (
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {isCompleted ? 'Review' : 'Start'}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
