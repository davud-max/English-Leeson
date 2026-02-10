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

  const displayLessons = lessons.slice(0, 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="font-bold text-gray-800">Cognitive Algorithms</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/lessons" className="text-gray-600 hover:text-gray-900 transition">
                Didactic Units
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">
                Academic Portal
              </Link>
              <Link
                href="/checkout"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                Academic Registration
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span>🎓</span>
            <span>{lessons.length || 25}+ Interactive Didactic Units with Algorithmic Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Philosophical Foundations of
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Cognitive Algorithms</span>
            <br />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A systematic investigation into the epistemological foundations of human cognition, 
            examining the formal structures underlying abstract thought and the axiomatic 
            principles governing knowledge formation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checkout"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Commence Didactic Journey — $30
            </Link>
            <Link
              href="/lessons"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold px-10 py-4 rounded-xl text-lg transition border-2 border-gray-200 hover:border-gray-300"
            >
              Didactic Preview →
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Perpetual Access
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Algorithmic Interrogatives
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Vocal Interface
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Epistemological Framework</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A rigorous methodological approach to understanding cognitive processes and knowledge formation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { emoji: '🎯', title: 'Systematic Didactics', desc: 'Methodologically structured progression from axiomatic concepts to advanced epistemological frameworks' },
              { emoji: '🤖', title: 'Algorithmic Assessment', desc: 'Formally generated interrogatives deployed by computational intelligence based on each didactic unit' },
              { emoji: '🎤', title: 'Phenomenological Interface', desc: 'Respond to theoretical propositions through vocal interaction for naturalistic engagement' },
              { emoji: '📖', title: 'Auditory Exposition', desc: 'Formal audio presentation of theoretical content with synchronized textual annotation' },
              { emoji: '🧠', title: 'Conceptual Mastery', desc: 'Comprehensive apprehension of the foundational principles underlying knowledge formation' },
              { emoji: '🎓', title: 'Scholarly Certification', desc: 'Recognition upon demonstration of theoretical proficiency and analytical competency' },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Didactic Curriculum</h2>
            <p className="text-xl text-gray-600">
              {lessons.length || 25}+ comprehensive didactic units examining all aspects of cognition
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {displayLessons.map((lesson) => (
                <div key={lesson.order} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                      {lesson.order}
                    </span>
                    <span className="text-sm text-gray-400">{lesson.duration} min</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              View All {lessons.length || 25} Didactic Units
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Epistemological Mastery</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Formal Epistemological Foundations', desc: 'Systematically investigate the transcendental conditions enabling knowledge formation through rigorous methodological analysis' },
                { title: 'Praxeological Methodology', desc: 'Examine the science of purposeful human behavior and catallactic reasoning' },
                { title: 'Cognitive Phenomenology', desc: 'Examine the generative mechanisms of thought emergence and phenomenal interaction' },
                { title: 'Metaphysical Inquiry', desc: 'Systematic investigation of existential foundations, conscious experience, and apodictic truth' },
                { title: 'Analytical Competency', desc: 'Deploy rigorous methodological tools for systematic analysis, logical inference, and formal reasoning' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl p-10 shadow-2xl text-center">
              <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                LIFETIME ACCESS
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Complete Curriculum</h2>
              
              <div className="my-8">
                <span className="text-6xl font-bold text-gray-900">$30</span>
                <span className="text-gray-500 ml-2">one-time payment</span>
              </div>

              <ul className="space-y-4 text-left mb-10">
                {[
                  `${lessons.length || 25}+ interactive didactic units`,
                  'Algorithmically-generated personalized interrogatives',
                  'Vocal articulation for responses',
                  'Auditory exposition for all didactic materials',
                  'Perpetual access to all content',
                  'Academic certification upon completion',
                  'Prospective curriculum enhancements included',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="bg-green-100 text-green-600 rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl text-lg transition shadow-lg hover:shadow-xl"
              >
                Academic Registration
              </Link>
              
              <p className="text-sm text-gray-500 mt-6">
                Tri-decade satisfaction assurance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Methodological Inquiries
            </h2>
            
            <div className="space-y-4">
              {[
                { q: 'What is the duration of access?', a: 'Perpetual access! Upon enrollment, you gain indefinite access to all materials, inclusive of any forthcoming updates.' },
                { q: 'Is there a satisfaction guarantee?', a: 'Affirmative! We provide a tri-decade money-back assurance. If your expectations remain unmet, engage with us for a complete reimbursement.' },
                { q: 'Are there any prerequisite qualifications?', a: 'Nil prerequisites. The curriculum initiates from fundamental axioms and develops systematically.' },
                { q: 'How does the algorithmic assessment function?', a: 'Subsequent to each didactic unit, our artificial intelligence generates unique interrogatives predicated on the content. Responses may be articulated via vocal or textual modalities.' },
                { q: 'Can the materials be obtained offline?', a: 'Affirmative, all auditory files and transcriptions are available for acquisition in an asynchronous learning modality.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-gray-50 rounded-xl overflow-hidden">
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-100 transition">
                    {faq.q}
                    <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prepared for Cognitive Metamorphosis?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Participate with scholars engaged in the mastery of cognitive algorithms
          </p>
          <Link
            href="/checkout"
            className="inline-block bg-white text-gray-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-gray-100 transition shadow-xl"
          >
            Initiate Academic Journey — $30
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="font-bold text-white">Cognitive Algorithms</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/lessons" className="hover:text-white transition">Didactic Units</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2025 Philosophical Foundations of Cognitive Algorithms. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
