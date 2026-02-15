'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

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

export default function DynamicLessonPage() {
  const params = useParams()
  const lessonOrder = parseInt(params.order as string)
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [navigation, setNavigation] = useState<Navigation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isNaN(lessonOrder)) {
      setError('Invalid lesson number')
      setLoading(false)
      return
    }
    
    setCurrentSlide(0)
    setIsPlaying(false)
    fetchLesson()
  }, [lessonOrder])

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonOrder}`)
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

  const slides: Slide[] = lesson?.slides || (lesson?.content ? [{
    id: 1,
    title: lesson.title,
    content: lesson.content,
    emoji: lesson.emoji || '📖',
    duration: 30000,
  }] : [])

  const totalSlides = slides.length

  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = slides.length
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`)
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    const audio = new Audio(`/audio/lesson${lessonOrder}/slide${slideIndex + 1}.mp3`)
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
        setProgress(100)
      }
    }
    
    audio.onerror = () => {
      console.log(`Error loading slide ${slideIndex + 1}, trying slide1.mp3`)
      const fallbackAudio = new Audio(`/audio/lesson${lessonOrder}/slide1.mp3`)
      audioRef.current = fallbackAudio
      
      fallbackAudio.ontimeupdate = () => {
        if (fallbackAudio.duration) {
          setProgress((fallbackAudio.currentTime / fallbackAudio.duration) * 100)
        }
      }
      
      fallbackAudio.onended = () => {
        if (slideIndex < totalSlides - 1) {
          const nextSlide = slideIndex + 1
          setCurrentSlide(nextSlide)
          setProgress(0)
          playSlide(nextSlide)
        } else {
          setIsPlaying(false)
          setProgress(100)
        }
      }
      
      fallbackAudio.onerror = () => {
        console.log('No audio available, using timer')
        setTimeout(() => {
          if (slideIndex < totalSlides - 1) {
            const nextSlide = slideIndex + 1
            setCurrentSlide(nextSlide)
            setProgress(0)
            playSlide(nextSlide)
          } else {
            setIsPlaying(false)
            setProgress(100)
          }
        }, 20000)
      }
      
      fallbackAudio.play().catch(console.error)
    }
    
    audio.play().catch((err) => {
      console.error('Audio play error:', err)
      if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
        setIsPlaying(false)
        alert('Please click Play button to start audio')
      }
    })
  }, [lessonOrder, slides.length])

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.error('Play failed:', err)
          setIsPlaying(false)
          alert('Audio playback failed. Please try again.')
        })
      } else {
        setProgress(0)
        
        const audioPath = `/audio/lesson${lessonOrder}/slide${currentSlide + 1}.mp3`
        console.log('Loading audio:', audioPath)
        const audio = new Audio(audioPath)
        audioRef.current = audio
        
        audio.ontimeupdate = () => {
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100)
          }
        }
        
        audio.onended = () => {
          if (currentSlide < totalSlides - 1) {
            const nextSlide = currentSlide + 1
            setCurrentSlide(nextSlide)
            setProgress(0)
            playSlide(nextSlide)
          } else {
            setIsPlaying(false)
            setProgress(100)
          }
        }
        
        audio.onerror = () => {
          console.error(`Error loading slide ${currentSlide + 1}`)
          if (currentSlide < totalSlides - 1) {
            const nextSlide = currentSlide + 1
            setCurrentSlide(nextSlide)
            setProgress(0)
            playSlide(nextSlide)
          } else {
            setIsPlaying(false)
          }
        }
        
        audio.play().catch((err) => {
          console.error('Play failed:', err)
          setIsPlaying(false)
          alert('Audio playback failed. Please try again.')
        })
      }
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
        </div>
      </div>
            
      {/* Static Lesson Title */}
      <div className="max-w-4xl mx-auto px-6 py-4 bg-amber-50 border-b border-amber-200">
        <h1 className="text-2xl font-bold text-center text-amber-800">
          {lesson?.title || `Lecture ${lessonOrder}`}
        </h1>
      </div>
            
      {/* Scrollable Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 pb-28">

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
