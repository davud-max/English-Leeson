'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

interface Slide {
  id: number
  title: string
  content: string
  emoji: string
  duration?: number
  audioUrl?: string
}

interface Lesson {
  id: string
  order: number
  title: string
  description: string
  content: string
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

const RAW_AUDIO_BASE = 'https://raw.githubusercontent.com/davud-max/English-Leeson/main/public/audio'
const BACKGROUND_MUSIC_URL = '/audio/background/lesson-bg-v3.mp3'


const LESSON_ONE_INTRO = {
  title: 'Course Introduction',
  lead: 'This first lesson opens not only one topic, but the whole path of the course. We begin with terms and definitions because all further movement of thought depends on the precision with which we distinguish, describe, and name what we encounter.',
  sections: [
    {
      title: 'What lies ahead',
      body: 'In the next lessons we move from terms and definitions to counting, numerals, formulas, parameters, abstraction, rules, literacy, human action, economics, money, the mechanism of thought, consciousness, creation, and the human path toward truth.'
    },
    {
      title: 'The disciplines within the course',
      body: 'This course touches several domains at once: philosophy of language, mathematics, logic, pedagogy, economics, praxeology, phenomenology of thinking, biblical cosmogony, and metaphysics. They are not presented as separate islands, but as one ascending line of understanding.'
    },
    {
      title: 'What this course can open',
      body: 'It can sharpen speech, make thought more exact, reveal how quantity and formula are born, show how action is guided by goals and rules, and gradually lead from the visible world of objects to the invisible structures of meaning, law, consciousness, and abstraction.'
    }
  ]
}

export default function DynamicLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonOrder = parseInt(params.order as string)
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [navigation, setNavigation] = useState<Navigation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isBgMusicEnabled, setIsBgMusicEnabled] = useState(true)
  const [bgMusicBlocked, setBgMusicBlocked] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const isBgMusicEnabledRef = useRef(true)

  useEffect(() => {
    isBgMusicEnabledRef.current = isBgMusicEnabled
  }, [isBgMusicEnabled])

  useEffect(() => {
    if (isNaN(lessonOrder)) {
      setError('Invalid lesson number')
      setLoading(false)
      return
    }
    
    setCurrentSlide(0)
    setIsPlaying(false)
    setBgMusicBlocked(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.pause()
      bgAudioRef.current.currentTime = 0
    }
    fetchLesson()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonOrder])

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonOrder}?t=${Date.now()}`, {
        cache: 'no-store',
      })
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setUnauthorized(true)
          return
        }
        setError(data.error || 'Failed to load lesson')
        return
      }
      
      setLesson(data.lesson)
      setNavigation(data.navigation)
    } catch (err) {
      setError('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const slides: Slide[] = useMemo(() => lesson?.slides || (lesson?.content ? [{
    id: 1,
    title: lesson.title,
    content: lesson.content,
    emoji: lesson.emoji || '📖',
    duration: 30000,
  }] : []), [lesson])

  const totalSlides = slides.length

  const startBackgroundMusic = useCallback((force = false) => {
    if (!force && !isBgMusicEnabledRef.current) return

    if (!bgAudioRef.current) {
      const bg = new Audio(BACKGROUND_MUSIC_URL)
      bg.loop = true
      bg.preload = 'auto'
      bg.volume = 1
      bgAudioRef.current = bg
    }

    if (!bgAudioRef.current.paused) {
      return
    }

    bgAudioRef.current.play().then(() => {
      setBgMusicBlocked(false)
    }).catch((err) => {
      console.error('Background music play error:', err)
      setBgMusicBlocked(true)
    })
  }, [])

  const stopBackgroundMusic = useCallback(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.pause()
    }
  }, [])

  const getAudioCandidates = useCallback((slideIndex: number): string[] => {
    const slideAudioUrl = slides[slideIndex]?.audioUrl || null
    const stableAudioUrl = lesson?.id
      ? `/audio/lesson-${lesson.id}/slide${slideIndex + 1}.mp3`
      : null

    const candidates: string[] = []
    const push = (value?: string | null) => {
      if (!value) return
      const trimmed = value.trim()
      if (!trimmed) return
      if (!candidates.includes(trimmed)) candidates.push(trimmed)
    }

    push(slideAudioUrl)
    push(stableAudioUrl)

    // Raw fallback for GitHub-hosted audio.
    const toRaw = (url: string): string | null => {
      if (!url.startsWith('/audio/')) return null
      return `${RAW_AUDIO_BASE}${url.replace(/^\/audio/, '')}`
    }
    push(slideAudioUrl ? toRaw(slideAudioUrl) : null)
    push(stableAudioUrl ? toRaw(stableAudioUrl) : null)

    return candidates
  }, [lesson?.id, slides])

  const playSlide = useCallback((slideIndex: number, candidateIndex = 0) => {
    const totalSlides = slides.length
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`)
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const candidates = getAudioCandidates(slideIndex)
    const currentAudioPath = candidates[candidateIndex]

    if (!currentAudioPath) {
      console.log('No audio available, using timer')
      setTimeout(() => {
        if (slideIndex < totalSlides - 1) {
          const nextSlide = slideIndex + 1
          setCurrentSlide(nextSlide)
          setProgress(0)
          playSlide(nextSlide)
        } else {
          setIsPlaying(false)
          stopBackgroundMusic()
          setProgress(100)
        }
      }, 20000)
      return
    }

    const audio = new Audio(currentAudioPath)
    audioRef.current = audio
    
    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    
    audio.onended = () => {
      console.log(`Slide ${slideIndex + 1} ended`)
      if (slideIndex < totalSlides - 1) {
        const nextSlide = slideIndex + 1
        setCurrentSlide(nextSlide)
        setProgress(0)
        playSlide(nextSlide)
      } else {
        setIsPlaying(false)
        stopBackgroundMusic()
        setProgress(100)
      }
    }
    
    audio.onerror = () => {
      const nextCandidate = candidateIndex + 1
      if (nextCandidate < candidates.length) {
        console.log(
          `Error loading slide ${slideIndex + 1}, trying fallback ${nextCandidate + 1}/${candidates.length}`
        )
        playSlide(slideIndex, nextCandidate)
        return
      }

      console.log('No audio available, using timer')
      setTimeout(() => {
        if (slideIndex < totalSlides - 1) {
          const nextSlide = slideIndex + 1
          setCurrentSlide(nextSlide)
          setProgress(0)
          playSlide(nextSlide)
        } else {
          setIsPlaying(false)
          stopBackgroundMusic()
          setProgress(100)
        }
      }, 20000)
    }
    
    audio.play().then(() => {
      if (isBgMusicEnabledRef.current) {
        startBackgroundMusic()
      }
    }).catch((err) => {
      console.error('Audio play error:', err)
      if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
        setIsPlaying(false)
        stopBackgroundMusic()
      }
    })
  }, [getAudioCandidates, slides.length, startBackgroundMusic, stopBackgroundMusic])

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      stopBackgroundMusic()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          if (isBgMusicEnabledRef.current) {
            startBackgroundMusic()
          }
        }).catch((err) => {
          console.error('Play failed:', err)
          stopBackgroundMusic()
          setIsPlaying(false)
        })
      } else {
        setProgress(0)
        playSlide(currentSlide)
      }
    }
  }

  const toggleBackgroundMusic = () => {
    const nextEnabled = !isBgMusicEnabled
    setIsBgMusicEnabled(nextEnabled)
    isBgMusicEnabledRef.current = nextEnabled

    if (!nextEnabled) {
      stopBackgroundMusic()
      setBgMusicBlocked(false)
      return
    }

    if (isPlaying) {
      startBackgroundMusic(true)
    }
  }

  const goToSlide = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    setCurrentSlide(index)
    setProgress(0)
    
    if (isPlaying) {
      playSlide(index)
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        bgAudioRef.current = null
      }
    }
  }, [])

  // Unauthorized state
  if (unauthorized) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Access Denied</h2>
          <p className="text-stone-600 mb-6">
            Please log in to access the course lessons.
          </p>
          <div className="space-x-4">
            <Link href="/login" className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 inline-block mr-2">
              Sign In
            </Link>
            <Link href="/checkout" className="px-6 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-800 inline-block">
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
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

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Fixed Audio Controls */}
      <div className="sticky top-0 z-50 bg-white border-b-4 border-amber-700 shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/lessons" className="text-stone-600 hover:text-stone-800 text-sm whitespace-nowrap">
              ← Back
            </Link>
            
            <div className="flex items-center justify-center gap-3 flex-1">
              <button
                onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-4 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition text-sm"
              >
                ← Prev
              </button>
              
              <button
                onClick={togglePlay}
                className="px-6 py-2 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md text-sm"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>

              <button
                onClick={toggleBackgroundMusic}
                className={`px-4 py-2 rounded border text-sm transition ${
                  isBgMusicEnabled
                    ? 'border-amber-500 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {isBgMusicEnabled ? '♪ On' : '♪ Off'}
              </button>
              
              <button
                onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="px-4 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition text-sm"
              >
                Next →
              </button>
            </div>
            
            <div className="text-right text-stone-500 text-sm whitespace-nowrap">
              <div className="font-medium text-stone-700">Lesson {lesson.order}</div>
              <div>{currentSlide + 1}/{totalSlides}</div>
            </div>
          </div>
          {bgMusicBlocked && isBgMusicEnabled && (
            <p className="mt-2 text-center text-xs text-amber-700">
              Background music is blocked by browser settings. Tap Play again.
            </p>
          )}
        </div>
      </div>
            
      {/* Static Lesson Title */}
      <div className="max-w-4xl mx-auto px-6 py-4 bg-amber-50 border-b border-amber-200">
        <h1 className="text-2xl font-bold text-center text-amber-800">
          {lesson?.title || `Lecture ${lessonOrder}`}
        </h1>
      </div>
            
      {/* Scrollable Content */}
      <main className="max-w-4xl mx-auto px-6 pt-5 pb-28">

        {lessonOrder === 1 && (
        <section className="mb-6 rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-stone-50 px-8 py-7 shadow-sm">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">{LESSON_ONE_INTRO.title}</div>
          <p className="mb-5 text-lg leading-relaxed text-stone-700">{LESSON_ONE_INTRO.lead}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {LESSON_ONE_INTRO.sections.map((section) => (
              <div key={section.title} className="rounded-lg border border-stone-200 bg-white/80 px-5 py-4">
                <h2 className="mb-2 text-base font-bold text-stone-900">{section.title}</h2>
                <p className="text-sm leading-relaxed text-stone-600">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Card */}
        <article className="bg-white rounded-lg shadow-lg border border-stone-200 pt-4 md:pt-6 px-8 md:px-12 pb-8 md:pb-12 mb-8">
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
              {currentSlideData?.content || lesson.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      {/* Voice Quiz Modal */}
      {showQuiz && (
        <VoiceQuiz
          lessonId={lessonOrder}
          lessonTitle={lesson.title}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-amber-700 bg-white shadow-[0_-6px_16px_rgba(0,0,0,0.12)]">
        <div className="max-w-4xl mx-auto px-3 py-3">
          <div className="grid grid-cols-3 items-center gap-2 text-sm">
            {navigation?.prev ? (
              <Link
                href={`/lessons/${navigation.prev.order}`}
                className="justify-self-start rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-700 hover:bg-stone-100"
              >
                ← Prev Lesson
              </Link>
            ) : (
              <span className="justify-self-start rounded-md border border-stone-200 px-3 py-2 text-stone-300">
                ← Prev Lesson
              </span>
            )}

            <button
              onClick={() => setShowQuiz(true)}
              className="justify-self-center rounded-md bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800"
            >
              Start Voice Test
            </button>

            {navigation?.next ? (
              <Link
                href={`/lessons/${navigation.next.order}`}
                className="justify-self-end rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-700 hover:bg-stone-100"
              >
                Next Lesson →
              </Link>
            ) : (
              <Link
                href="/lessons"
                className="justify-self-end rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-700 hover:bg-stone-100"
              >
                All Lessons →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
