'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_13_SLIDES = [
  {
    id: 1,
    title: "The Algorithm of Algorithms",
    content: "We have explored various algorithms of thought throughout our journey — the algorithm of distinction, the algorithm of levels, the algorithm of recursion. But now we arrive at the deepest question: Is there an algorithm of algorithms?\n\n**Can we find a single principle that generates all other thinking algorithms?**\n\nThis is the quest for the meta-algorithm — the algorithm that creates algorithms. It is the search for the source code of thought itself.\n\n> The algorithm of algorithms must be capable of generating itself and all other algorithms. It must be both the program and the programmer.",
    emoji: "🧮",
    duration: 28000
  },
  {
    id: 2,
    title: "Self-Generating Systems",
    content: "An algorithm of algorithms must be self-generating — capable of creating variations of itself and other algorithms.\n\nSuch systems exist in mathematics and computer science:\n- **Lambda calculus** - a system that can express any computable function\n- **Universal Turing machines** - machines that can simulate any other machine\n- **Self-modifying code** - programs that alter their own instructions\n\nThe key insight: these systems achieve universality through self-reference and the capacity for self-transformation.\n\n**The algorithm of algorithms is a self-generating, self-applying operation.**",
    emoji: "🔄",
    duration: 32000
  },
  {
    id: 3,
    title: "The Minimal Operation",
    content: "What is the simplest operation that can generate all of thought?\n\nGeorge Spencer-Brown proposed that the act of distinction itself — the drawing of a boundary — is the fundamental operation from which all mathematics and logic can be constructed.\n\n**The minimal operation:**\n1. Make a distinction\n2. Observe the distinction\n3. See the observer\n4. Repeat\n\nThis four-step algorithm generates:\n- Binary logic (true/false, inside/outside)\n- Arithmetic (difference creates quantity)\n- Algebra (variables represent distinctions)\n- Higher mathematics (distinctions of distinctions)",
    emoji: "⚛️",
    duration: 30000
  },
  {
    id: 4,
    title: "Recursion and Self-Application",
    content: "The algorithm of algorithms must be recursive — it applies to itself.\n\nWhen we apply the distinction operation to itself, we get:\n- The distinction between distinctions\n- The observer of observing\n- The algorithm of algorithms of algorithms\n\nThis creates an infinite tower of meta-levels, but one that is grounded in the original operation.\n\n**Self-application is the engine of complexity** — from the simple act of distinction, we generate the full complexity of mathematical and logical systems.\n\nThe algorithm of algorithms is ultimately self-contained and self-generating.",
    emoji: "♾️",
    duration: 32000
  },
  {
    id: 5,
    title: "The Closure Property",
    content: "The algorithm of algorithms must be closed — it must operate within itself and return to itself.\n\n**Closure means:**\n- The algorithm can be applied to its own output\n- The system of operations is complete\n- Nothing external is required to sustain the process\n\nMathematical systems achieve closure through axioms and rules of inference.\nProgramming languages achieve closure through primitive operations and composition rules.\n\n**The algorithm of algorithms is a closed system of distinction** — it contains within itself all that is needed for the generation of all possible distinctions.",
    emoji: "⭕",
    duration: 28000
  },
  {
    id: 6,
    title: "Universality and Implementation",
    content: "The algorithm of algorithms is universal — it can implement any other algorithm, any other system of thought.\n\nBut universality without implementation is sterile. The algorithm of algorithms must be capable of embodiment:\n- In neural networks (how the brain implements thought)\n- In digital computers (artificial intelligence)\n- In social systems (collective intelligence)\n- In biological evolution (natural computation)\n\n**The power of the algorithm of algorithms lies not just in its universality but in its implementability across domains.**",
    emoji: "🌐",
    duration: 34000
  },
  {
    id: 7,
    title: "The Paradox of Self-Generation",
    content: "There is a deep paradox at the heart of the algorithm of algorithms: how can an algorithm create itself?\n\nThis is reminiscent of Russell's paradox, Gödel's incompleteness, and the halting problem.\n\nThe resolution comes through the temporal dimension — the algorithm doesn't exist all at once but emerges through process:\n- Stage 1: Simple distinction\n- Stage 2: Distinction of distinction\n- Stage 3: Self-referential distinction\n- Stage 4: Recursive self-generation\n\nThe algorithm of algorithms is the story of its own becoming.",
    emoji: "⏳",
    duration: 30000
  },
  {
    id: 8,
    title: "The Return to Simplicity",
    content: "After traversing the full complexity of self-generating algorithms, we return to simplicity.\n\nThe algorithm of algorithms is ultimately:\n**Make a distinction.**\n\nEverything else — recursion, self-reference, universality, closure — follows from this single operation applied to itself.\n\nThe power of the algorithm of algorithms lies in the recursive application of a simple operation.\n\n*The algorithm of algorithms teaches us that in the deepest foundation of thought, complexity and simplicity are one.*",
    emoji: "🎯",
    duration: 26000
  }
]

const LESSON_CONTENT = LESSON_13_SLIDES.map(s => s.content).join('\n\n')

export default function Lesson13Page() {
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

  const totalSlides = LESSON_13_SLIDES.length

  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = LESSON_13_SLIDES.length
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`)
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    const audio = new Audio(`/audio/lesson13/slide${slideIndex + 1}.mp3`)
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
      const fallbackAudio = new Audio(`/audio/lesson13/slide1.mp3`)
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
  }, [LESSON_13_SLIDES.length])

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
      
      const audioPath = `/audio/lesson13/slide${currentSlide + 1}.mp3`
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

  const currentSlideData = LESSON_13_SLIDES[currentSlide]

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
          {LESSON_13_SLIDES[0]?.title || 'The Algorithm of Algorithms'}
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
          lessonId={13}
          lessonTitle="The Algorithm of Algorithms"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/12"
              className="hover:text-white transition"
            >
              ← Lecture XII
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XIII</span>
            <Link 
              href="/lessons/14"
              className="hover:text-white transition"
            >
              Lecture XIV →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}