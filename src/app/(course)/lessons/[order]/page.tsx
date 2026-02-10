'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Slide {
  id: number
  title: string
  content: string
  emoji: string
  duration?: number
}

interface Lesson {
  id: string
  order: number
  title: string
  description: string
  content: string | null
  duration: number
  emoji: string
  color: string
  available: boolean
  slides: Slide[] | null
}

interface Navigation {
  prev: { order: number; title: string } | null
  next: { order: number; title: string } | null
  total: number
}

export default function DynamicLessonPage() {
  const params = useParams()
  const { data: session, status: sessionStatus } = useSession()
  const lessonOrder = parseInt(params.order as string)
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [navigation, setNavigation] = useState<Navigation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioError, setAudioError] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isNaN(lessonOrder)) {
      setError('Invalid lesson number')
      setLoading(false)
      return
    }
    
    fetchLesson()
  }, [lessonOrder])

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonOrder}`)
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to load lesson')
        return
      }
      
      setLesson(data.lesson)
      setNavigation(data.navigation)
      setHasAccess(data.hasAccess)
    } catch (err) {
      setError('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  // Создаём слайды из контента если нет готовых
  const slides: Slide[] = useMemo(() => {
    if (!lesson?.content) return []
    return lesson.slides || [{
      id: 1,
      title: lesson.title,
      content: lesson.content,
      emoji: lesson.emoji || '📖',
      duration: 30000,
    }]
  }, [lesson])

  const totalSlides = slides.length

  // Аудио проигрывание
  useEffect(() => {
    if (!isPlaying || !lesson || !hasAccess) return

    const audioFile = `/audio/lesson${lessonOrder}/slide${currentSlide + 1}.mp3`
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.play().catch(() => {
        setAudioError(true)
        const duration = slides[currentSlide]?.duration || 20000
        timerRef.current = setTimeout(() => {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1)
          } else {
            setIsPlaying(false)
          }
        }, duration)
      })
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentSlide, isPlaying, lesson, lessonOrder, slides, totalSlides, hasAccess])

  // Прогресс бар
  useEffect(() => {
    if (!isPlaying || !audioError) return
    
    const duration = slides[currentSlide]?.duration || 20000
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + (100 / (duration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, audioError, currentSlide, slides])

  useEffect(() => {
    if (!isPlaying || audioError) return
    
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(percent)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, audioError])

  const handleAudioEnded = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1)
      setProgress(0)
    } else {
      setIsPlaying(false)
      setProgress(100)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      if (timerRef.current) clearTimeout(timerRef.current)
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      setProgress(0)
    }
  }

  const goToSlide = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrentSlide(index)
    setProgress(0)
    if (isPlaying) setAudioError(false)
  }

  // Loading state
  if (loading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Lesson Not Found</h2>
          <p className="text-stone-600 mb-6">{error || 'This lesson does not exist'}</p>
          <Link href="/lessons" className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800">
            ← Back to Lessons
          </Link>
        </div>
      </div>
    )
  }

  // No access - show paywall
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
                ← Back to Course
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
                <p className="text-stone-400 text-sm">Lecture {lessonOrder}</p>
              </div>
              <div></div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">{lesson.emoji || '🔒'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
            <p className="text-gray-600 mb-6">{lesson.description}</p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">
                {session ? 'Course Purchase Required' : 'Sign In Required'}
              </h3>
              <p className="text-amber-700 text-sm">
                {session 
                  ? 'You need to purchase the course to access this lesson.'
                  : 'Please sign in or create an account to access the lessons.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link
                  href="/checkout"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                >
                  🛒 Enroll Now - $30
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/checkout"
                    className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition"
                  >
                    Create Account & Enroll
                  </Link>
                </>
              )}
            </div>

            <p className="text-gray-500 text-sm mt-6">
              Get lifetime access to all {navigation?.total || 25}+ lessons
            </p>
          </div>
        </main>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen bg-stone-50">
      <audio ref={audioRef} onEnded={handleAudioEnded} onError={() => setAudioError(true)} />
      
      {/* Header */}
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
              ← Back to Course
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture {lessonOrder}</p>
            </div>
            <div className="text-stone-400 text-sm">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Lesson Title */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData?.emoji || lesson.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">
            {currentSlideData?.title || lesson.title}
          </h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        {/* Content Card */}
        <article className="bg-white rounded-lg shadow-lg border border-stone-200 p-8 md:p-12 mb-8">
          <div className="prose prose-stone prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-stone-700 leading-relaxed mb-5 text-lg">{children}</p>,
                strong: ({children}) => <strong className="text-stone-900 font-semibold">{children}</strong>,
                em: ({children}) => <em className="text-stone-600 italic">{children}</em>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-amber-700 pl-6 my-6 italic text-stone-600 bg-amber-50 py-4 pr-4 rounded-r">
                    {children}
                  </blockquote>
                ),
                ul: ({children}) => <ul className="list-disc list-outside ml-6 text-stone-700 space-y-2 my-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-outside ml-6 text-stone-700 space-y-2 my-4">{children}</ol>,
                li: ({children}) => <li className="text-stone-700 leading-relaxed">{children}</li>,
                h1: ({children}) => <h1 className="text-2xl font-bold text-stone-900 mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-bold text-stone-900 mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-bold text-stone-900 mt-4 mb-2">{children}</h3>,
              }}
            >
              {currentSlideData?.content || lesson.content || ''}
            </ReactMarkdown>
          </div>
        </article>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500 font-medium">Slide Progress</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-700 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {audioError && (
            <p className="text-xs text-stone-400 mt-2 text-center">
              Audio unavailable — using timed advancement
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium"
          >
            ← Previous
          </button>
          
          <button
            onClick={togglePlay}
            className="px-8 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Lecture'}
          </button>
          
          <button
            onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
            disabled={currentSlide === totalSlides - 1}
            className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium"
          >
            Next →
          </button>
        </div>

        {/* Slide Navigation */}
        {totalSlides > 1 && (
          <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`p-3 rounded text-sm font-medium transition ${
                    index === currentSlide
                      ? 'bg-amber-700 text-white'
                      : index < currentSlide
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                  title={slide.title}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            {navigation?.prev ? (
              <Link href={`/lessons/${navigation.prev.order}`} className="hover:text-white transition">
                ← Lecture {navigation.prev.order}
              </Link>
            ) : (
              <span></span>
            )}
            <span className="text-stone-500 text-sm font-serif">Lecture {lessonOrder}</span>
            {navigation?.next ? (
              <Link href={`/lessons/${navigation.next.order}`} className="hover:text-white transition">
                Lecture {navigation.next.order} →
              </Link>
            ) : (
              <Link href="/lessons" className="hover:text-white transition">
                All Lessons →
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
