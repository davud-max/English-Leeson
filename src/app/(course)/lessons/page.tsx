'use client'

import Link from 'next/link'

const LESSONS = [
  { 
    order: 1, 
    title: '📐 Terms and Definitions', 
    description: 'How knowledge is born. Fundamental terms: point, line, plane, space. Two opposing movements of thought.',
    duration: 40,
    available: true,
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    order: 2, 
    title: '🔢 What Is Counting?', 
    description: 'The origin of counting. Group, numeral, digit. Counting on fingers: dozen, score, gross. Natural numbers.',
    duration: 30,
    available: true,
    color: 'from-green-500 to-emerald-600'
  },
  { 
    order: 3, 
    title: '📊 What Is a Formula?', 
    description: 'The emergence of the concept of a parameter. Relationships between quantities and formulae. The number π.',
    duration: 30,
    available: true,
    color: 'from-purple-500 to-violet-600'
  },
  { 
    order: 4, 
    title: '🧠 Abstraction and Rules', 
    description: 'Human beings and thinking. Abstraction and knowledge. Literacy as rule-based action.',
    duration: 25,
    available: true,
    color: 'from-indigo-500 to-purple-600'
  },
  { 
    order: 5, 
    title: '🎭 Human Activity: Praxeology', 
    description: 'What kind of activity is worthy of a human being? How can creation be distinguished from imitation?',
    duration: 25,
    available: true,
    color: 'from-orange-500 to-red-600'
  },
  { 
    order: 6, 
    title: '💼 Human Activity and Economics', 
    description: 'From communication to law. Levels of civilization. Goals and goods. Ethics and experience.',
    duration: 25,
    available: true,
    color: 'from-teal-500 to-cyan-600'
  },
  { 
    order: 7, 
    title: '💰 The Fair and the Coin', 
    description: 'How money, markets, and banks emerged from the exchange of gifts between tribes.',
    duration: 25,
    available: true,
    color: 'from-yellow-500 to-amber-600'
  },
  { 
    order: 8, 
    title: '🧠 Theory of Cognitive Resonance', 
    description: 'How does thought arise? Two circuits of consciousness and the mechanism of resonance.',
    duration: 25,
    available: true,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    order: 9, 
    title: '📖 Sacred Text and Reality', 
    description: 'Heaven and earth, water and light — a philosophical analysis of the first chapter of Genesis.',
    duration: 25,
    available: true,
    color: 'from-sky-500 to-blue-600'
  },
  { 
    order: 10, 
    title: '📻 How Thought Finds Us', 
    description: 'The radio receiver model of consciousness. How we catch thoughts through cognitive resonance.',
    duration: 30,
    available: true,
    color: 'from-fuchsia-500 to-pink-600'
  },
  { 
    order: 11, 
    title: '🔢 The Number 666', 
    description: 'A philosophical interpretation of the number of the Beast through the theory of abstraction.',
    duration: 20,
    available: false,
    color: 'from-red-500 to-rose-600'
  },
  { 
    order: 12, 
    title: '⬆️ Three Steps to Heaven', 
    description: 'The number 666 as a formula of ascent.',
    duration: 22,
    available: false,
    color: 'from-violet-500 to-purple-600'
  },
  { 
    order: 13, 
    title: '👤 The Sixth Human Level', 
    description: 'The transition from external law to internal law.',
    duration: 25,
    available: false,
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    order: 14, 
    title: '🌌 How Consciousness Creates', 
    description: 'The act of primary distinction. The triad: Being, Consciousness, and the Act of Distinction.',
    duration: 20,
    available: false,
    color: 'from-indigo-500 to-blue-600'
  },
  { 
    order: 15, 
    title: '🌐 A Theory of Everything', 
    description: 'A philosophical hypothesis about the fundamental nature of reality beyond space.',
    duration: 25,
    available: false,
    color: 'from-cyan-500 to-teal-600'
  },
  { 
    order: 16, 
    title: '➖ Minus-Space', 
    description: 'Abstraction as the substance of the world.',
    duration: 20,
    available: false,
    color: 'from-gray-600 to-slate-700'
  },
  { 
    order: 17, 
    title: '🎯 The Human Path', 
    description: 'A synthesis of all lessons: from the capacity to distinguish to the comprehension of unity.',
    duration: 30,
    available: false,
    color: 'from-amber-500 to-orange-600'
  },
]

export default function LessonsPage() {
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
            <Link 
              href="/" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Progress</h2>
              <p className="text-gray-600">10 of 17 lessons available • Complete all lessons to earn your certificate</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">7</div>
                <div className="text-sm text-gray-500">Locked</div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" style={{ width: '59%' }}></div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LESSONS.map((lesson) => (
            <div 
              key={lesson.order}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                lesson.available 
                  ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' 
                  : 'opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${lesson.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Lesson {lesson.order}
                  </span>
                  <span className="text-sm">⏱️ {lesson.duration} min</span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                
                {lesson.available ? (
                  <Link 
                    href={`/lessons/${lesson.order}`}
                    className={`block w-full text-center bg-gradient-to-r ${lesson.color} text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity`}
                  >
                    Start Lesson →
                  </Link>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-400 py-3 bg-gray-100 rounded-xl">
                    <span>🔒</span>
                    <span>Enroll to Unlock</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 text-white text-center shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">🚀 Unlock All 17 Lessons!</h2>
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
