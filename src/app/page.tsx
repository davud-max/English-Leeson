'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Lesson {
  order: number
  title: string
  description: string
  duration: number
  emoji?: string
  locked?: boolean
  free?: boolean
  available?: boolean
}

export default function HomePage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [coursePrice, setCoursePrice] = useState(30)
  const [courseCurrency, setCourseCurrency] = useState('USD')

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data.lessons || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch(`/api/course?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const parsedPrice = typeof data?.price === 'number' ? data.price : Number(data?.price)
        if (Number.isFinite(parsedPrice)) setCoursePrice(parsedPrice)
        if (typeof data?.currency === 'string' && data.currency.trim()) setCourseCurrency(data.currency)
      })
      .catch(() => {})
  }, [])

  const availableLessons = lessons.filter((l: any) => l.available !== false)
  const lessonsCount = availableLessons.length || 21

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-stone-800/60 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden>🪜</span>
            <span className="font-serif text-lg font-semibold tracking-wide text-amber-100">
              Mind Ladder
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-md border border-stone-700 px-3 py-2 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/checkout"
              className="rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-600 transition-colors"
            >
              Enroll
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-stone-800/60">
          {/* subtle gradient glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent" />

          <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-amber-500/80">
              An audio course on the structure of thought
            </p>

            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl text-amber-50">
              Mind Ladder
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400 sm:text-xl">
              {lessonsCount} lessons. Audio. For those who want to think clearly.
            </p>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-stone-400">
              This is not another course on &ldquo;critical thinking.&rdquo;<br className="hidden sm:inline" />{' '}
              This is a quiet, deep walk through the structure of your own mind.
            </p>

            <p className="mt-3 text-sm text-stone-500">
              No ads. No pop-ups. Just voice, questions, and time to think.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/lessons"
                className="rounded-lg bg-amber-700 px-8 py-3.5 text-sm font-semibold text-amber-50 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-900/30"
              >
                Enter the Ladder
              </Link>
              <Link
                href="/checkout"
                className="rounded-lg border border-stone-700 px-8 py-3.5 text-sm font-semibold text-stone-300 hover:border-stone-500 hover:text-white transition-colors"
              >
                Full Access — {coursePrice} {courseCurrency}
              </Link>
            </div>
          </div>
        </section>

        {/* ── What is Mind Ladder ── */}
        <section className="border-b border-stone-800/60">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="font-serif text-2xl text-amber-100 sm:text-3xl">
              What is Mind Ladder?
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-400 max-w-2xl">
              <p>
                An audio course about how thinking actually works — from the simplest act
                of noticing something, to the deepest questions about meaning, self, and silence.
              </p>
              <p>
                It is built on 20 years of research and teaching.
                But here, there are no textbooks, no exams, no grades.
              </p>
              <p className="text-stone-300">
                Just {lessonsCount} lessons. Each one a conversation. Each one a step.
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b border-stone-800/60 bg-stone-900/40">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="font-serif text-2xl text-amber-100 sm:text-3xl">
              How it works
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '🎧', title: `${lessonsCount} audio lessons`, desc: 'Listen anywhere — on a walk, in the car, before sleep' },
                { icon: '🧠', title: 'Audio questions', desc: 'Not tests — invitations to think deeper after each lesson' },
                { icon: '✨', title: 'No distractions', desc: 'No video, no text walls. Just you and the voice' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-stone-800 bg-stone-900/60 p-5">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-semibold text-stone-200">{item.title}</div>
                  <div className="mt-1.5 text-sm text-stone-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── For whom ── */}
        <section className="border-b border-stone-800/60">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="font-serif text-2xl text-amber-100 sm:text-3xl">
              For whom?
            </h2>
            <div className="mt-8 space-y-4 text-base text-stone-400 max-w-2xl">
              <p>You are a teacher and feel something is missing in how we teach &ldquo;thinking.&rdquo;</p>
              <p>You are a parent who wants to help your child <em className="text-stone-300">understand</em>, not just memorize.</p>
              <p>You are simply someone who has wondered: <em className="text-stone-300">How do I know what I know?</em></p>
              <p>Or maybe you just want to listen to something real for once.</p>
            </div>
          </div>
        </section>

        {/* ── The Lessons ── */}
        <section className="border-b border-stone-800/60 bg-stone-900/40">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif text-2xl text-amber-100 sm:text-3xl">The Lessons</h2>
                <p className="mt-2 text-sm text-stone-500">Each step builds on the previous one</p>
              </div>
              <Link
                href="/lessons"
                className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="rounded-lg border border-stone-800 p-6 text-sm text-stone-500">
                Loading curriculum...
              </div>
            ) : (
              <div className="space-y-1">
                {lessons.filter((l) => l.available !== false).map((lesson) => {
                  const isLocked = lesson.locked && !lesson.free
                  return (
                    <Link
                      key={lesson.order}
                      href={isLocked ? '/checkout' : `/lessons/${lesson.order}`}
                      className={`flex items-center gap-4 rounded-md px-4 py-3 transition-colors group ${
                        isLocked ? 'opacity-60 hover:bg-stone-800/20' : 'hover:bg-stone-800/40'
                      }`}
                    >
                      <span className="w-7 text-right text-sm font-mono text-stone-600 group-hover:text-stone-400 transition-colors">
                        {lesson.order}
                      </span>
                      <span className="text-lg" aria-hidden>{lesson.emoji || '📖'}</span>
                      <span className={`flex-1 transition-colors ${
                        isLocked ? 'text-stone-500' : 'text-stone-300 group-hover:text-stone-100'
                      }`}>
                        {lesson.title}
                      </span>
                      {isLocked ? (
                        <span className="text-xs text-stone-600">🔒</span>
                      ) : lesson.free ? (
                        <span className="text-xs text-green-600">free</span>
                      ) : (
                        <span className="text-xs text-stone-600">
                          {lesson.duration} min
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── What you'll walk away with ── */}
        <section className="border-b border-stone-800/60">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="font-serif text-2xl text-amber-100 sm:text-3xl">
              What you will walk away with
            </h2>
            <div className="mt-8 space-y-4 text-base text-stone-400 max-w-2xl">
              <p>A living sense of how terms, numbers, and formulas are born.</p>
              <p>A map of the mind&apos;s levels — from instinct to insight.</p>
              <p>A way to read sacred texts as mirrors of consciousness.</p>
              <p>A quiet understanding of what &ldquo;enlightenment&rdquo; might actually mean.</p>
              <p className="text-stone-300">And maybe — just maybe — a different relationship with yourself.</p>
            </div>
          </div>
        </section>

        {/* ── The Author ── */}
        <section className="border-b border-stone-800/60 bg-stone-900/40">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="font-serif text-2xl text-amber-100 sm:text-3xl">
              The voice behind it
            </h2>
            <div className="mt-6 space-y-3 text-base text-stone-400 max-w-2xl">
              <p className="text-stone-200 font-medium">Davud Zulumkhanov</p>
              <p>PhD in Education. Author of two books:</p>
              <p className="italic text-stone-500">
                Simple Mathematics for Children and Adults<br />
                The Theory of Abstraction: Lessons from Scripture
              </p>
              <p className="mt-4">
                He has been developing this approach for over 20 years.
                Not to sell it. To share it.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-b from-stone-950 to-stone-900">
          <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <p className="text-sm text-stone-500 mb-4">This is not a product. It is a path.</p>
            <h2 className="font-serif text-3xl text-amber-100 sm:text-4xl">
              Start here
            </h2>
            <p className="mx-auto mt-4 max-w-md text-stone-400">
              One payment. Full access. Lifetime.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/lessons"
                className="rounded-lg bg-amber-700 px-8 py-3.5 text-sm font-semibold text-amber-50 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-900/30"
              >
                Enter the Ladder
              </Link>
              <Link
                href="/checkout"
                className="rounded-lg border border-stone-700 px-8 py-3.5 text-sm font-semibold text-stone-300 hover:border-stone-500 hover:text-white transition-colors"
              >
                Full Access — {coursePrice} {courseCurrency}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-800/60 bg-stone-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Mind Ladder — Davud Zulumkhanov</p>
          <div className="flex gap-5">
            <Link href="/lessons" className="hover:text-stone-300 transition-colors">
              Lessons
            </Link>
            <Link href="/login" className="hover:text-stone-300 transition-colors">
              Portal
            </Link>
            <Link href="/checkout" className="hover:text-stone-300 transition-colors">
              Enrollment
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
