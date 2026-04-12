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
  audioText?: string
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


const LESSON_ONE_INTRO_MARKDOWN = `## Course Introduction

This first lesson introduces not only one topic, but the logic of the whole course. We begin with terms and definitions because clear thinking begins when we learn to distinguish carefully, describe accurately, and use words with precision.

### What you will study

The course moves from terms and definitions to counting, numerals, formulas, parameters, abstraction, rules, human action, economics, money, the mechanism of thought, consciousness, and the search for truth.

### How the course is built

Philosophy, mathematics, logic, pedagogy, economics, and metaphysics are treated here not as separate subjects, but as parts of one path of understanding.

### What this course helps develop

It helps develop precise speech, disciplined thought, a deeper understanding of quantity and formula, and a clearer sense of how ideas, action, meaning, and consciousness are connected.`

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
  const ttsCacheRef = useRef<Map<number, string>>(new Map())
  const ttsInFlightRef = useRef<Map<number, Promise<string | null>>>(new Map())
  const currentSlideRef = useRef(0)
  const totalSlidesRef = useRef(0)
  const swipeRef = useRef<{
    startX: number
    startY: number
    lastX: number
    lastY: number
    pointerId: number | null
    active: boolean
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    pointerId: null,
    active: false,
  })

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
  useEffect(() => {
    currentSlideRef.current = currentSlide
  }, [currentSlide])
  useEffect(() => {
    totalSlidesRef.current = totalSlides
  }, [totalSlides])

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

  const stripMarkdown = useCallback((input: string): string => {
    return (input || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
      .replace(/\[[^\]]*]\([^)]+\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/[*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }, [])

  const getTtsTextForSlide = useCallback((slideIndex: number): string => {
    const slide = slides[slideIndex]
    const candidate = slide?.audioText || slide?.content || ''
    // Keep it within the /api/tts limit (3000 chars), with some safety margin.
    return stripMarkdown(candidate).slice(0, 2800)
  }, [slides, stripMarkdown])

  const getOrGenerateTtsAudioUrl = useCallback(async (slideIndex: number): Promise<string | null> => {
    const cached = ttsCacheRef.current.get(slideIndex)
    if (cached) return cached

    const existingInFlight = ttsInFlightRef.current.get(slideIndex)
    if (existingInFlight) return existingInFlight

    const p = (async () => {
      const text = getTtsTextForSlide(slideIndex)
      if (!text || text.length < 2) return null

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json().catch(() => ({}))
      const audioUrl = typeof data?.audioUrl === 'string' ? data.audioUrl : null
      if (!res.ok || !audioUrl) return null

      ttsCacheRef.current.set(slideIndex, audioUrl)
      return audioUrl
    })().finally(() => {
      ttsInFlightRef.current.delete(slideIndex)
    })

    ttsInFlightRef.current.set(slideIndex, p)
    return p
  }, [getTtsTextForSlide])

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
      console.log('No static audio candidate, trying TTS fallback')
      getOrGenerateTtsAudioUrl(slideIndex).then((ttsAudioUrl) => {
        if (!ttsAudioUrl) {
          console.log('TTS unavailable, using timer')
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

        const ttsAudio = new Audio(ttsAudioUrl)
        audioRef.current = ttsAudio

        ttsAudio.ontimeupdate = () => {
          if (ttsAudio.duration) {
            setProgress((ttsAudio.currentTime / ttsAudio.duration) * 100)
          }
        }

        ttsAudio.onended = () => {
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

        ttsAudio.onerror = () => {
          console.log('TTS audio failed, using timer')
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

        ttsAudio.play().then(() => {
          if (isBgMusicEnabledRef.current) {
            startBackgroundMusic()
          }
        }).catch((err) => {
          console.error('TTS play error:', err)
          stopBackgroundMusic()
          setIsPlaying(false)
        })
      })
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

      console.log('Static audio failed, trying TTS fallback')
      getOrGenerateTtsAudioUrl(slideIndex).then((ttsAudioUrl) => {
        if (!ttsAudioUrl) {
          console.log('TTS unavailable, using timer')
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

        const ttsAudio = new Audio(ttsAudioUrl)
        audioRef.current = ttsAudio

        ttsAudio.ontimeupdate = () => {
          if (ttsAudio.duration) {
            setProgress((ttsAudio.currentTime / ttsAudio.duration) * 100)
          }
        }

        ttsAudio.onended = () => {
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

        ttsAudio.onerror = () => {
          console.log('TTS audio failed, using timer')
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

        ttsAudio.play().then(() => {
          if (isBgMusicEnabledRef.current) {
            startBackgroundMusic()
          }
        }).catch((err) => {
          console.error('TTS play error:', err)
          stopBackgroundMusic()
          setIsPlaying(false)
        })
      })
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
  }, [getAudioCandidates, getOrGenerateTtsAudioUrl, slides.length, startBackgroundMusic, stopBackgroundMusic])

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

  const goToSlide = useCallback((index: number) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    setCurrentSlide(index)
    setProgress(0)
    
    if (isPlaying) {
      playSlide(index)
    }
  }, [isPlaying, playSlide])

  const isInteractiveTarget = useCallback((target: EventTarget | null) => {
    if (!target) return false
    const el = target as HTMLElement
    return Boolean(el?.closest?.('a,button,input,textarea,select,label'))
  }, [])

  const handleSwipeDelta = useCallback((dx: number, dy: number) => {
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    const SWIPE_THRESHOLD_PX = 60
    const MAX_VERTICAL_PX = 120

    if (absX < SWIPE_THRESHOLD_PX) return
    if (absY > MAX_VERTICAL_PX) return
    if (absX < absY * 1.2) return

    const current = currentSlideRef.current
    const total = totalSlidesRef.current
    if (total <= 1) return

    // dx < 0 means swipe left => next slide; dx > 0 means swipe right => previous slide
    const nextIndex = dx < 0 ? Math.min(total - 1, current + 1) : Math.max(0, current - 1)
    if (nextIndex === current) return
    goToSlide(nextIndex)
  }, [goToSlide])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (isInteractiveTarget(e.target)) return
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    swipeRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      lastX: t.clientX,
      lastY: t.clientY,
      pointerId: null,
      active: true,
    }
  }, [isInteractiveTarget])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeRef.current.active) return
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    swipeRef.current.lastX = t.clientX
    swipeRef.current.lastY = t.clientY
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!swipeRef.current.active) return
    const dx = swipeRef.current.lastX - swipeRef.current.startX
    const dy = swipeRef.current.lastY - swipeRef.current.startY
    swipeRef.current.active = false
    handleSwipeDelta(dx, dy)
  }, [handleSwipeDelta])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isInteractiveTarget(e.target)) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    swipeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      pointerId: e.pointerId,
      active: true,
    }
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [isInteractiveTarget])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!swipeRef.current.active) return
    if (swipeRef.current.pointerId !== e.pointerId) return
    swipeRef.current.lastX = e.clientX
    swipeRef.current.lastY = e.clientY
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!swipeRef.current.active) return
    if (swipeRef.current.pointerId !== e.pointerId) return
    const dx = swipeRef.current.lastX - swipeRef.current.startX
    const dy = swipeRef.current.lastY - swipeRef.current.startY
    swipeRef.current.active = false
    swipeRef.current.pointerId = null
    handleSwipeDelta(dx, dy)
  }, [handleSwipeDelta])

  const onPointerCancel = useCallback(() => {
    swipeRef.current.active = false
    swipeRef.current.pointerId = null
  }, [])

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
      <main
        className="max-w-4xl mx-auto px-6 pt-5 pb-28"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >

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
              {lessonOrder === 1 && currentSlide === 0
                ? `${LESSON_ONE_INTRO_MARKDOWN}

---

${currentSlideData?.content || lesson.content}`
                : (currentSlideData?.content || lesson.content)}
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
