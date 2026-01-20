import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarkdownContent from '@/components/course/MarkdownContent'

async function getLessonData(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, order: true, published: true },
          },
        },
      },
    },
  })

  if (!lesson) {
    return null
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId: lesson.courseId,
    },
  })

  if (!enrollment) {
    return null
  }

  // Get or create progress
  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    create: {
      userId,
      lessonId,
      lastViewedAt: new Date(),
    },
    update: {
      lastViewedAt: new Date(),
    },
  })

  // Track lesson view
  await prisma.event.create({
    data: {
      userId,
      eventType: 'lesson_viewed',
      metadata: {
        lessonId,
        lessonOrder: lesson.order,
      },
    },
  })

  const currentIndex = lesson.course.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? lesson.course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lesson.course.lessons.length - 1 
    ? lesson.course.lessons[currentIndex + 1] 
    : null

  return {
    lesson,
    progress,
    prevLesson,
    nextLesson,
  }
}

export default async function LessonPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const data = await getLessonData(params.id, session.user.id)

  if (!data) {
    redirect('/dashboard')
  }

  const { lesson, progress, prevLesson, nextLesson } = data

  if (!lesson.published) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Lesson {lesson.order}</p>
              <h1 className="text-4xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            {progress.completed && (
              <div className="flex items-center text-green-600">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <MarkdownContent content={lesson.content} />
        </div>

        {/* Mark as Complete Button */}
        {!progress.completed && (
          <div className="mb-8 text-center">
            <form action={`/api/lessons/${lesson.id}/complete`} method="POST">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Complete
              </button>
            </form>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center border-t pt-8">
          <div>
            {prevLesson && prevLesson.published && (
              <Link
                href={`/lessons/${prevLesson.id}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Lesson
              </Link>
            )}
          </div>
          <div>
            {nextLesson && nextLesson.published && (
              <Link
                href={`/lessons/${nextLesson.id}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                Next Lesson
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
