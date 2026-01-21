import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getLessons() {
  try {
    return await prisma.lesson.findMany({
      where: { 
        courseId: 'main-course',
        published: true 
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        duration: true,
      },
    })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return []
  }
}

async function getCourse() {
  return {
    title: 'Algorithms of Thinking and Cognition',
    description: 'A Philosophical Course for the Development of Critical Thinking',
    price: 30,
  }
}
export default async function HomePage() {
  const [lessons, course] = await Promise.all([getLessons(), getCourse()])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {course.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {course.description}
        </p>
        <Link
          href="/checkout"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Get Started – USD ${course.price}
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Who Is This Course For?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            'Develop critical and systems thinking',
            'Understand the fundamental principles of cognition',
            'Learn to discern the essence of things',
            'Master tools of analysis and abstraction',
            'Study the philosophical foundations of thinking',
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Will You Gain?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              '17 interactive lessons',
              'AI-generated questions',
              'Voice input support',
              'Practical assignments',
              'Lifetime access',
              'Certificate included',
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Topics</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            'Theory of abstraction and the rules of cognition',
            'Praxeology and human action',
            'Theory of cognitive resonance',
            'Philosophical analysis of the structure of reality',
            'The path to truth through thinking',
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-gray-800">{topic}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Course Program - 17 Lessons</h2>
          <div className="max-w-4xl mx-auto">
            {lessons.length > 0 && lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Lesson {lesson.order}. {lesson.title}
                </h3>
                <p className="text-gray-600 mb-2">{lesson.description}</p>
                <p className="text-sm text-gray-500">Duration: {lesson.duration} minutes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4">Special Price</h2>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">${course.price}</span>
            <p className="text-blue-100 mt-2">Lifetime access</p>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-white text-blue-600 hover:bg-gray-50 text-center font-semibold px-6 py-4 rounded-lg transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
