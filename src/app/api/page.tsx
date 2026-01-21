import Link from 'next/link'

const LESSONS = [
  { order: 1, title: 'Terms and Definitions', description: 'How knowledge is born. Fundamental terms: point, line, plane, space. Two opposing movements of thought.', duration: 40, available: true },
  { order: 2, title: 'What Is Counting?', description: 'The origin of counting. Group, numeral, digit. Counting on fingers: dozen, score, gross. Natural numbers.', duration: 30 },
  { order: 3, title: 'What Is a Formula?', description: 'The emergence of the concept of a parameter. Relationships between quantities and formulae. The number π.', duration: 30 },
  { order: 4, title: 'Abstraction and Rules', description: 'Human beings and thinking. Abstraction and knowledge. Literacy as rule-based action.', duration: 25 },
  { order: 5, title: 'Human Activity: Praxeology, Economics, and Imitation', description: 'What kind of activity is worthy of a human being? How can creation be distinguished from imitation?', duration: 25 },
  { order: 6, title: 'Human Activity and Economics', description: 'From communication to law. Levels of civilization. Goals and goods. Ethics and experience.', duration: 25 },
  { order: 7, title: 'The Fair and the Coin: The Birth of Money', description: 'How money, markets, and banks emerged from the exchange of gifts between tribes.', duration: 25 },
  { order: 8, title: 'The Theory of Cognitive Resonance I', description: 'How does thought arise? Two circuits of consciousness and the mechanism of resonance.', duration: 25 },
  { order: 9, title: 'The Creation of the World', description: 'Heaven and earth, water and light — a philosophical analysis of the first chapter of Genesis.', duration: 20 },
  { order: 10, title: 'The Theory of Cognitive Resonance II', description: 'How we think. Continuation of the topic.', duration: 25 },
  { order: 11, title: 'The Number 666', description: 'A philosophical interpretation of the number of the Beast through the theory of abstraction.', duration: 20 },
  { order: 12, title: 'Three Steps to Heaven: 666', description: 'The number 666 as a formula of ascent.', duration: 22 },
  { order: 13, title: 'The Sixth Human Level', description: 'The transition from external law to internal law.', duration: 25 },
  { order: 14, title: 'How Consciousness Creates the World', description: 'The act of primary distinction. The triad: Being, Consciousness, and the Act of Distinction.', duration: 20 },
  { order: 15, title: 'A Theory of Everything', description: 'A philosophical hypothesis about the fundamental nature of reality beyond space.', duration: 25 },
  { order: 16, title: 'Minus-Space', description: 'Abstraction as the substance of the world.', duration: 20 },
  { order: 17, title: 'The Human Path Through Abstraction to Truth', description: 'A synthesis of all lessons: from the capacity to distinguish to the comprehension of unity.', duration: 30 },
]

export default function HomePage() {
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
          <p className="text-center text-gray-600 mb-12">17 comprehensive lessons</p>
          <div className="max-w-4xl mx-auto space-y-4">
            {LESSONS.map((lesson) => (
              <div key={lesson.order} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
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
                          Preview Free →
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
            ))}
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
                '17 interactive lessons',
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
