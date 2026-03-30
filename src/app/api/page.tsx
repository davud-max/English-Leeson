import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getFreeLessons } from '@/lib/free-lessons'

export const dynamic = 'force-dynamic'

const MAX_PUBLIC_LESSON_ORDER = 23

type LessonCard = {
  id: string
  order: number
  title: string
  description: string
  duration: number
  available: boolean
}

export default async function HomePage() {
  const [lessons, freeLessons] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        published: true,
        order: { lte: MAX_PUBLIC_LESSON_ORDER },
      },
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        duration: true,
        available: true,
      },
      orderBy: { order: 'asc' },
    }) as Promise<LessonCard[]>,
    getFreeLessons(),
  ])

  const lessonCount = lessons.length || MAX_PUBLIC_LESSON_ORDER

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Algorithms of Thinking and Cognition
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A Philosophical Course for the Development of Critical Thinking
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/checkout"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started – USD $30
          </Link>
          <Link
            href="/lessons/1"
            className="inline-block bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Preview Lesson 1 →
          </Link>
        </div>
      </section>

      {/* Course Program */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Course Program</h2>
          <p className="text-center text-gray-600 mb-12">{lessonCount} comprehensive lessons</p>
          <div className="max-w-4xl mx-auto space-y-4">
            {lessons.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-gray-600">
                No lessons found. Sync the course first.
              </div>
            ) : (
              lessons.map((lesson) => {
                const isFree = freeLessons.includes(lesson.order)
                return (
                  <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2 gap-3">
                          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                            Lesson {lesson.order}
                          </span>
                          <span className="text-sm text-gray-500">⏱️ {lesson.duration} minutes</span>
                          {lesson.available && (
                            <Link 
                              href={`/lessons/${lesson.order}`}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Preview →
                            </Link>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-600">{lesson.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Special Price</h2>
              <div className="mb-6">
                <span className="text-6xl font-bold">$30</span>
                <p className="text-blue-100 mt-2 text-lg">Lifetime access to the course</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                `${lessonCount} interactive lessons`,
                'Full course content',
                'Lifetime access',
                'Certificate included',
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/checkout"
              className="block w-full bg-white text-blue-600 hover:bg-blue-50 text-center font-bold px-6 py-4 rounded-lg transition-colors shadow-lg text-lg"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Begin Your Journey?</h3>
            <p className="text-gray-400 mb-6">Join thousands of students mastering critical thinking</p>
            <Link
              href="/checkout"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Started Today
            </Link>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8">
            <p className="text-center mb-4">&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
