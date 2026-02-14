'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_14_SLIDES = [
  {
    id: 1,
    title: "The Secret of the Circle",
    content: "In our journey through the thinking course, we have explored the fundamental principles that govern thought itself. We began with the concept of distinction and the circle, moved through the levels of thought, and examined the relationship between consciousness and the thinking process.\n\nNow we arrive at the secret of the circle — a profound revelation that ties together all the threads of our investigation. The circle, as we have seen, is not merely a geometric figure but a representation of the fundamental act of distinction that gives rise to all thought and reality.\n\n> **The circle encloses and excludes simultaneously** — it defines what is inside by virtue of what is outside, and vice versa. This is the essence of all categorical thinking.",
    emoji: "⭕",
    duration: 28000
  },
  {
    id: 2,
    title: "The Closed Loop",
    content: "The secret of the circle lies in understanding that it creates a closed loop of reference. When we draw a distinction, we create two sides: an inside and an outside. But these are not independent — they define each other.\n\n**Inside and outside are correlatives** — neither can exist without the other. The boundary is the point where this correlation becomes explicit.\n\nThis closed loop structure appears everywhere:\n- In logic: the law of excluded middle (A or not-A)\n- In consciousness: self-awareness requires distinguishing self from other\n- In language: meaning emerges through oppositions (signifiers and signified)\n- In mathematics: recursive functions and self-referential structures",
    emoji: "🔄",
    duration: 32000
  },
  {
    id: 3,
    title: "Self-Reference and Paradox",
    content: "The circle naturally leads to self-reference — the ability of a system to refer to itself. This is where paradoxes emerge, but also where creative breakthrough occurs.\n\nConsider Russell's paradox in set theory, or Gödel's incompleteness theorems — they arise from self-reference within formal systems. But far from being mere curiosities, these paradoxes reveal the limitations of formal systems and point to the creative power of transcendence.\n\n**The circle turns back on itself**, creating the possibility for:\n- Self-awareness in consciousness\n- Self-modification in systems\n- Self-transcendence in thinking\n\n> The secret of the circle is that it is not a static boundary but a dynamic process of self-creation.",
    emoji: "☯️",
    duration: 30000
  },
  {
    id: 4,
    title: "The Algorithm of Distinction",
    content: "What if we could distill the secret of the circle into an algorithm? An algorithm for thinking that captures the essential process of distinction?\n\n**The Algorithm of Distinction:**\n1. Make a distinction\n2. Observe the distinction\n3. See the observer\n4. Repeat\n\nThis simple algorithm generates the entire structure of consciousness and thought. Each iteration creates new levels of awareness and new possibilities for distinction.\n\nThe power of this algorithm lies not in its complexity but in its recursive simplicity — it generates infinite complexity from a single operation applied repeatedly.",
    emoji: "🧮",
    duration: 32000
  },
  {
    id: 5,
    title: "Levels and Transcendence",
    content: "The circle creates levels — inside, outside, and boundary. But more than that, it enables transcendence of levels.\n\n**Transcendence is collapse** — when we reach a meta-level of observation, we often find that distinctions we made at lower levels dissolve or reorganize.\n\nLevels in thinking:\n- **Level 1**: Making distinctions\n- **Level 2**: Observing distinctions\n- **Level 3**: Seeing the process of distinction itself\n- **Level 4**: Recognizing the circular nature of distinction\n- **Level 5**: Transcending the need for fixed distinctions\n\nAt the highest level, the circle opens into a spiral of continuous creation.",
    emoji: "🌀",
    duration: 28000
  },
  {
    id: 6,
    title: "The Return to Unity",
    content: "The secret of the circle ultimately reveals itself as the path back to unity — not the primitive unity before distinction, but the achieved unity that preserves and transcends all distinctions.\n\n**The circle is a path home** — it takes us from undifferentiated unity through the full differentiation of all possible distinctions and back to a higher unity that embraces and transcends all differences.\n\nThis is the secret: the circle is not about separation but about the dynamic process of creative return. It is the shape of thought itself — always moving, always distinguishing, always returning to itself in ever-deepening circles of awareness.\n\n*The secret of the circle is that there is no final secret — only the eternal circulation of thought returning to itself enriched by its journey.*",
    emoji: "🎯",
    duration: 34000
  }
]

const LESSON_CONTENT = LESSON_14_SLIDES.map(s => s.content).join('\n\n')

export default function Lesson14Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const totalSlides = LESSON_14_SLIDES.length

  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = LESSON_14_SLIDES.length
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`)
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    const audio = new Audio(`/audio/lesson14/slide${slideIndex + 1}.mp3`)
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
      const fallbackAudio = new Audio(`/audio/lesson14/slide1.mp3`)
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
  }, [LESSON_14_SLIDES.length])

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      setProgress(0)
      
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      const audioPath = `/audio/lesson14/slide${currentSlide + 1}.mp3`
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

  const currentSlideData = LESSON_14_SLIDES[currentSlide]

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
                {isPlaying ? ' onPause' : '▶ Play'}
              </button>
                    
              <button
                onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="px-4 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition text-sm"
              >
                Next →
              </button>
            </div>
                  
            <div className="text-stone-500 text-sm whitespace-nowrap">
              {currentSlide + 1}/{totalSlides}
            </div>
          </div>
        </div>
      </div>
            
      {/* Static Lesson Title */}
      <div className="max-w-4xl mx-auto px-6 py-4 bg-amber-50 border-b border-amber-200">
        <h1 className="text-2xl font-bold text-center text-amber-800">
          {LESSON_14_SLIDES[0]?.title || 'The Secret of the Circle'}
        </h1>
      </div>
            
      {/* Scrollable Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
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
                table: ({children}) => <table className="w-full my-6 border-collapse">{children}</table>,
                th: ({children}) => <th className="border border-stone-300 bg-stone-100 px-4 py-2 text-left font-semibold">{children}</th>,
                td: ({children}) => <td className="border border-stone-300 px-4 py-2">{children}</td>,
              }}
            >
              {currentSlideData?.content || LESSON_CONTENT}
            </ReactMarkdown>
          </div>
        </article>

        {/* Voice Quiz Button */}
        <div className="text-center mb-10">
          <button
            onClick={() => setShowQuiz(true)}
            className="px-6 py-2 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition shadow"
          >
            Start Voice Test
          </button>
        </div>
      </main>

      {/* Voice Quiz Modal */}
      {showQuiz && (
        <VoiceQuiz
          lessonId={14}
          lessonTitle="The Secret of the Circle"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/13"
              className="hover:text-white transition"
            >
              ← Lecture XIII
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XIV</span>
            <Link 
              href="/lessons/15"
              className="hover:text-white transition"
            >
              Lecture XV →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}