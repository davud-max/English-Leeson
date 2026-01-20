import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getLessons() {
  return await prisma.lesson.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      order: true,
      title: true,
      description: true,
      duration: true,
    },
  })
}

export default async function HomePage() {
  const lessons = await getLessons()

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
        <Link
          href="/checkout"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Get Started – USD 30
        </Link>
      </section>

      {/* Who Is This For */}
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

      {/* What You'll Gain */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Will You Gain?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              '17 interactive lessons with audio accompaniment',
              'AI-generated personalized questions',
              'Voice input for answers for ease of use',
              'Practical assignments after each lesson',
              'Lifetime access to all materials',
              'Certificate of course completion',
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

      {/* Core Topics */}
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
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary-500">
              <p className="text-gray-800">{topic}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lessons List */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Course Program</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Lesson {lesson.order}. {lesson.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{lesson.description}</p>
                    <p className="text-sm text-gray-500">Duration: {lesson.duration} minutes</p>
                  </div>
                </div>
              </div>
            ))}
            {Array.from({ length: 17 - lessons.length }).map((_, i) => {
              const order = lessons.length + i + 1
              const lessonInfo = [
                { title: 'What Is Counting?', desc: 'The origin of counting. Group, numeral, digit. Counting on fingers: dozen, score, gross. Natural numbers.', duration: 30 },
                { title: 'What Is a Formula?', desc: 'The emergence of the concept of a parameter. Relationships between quantities and formulae. The number π.', duration: 30 },
                { title: 'Abstraction and Rules', desc: 'Human beings and thinking. Abstraction and knowledge. Literacy as rule-based action.', duration: 25 },
                { title: 'Human Activity: Praxeology, Economics, and Imitation', desc: 'What kind of activity is worthy of a human being?', duration: 25 },
                { title: 'Human Activity and Economics', desc: 'From communication to law. Levels of civilization. Goals and goods.', duration: 25 },
                { title: 'The Fair and the Coin', desc: 'How money, markets, and banks emerged from the exchange of gifts between tribes.', duration: 25 },
                { title: 'The Theory of Cognitive Resonance I', desc: 'How does thought arise? Two circuits of consciousness.', duration: 25 },
                { title: 'Biblical Cosmogony', desc: 'Heaven and earth, water and light — a philosophical analysis of Genesis.', duration: 20 },
                { title: 'The Theory of Cognitive Resonance II', desc: 'How we think. Continuation of the topic.', duration: 25 },
                { title: 'The Number 666', desc: 'A philosophical interpretation of the number of the Beast.', duration: 20 },
                { title: 'Three Steps to Heaven', desc: 'The number 666 as a formula of ascent.', duration: 22 },
                { title: 'The Sixth Human Level', desc: 'The transition from external law to internal law.', duration: 25 },
                { title: 'How Consciousness Creates the World', desc: 'The act of primary distinction. The human being as a co-creator of reality.', duration: 20 },
                { title: 'A Theory of Everything', desc: 'A philosophical hypothesis about the fundamental nature of reality beyond space.', duration: 25 },
                { title: 'Minus-Space', desc: 'Abstraction as the substance of the world.', duration: 20 },
                { title: 'The Human Path to Truth', desc: 'A synthesis of all lessons: from distinction to unity.', duration: 30 },
              ][i] || { title: 'Coming Soon', desc: 'Content in development', duration: 25 }

              return (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm opacity-60">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Lesson {order}. {lessonInfo.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{lessonInfo.desc}</p>
                      <p className="text-sm text-gray-500">Duration: {lessonInfo.duration} minutes</p>
                    </div>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">Coming Soon</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-gradient-to-br from-primary-500 to-primary-700 text-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4">Special Price</h2>
          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$30</span>
            <p className="text-primary-100 mt-2">Lifetime access to the course</p>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              '17 interactive lessons',
              'AI-generated questions',
              'Voice input support',
              'Practical assignments',
              'Lifetime access',
              'Certificate included',
            ].map((item, i) => (
              <li key={i} className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/checkout"
            className="block w-full bg-white text-primary-600 hover:bg-gray-50 text-center font-semibold px-6 py-4 rounded-lg transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
