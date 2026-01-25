'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_11_SLIDES = [
  {
    id: 1,
    title: "The Final Riddle",
    content: "We have traveled a path from the circle to the Sacred Description. We have seen how the act of distinction creates the world.\n\nNow before us lies the final riddle — **the number of the Beast, 666**.\n\n> *\"Here is wisdom. Let him who has understanding count the number of the beast, for it is the number of a man...\"*\n\nThe key word is **\"count.\"** Not \"learn,\" not \"memorize.\" **\"Count\"** — calculate, derive, understand the algorithm.",
    emoji: "🔢",
    duration: 28000
  },
  {
    id: 2,
    title: "The First Six: The Beast",
    content: "**Six** is the number of the fullness of physical perception.\n\nFive senses: sight, hearing, smell, taste, touch. Plus a sixth — the sense of bodily attraction, of instinct.\n\n**The first six** is a world ruled by six isolated senses. Each pulls in its own direction. This is the world of pure reaction, **the kingdom of the Beast**.\n\nIn this world there is no \"other.\" There is only \"I\" and what my senses register as food, threat, or mate.\n\n> Each sense operates independently. Each is directed inward, showing only what the beast's own body experiences.",
    emoji: "🐾",
    duration: 32000
  },
  {
    id: 3,
    title: "The Second Six: The Human",
    content: "Then **Light** appears — the ability to abstract.\n\nMan looks at his six senses **from the outside**. He begins to unite them. With what? With **Love**.\n\n**Love is a new principle of organizing the six senses.** Now they are directed outward — toward understanding another \"I.\"\n\n> **The second six** is the **Human number**. Six senses unite in the phenomenon of human love.\n\nParaphrasing Augustine: ordinary, physical love is that by which the soul is informed of what **another body** experiences.",
    emoji: "❤️",
    duration: 30000
  },
  {
    id: 4,
    title: "The Third Six: The Divine",
    content: "But even this is not the limit. What if one rises even higher?\n\nJesus speaks of **Divine Love — Agape**. This is the principle of connecting souls directly, **bypassing the mediation of the senses**.\n\n**The third six** is the **Divine number**. The transition to the level of pure spirit.\n\n| Level | Number | Principle |\n|-------|--------|----------|\n| Six One | Beast | Senses |\n| Six Two | Human | Love |\n| Six Three | God | Agape |\n\n> Divine love is that by which the soul is informed of what **another soul** experiences.",
    emoji: "✨",
    duration: 32000
  },
  {
    id: 5,
    title: "The Formula of 666",
    content: "Now we can **count**.\n\n**Six hundred sixty-six is not one number.** It is a formula: six-one, six-two, six-three.\n\nA **three-step path of ascent**.\n\n> \"The number of a man\" — an indication of the second step. But wisdom lies in seeing **the entire staircase** as a whole.\n\nThis is like the sacred mathematical trinity:\n- **Quantity** — concrete apples\n- **Digit** — the symbol \"6\"\n- **Number** — pure abstraction\n\nEach level transcends and includes the previous one.",
    emoji: "📐",
    duration: 28000
  },
  {
    id: 6,
    title: "The End of Light",
    content: "And then the final words become clear.\n\n**\"The End of Light\"**: Light was needed to travel the path from six-one to six-three. When the goal is reached, the need for distinction falls away. The \"end of Light\" arrives — **not a catastrophe, but the completion of its mission**.\n\n**\"And Man shall disappear\"** — he will overcome himself and become what the Apostle Paul called a **\"spiritual body.\"**\n\n> As long as human souls are separated by the physical, man will exist. When the third six is fully achieved, all souls will merge and unite with God.\n\n*Thank you for your attention.*",
    emoji: "🌟",
    duration: 34000
  }
]

export default function Lesson11Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = LESSON_11_SLIDES.length

  useEffect(() => {
    if (!isPlaying) return

    const audioFile = `/audio/lesson11/slide${currentSlide + 1}.mp3`
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback")
        setAudioError(true)
        const duration = LESSON_11_SLIDES[currentSlide].duration
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
  }, [currentSlide, isPlaying, totalSlides])

  useEffect(() => {
    if (!isPlaying || !audioError) return
    
    const duration = LESSON_11_SLIDES[currentSlide].duration
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + (100 / (duration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, audioError, currentSlide])

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
    if (isPlaying) {
      setAudioError(false)
    }
  }

  const currentSlideData = LESSON_11_SLIDES[currentSlide]

  return (
    <div className="min-h-screen bg-stone-50">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        onError={() => setAudioError(true)}
      />
      
      {/* Academic Header */}
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
              ← Back to Course
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture XI</p>
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
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">
            {currentSlideData.title}
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
                table: ({children}) => <table className="w-full my-6 border-collapse">{children}</table>,
                th: ({children}) => <th className="border border-stone-300 bg-stone-100 px-4 py-2 text-left font-semibold">{children}</th>,
                td: ({children}) => <td className="border border-stone-300 px-4 py-2">{children}</td>,
              }}
            >
              {currentSlideData.content}
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
        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {LESSON_11_SLIDES.map((slide, index) => (
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
      </main>

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/10"
              className="hover:text-white transition"
            >
              ← Lecture X: How Thought Finds Us
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XI</span>
            <Link 
              href="/lessons/12"
              className="hover:text-white transition"
            >
              Lecture XII: Three Steps to Heaven →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
