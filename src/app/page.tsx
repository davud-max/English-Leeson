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

  const displayLessons = lessons.slice(0, 6)
  const lessonsCount = lessons.length || 27

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="font-serif text-lg font-semibold tracking-wide">
            Algorithms of Thinking
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-100"
            >
              Sign In
            </Link>
            <Link
              href="/checkout"
              className="rounded-md bg-stone-900 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Enroll
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-stone-200">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.14em] text-stone-600">
                Structured online course
              </p>
              <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Philosophical and practical foundations of disciplined thinking
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-700 sm:text-lg">
                A step-by-step curriculum on abstraction, definitions, reasoning,
                and decision-making. Learn in a clear sequence with lessons,
                audio narration, and question-based reinforcement.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/checkout"
                  className="rounded-md bg-stone-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Start Course - $30
                </Link>
                <Link
                  href="/lessons"
                  className="rounded-md border border-stone-300 px-6 py-3 text-center text-sm font-semibold text-stone-800 hover:bg-stone-100"
                >
                  View Curriculum
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-md border border-stone-200 bg-white p-3">
                  <div className="font-semibold">{lessonsCount} lessons</div>
                  <div className="text-stone-600">Structured sequence</div>
                </div>
                <div className="rounded-md border border-stone-200 bg-white p-3">
                  <div className="font-semibold">One-time payment</div>
                  <div className="text-stone-600">Lifetime access</div>
                </div>
                <div className="rounded-md border border-stone-200 bg-white p-3 col-span-2 sm:col-span-1">
                  <div className="font-semibold">Audio + quizzes</div>
                  <div className="text-stone-600">Practice and review</div>
                </div>
              </div>
            </div>

            <aside className="rounded-lg border border-stone-300 bg-white p-6">
              <h2 className="font-serif text-xl">Program at a glance</h2>
              <div className="mt-4 space-y-3 text-sm text-stone-700">
                <p>
                  1. Conceptual basics: term, definition, abstraction.
                </p>
                <p>
                  2. Applied reasoning: counting, formula, structure of thought.
                </p>
                <p>
                  3. Advanced modules: cognition, interpretation, synthesis.
                </p>
              </div>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <p className="text-sm text-stone-600">
                  Access is granted immediately after payment.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl">Curriculum preview</h2>
                <p className="mt-2 text-sm text-stone-600">
                  First modules in the learning sequence
                </p>
              </div>
              <Link
                href="/lessons"
                className="text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
              >
                Full list
              </Link>
            </div>

            {loading ? (
              <div className="rounded-lg border border-stone-200 p-6 text-sm text-stone-600">
                Loading curriculum...
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {displayLessons.map((lesson) => (
                  <article
                    key={lesson.order}
                    className="rounded-md border border-stone-200 p-4"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-stone-500">
                      <span>Lesson {lesson.order}</span>
                      <span>{lesson.duration} min</span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-900">{lesson.title}</h3>
                    <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                      {lesson.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-stone-100">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-lg border border-stone-300 bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl sm:text-3xl">Enrollment</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
                One payment gives full access to all current modules and future
                updates of this course.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-3xl font-bold">$30</div>
                  <div className="text-sm text-stone-600">one-time payment</div>
                </div>
                <Link
                  href="/checkout"
                  className="rounded-md bg-stone-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Algorithms of Thinking and Cognition</p>
          <div className="flex gap-5">
            <Link href="/lessons" className="hover:text-stone-900">
              Lessons
            </Link>
            <Link href="/login" className="hover:text-stone-900">
              Portal
            </Link>
            <Link href="/checkout" className="hover:text-stone-900">
              Enrollment
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
