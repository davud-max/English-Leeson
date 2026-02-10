'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Lesson {
  order: number
  title: string
  description: string
  duration: number
  emoji?: string
}

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data.lessons || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-stone-900 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold">Academy of Thought</span>
                <span className="hidden md:inline text-stone-400 text-sm ml-2">Est. 2025</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/lessons" className="text-stone-300 hover:text-white transition text-sm">
                Curriculum
              </Link>
              <Link href="/login" className="text-stone-300 hover:text-white transition text-sm">
                Sign In
              </Link>
              <Link
                href="/checkout"
                className="bg-amber-700 hover:bg-amber-600 text-white px-5 py-2 rounded text-sm font-medium transition"
              >
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-amber-500 font-medium mb-4 tracking-wider uppercase text-sm">
              Philosophy & Cognitive Science
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Algorithms of Thinking and Cognition
            </h1>
            <p className="text-xl text-stone-300 mb-8 leading-relaxed">
              A rigorous philosophical course exploring the foundations of human thought, 
              the nature of abstraction, and the principles by which knowledge is created.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/checkout"
                className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded text-center transition"
              >
                Begin Your Studies — $30
              </Link>
              <Link
                href="/lessons"
                className="border border-stone-600 hover:border-stone-500 text-stone-300 hover:text-white font-medium px-8 py-4 rounded text-center transition"
              >
                View Curriculum
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-stone-400 text-sm">
              <span>📚 {lessons.length || 25}+ Lectures</span>
              <span>⏱️ 12+ Hours</span>
              <span>🎓 Certificate</span>
            </div>
          </div>
        </div>
      </section>

      {/* About the Course */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
              About This Course
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto mb-6"></div>
            <p className="text-lg text-stone-600 leading-relaxed">
              This course presents a systematic investigation into the mechanisms of human cognition. 
              Drawing from philosophy, mathematics, and cognitive science, we examine how abstract 
              thought emerges, how rules govern knowledge, and how consciousness creates meaning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📐',
                title: 'Foundations of Abstraction',
                desc: 'Explore how the mind moves from concrete experience to abstract principles through systematic observation and analysis.'
              },
              {
                icon: '🧠',
                title: 'Theory of Cognition',
                desc: 'Investigate the cognitive resonance model — a framework for understanding how thoughts arise and interact with reality.'
              },
              {
                icon: '📜',
                title: 'Philosophical Analysis',
                desc: 'Apply rigorous philosophical methods to fundamental questions about knowledge, consciousness, and human purpose.'
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{item.title}</h3>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
              Course Structure
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto mb-6"></div>
            <p className="text-stone-600 max-w-2xl mx-auto">
              The curriculum is organized into four interconnected modules, each building upon the previous 
              to construct a comprehensive understanding of cognitive processes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                module: 'I',
                title: 'Foundations',
                topics: ['Terms & Definitions', 'The Nature of Counting', 'Formulae & Parameters', 'Abstraction & Rules'],
                lectures: '1-4'
              },
              {
                module: 'II',
                title: 'Human Activity',
                topics: ['Praxeology', 'Economics & Ethics', 'Origins of Money', 'Civilization & Law'],
                lectures: '5-7'
              },
              {
                module: 'III',
                title: 'Cognitive Theory',
                topics: ['Cognitive Resonance I & II', 'Sacred Texts Analysis', 'The Number 666', 'Levels of Being'],
                lectures: '8-13'
              },
              {
                module: 'IV',
                title: 'Synthesis',
                topics: ['Consciousness & Creation', 'Theory of Everything', 'Minus-Space', 'The Path to Truth'],
                lectures: '14-17'
              },
            ].map((mod, i) => (
              <div key={i} className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-stone-900 text-amber-500 w-12 h-12 rounded flex items-center justify-center font-serif font-bold text-lg flex-shrink-0">
                    {mod.module}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">{mod.title}</h3>
                    <p className="text-sm text-stone-500 mb-3">Lectures {mod.lectures}</p>
                    <ul className="space-y-1">
                      {mod.topics.map((topic, j) => (
                        <li key={j} className="text-stone-600 text-sm flex items-center gap-2">
                          <span className="text-amber-700">•</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Will Learn */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
              Learning Outcomes
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'Understand the fundamental principles of abstraction and how knowledge emerges from observation',
              'Apply praxeological analysis to human action and economic reasoning',
              'Comprehend the theory of cognitive resonance and its implications for consciousness',
              'Analyze philosophical texts using systematic interpretive methods',
              'Recognize the relationship between language, mathematics, and thought',
              'Develop critical thinking skills through rigorous philosophical inquiry',
            ].map((outcome, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-stone-700">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Features */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Course Features
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎧', title: 'Audio Lectures', desc: 'Professional narration for each lecture, allowing study during commute or exercise' },
              { icon: '🤖', title: 'AI Assessment', desc: 'Personalized questions generated by artificial intelligence to test comprehension' },
              { icon: '🎤', title: 'Voice Interaction', desc: 'Respond to questions verbally for a more natural learning experience' },
              { icon: '📝', title: 'Written Materials', desc: 'Complete transcripts and supplementary readings for in-depth study' },
              { icon: '♾️', title: 'Lifetime Access', desc: 'Return to the material at any time, with all future updates included' },
              { icon: '📜', title: 'Certificate', desc: 'Receive a certificate of completion upon finishing all lectures and assessments' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 border border-stone-700 rounded-lg hover:border-amber-700 transition">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-stone-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Lectures */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
              Lecture Preview
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto mb-6"></div>
            <p className="text-stone-600">A selection of lectures from the curriculum</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {lessons.slice(0, 8).map((lesson) => (
                <div key={lesson.order} className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg hover:border-amber-700 transition">
                  <div className="bg-stone-100 text-stone-700 w-12 h-12 rounded flex items-center justify-center font-serif font-bold">
                    {lesson.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-900 truncate">{lesson.title}</h3>
                    <p className="text-sm text-stone-500">{lesson.duration} minutes</p>
                  </div>
                  <span className="text-stone-400">🔒</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/lessons"
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              View Complete Curriculum →
            </Link>
          </div>
        </div>
      </section>

      {/* Enrollment */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
            Begin Your Studies
          </h2>
          <div className="w-16 h-1 bg-amber-700 mx-auto mb-6"></div>
          
          <div className="bg-white rounded-lg border border-stone-200 p-8 shadow-lg">
            <div className="mb-6">
              <span className="text-5xl font-serif font-bold text-stone-900">$30</span>
              <span className="text-stone-500 ml-2">one-time payment</span>
            </div>
            
            <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
              {[
                `${lessons.length || 25}+ comprehensive lectures`,
                'Audio narration for all content',
                'AI-powered assessment questions',
                'Voice interaction capabilities',
                'Lifetime access to materials',
                'Certificate of completion',
                '30-day satisfaction guarantee',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-stone-700">
                  <span className="text-amber-700">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/checkout"
              className="block w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded transition"
            >
              Enroll Now
            </Link>
            
            <p className="text-sm text-stone-500 mt-4">
              Secure payment via Stripe
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="space-y-4">
            {[
              { 
                q: 'What prerequisites are required?', 
                a: 'No specific prerequisites are required. The course begins with foundational concepts and builds progressively. A genuine interest in philosophical inquiry is the only requirement.' 
              },
              { 
                q: 'How long will I have access to the course?', 
                a: 'Your enrollment provides lifetime access to all course materials, including any future updates or additions to the curriculum.' 
              },
              { 
                q: 'Is there a refund policy?', 
                a: 'Yes. We offer a 30-day satisfaction guarantee. If the course does not meet your expectations, contact us for a full refund.' 
              },
              { 
                q: 'How does the AI assessment work?', 
                a: 'After each lecture, our AI system generates personalized questions based on the material. You may respond via text or voice, and receive feedback on your understanding.' 
              },
              { 
                q: 'Can I download the materials for offline study?', 
                a: 'Yes. All audio lectures and written materials are available for download.' 
              },
            ].map((faq, i) => (
              <details key={i} className="group border border-stone-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-stone-900 hover:bg-stone-50 transition flex items-center justify-between">
                  {faq.q}
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-stone-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t-4 border-amber-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
                <span>🎓</span>
              </div>
              <span className="font-serif">Academy of Thought</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/lessons" className="hover:text-white transition">Curriculum</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
            © 2025 Algorithms of Thinking and Cognition. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
