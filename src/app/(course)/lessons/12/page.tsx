'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_12_SLIDES = [
  {
    id: 1,
    title: "Three Steps to Heaven",
    content: "We have traced the path of thought from its origins in distinction to its highest manifestations. Now we arrive at a crucial insight: the three-step process that takes us from the material world to the realm of pure spirit.\n\n**The three steps of transcendence:**\n1. Recognition of duality\n2. Unification of opposites\n3. Transcendence of the unified\n\nThis is the ladder that Jacob saw in his dream — not a mystical vision but a description of the structure of consciousness itself.\n\n> Each step builds upon the previous one, but the third step transcends and includes both of the previous ones.",
    emoji: "🪜",
    duration: 28000
  },
  {
    id: 2,
    title: "Step One: Recognition of Duality",
    content: "The first step is the recognition of duality — the fundamental distinction that creates the world.\n\nWithout duality, there is no experience, no movement, no thought. Everything becomes indistinguishable from everything else.\n\n**The necessity of duality:**\n- Subject and object\n- Self and other\n- Mind and matter\n- Thought and thinker\n\nThis is the realm of the **beast** — pure, undifferentiated desire and reaction. Each sense operates independently, pulling in its own direction.\n\nDuality is not an illusion to be dispelled but a necessary stage in the process of consciousness.\n\n> The first step is to fully acknowledge and understand duality, not to escape from it.",
    emoji: "⚖️",
    duration: 32000
  },
  {
    id: 3,
    title: "Step Two: Unification of Opposites",
    content: "The second step is the unification of opposites — bringing together the divided aspects of reality.\n\nThis is accomplished through **love** — not emotion but a structural principle that connects what was separated.\n\n**The principle of unification:**\n- Love as the force that unites subject and object\n- Understanding as the bridge between self and other\n- Empathy as the connection between mind and matter\n- Reflection as the synthesis of thought and thinker\n\nThis is the realm of the **human** — where the six senses are organized around the principle of love rather than pure instinct.\n\nHere, the senses are directed outward not toward mere reaction but toward understanding another 'I'.\n\n> The second step is to actively create unity while preserving the distinction that makes unity meaningful.",
    emoji: "❤️",
    duration: 30000
  },
  {
    id: 4,
    title: "Step Three: Transcendence of the Unified",
    content: "The third step is the transcendence of the unified — going beyond both duality and unity.\n\nThis is accomplished through **agape** — divine love that bypasses the mediation of the senses entirely.\n\n**The principle of transcendence:**\n- Direct connection between souls\n- Immediate knowledge without intermediaries\n- Pure spirit without material substrates\n- Consciousness aware of consciousness itself\n\nThis is the realm of the **divine** — where the six senses are transcended in favor of direct spiritual communion.\n\nHere, there is no longer a need for the mediation of the senses — souls communicate directly with souls.\n\n> The third step is to transcend both duality and unity in favor of a higher synthesis.",
    emoji: "✨",
    duration: 32000
  },
  {
    id: 5,
    title: "The Circular Nature of the Steps",
    content: "The three steps form a circle — the end returns to the beginning but at a higher level.\n\n**The circular structure:**\n- From simple unity (before distinction)\n- Through duality (recognition of difference)\n- Through unity (recognition of connection)\n- To complex unity (recognition of transcendence)\n\nThe person who completes the three steps returns to unity, but this is no longer the naive unity of the beginning — it is unity that fully encompasses and transcends all distinctions.\n\nThis is the meaning of the alchemical axiom: 'As above, so below' — the microcosm reflects the macrocosm, and the end reflects the beginning, but at a higher octave.\n\n> The circle is complete when the destination reveals itself to be the origin viewed from a higher perspective.",
    emoji: "⭕",
    duration: 28000
  },
  {
    id: 6,
    title: "Practical Application of the Three Steps",
    content: "How do we apply the three steps in our daily lives and thinking?\n\n**In personal relationships:**\n1. Recognize the real differences between self and other\n2. Seek to understand and connect despite these differences\n3. Transcend the need for either difference or connection\n\n**In intellectual work:**\n1. Distinguish clearly between concepts and positions\n2. Seek the connections and common ground\n3. Transcend both the distinctions and the connections\n\n**In spiritual practice:**\n1. Acknowledge the separation between self and divine\n2. Seek union and communion\n3. Realize the non-dual nature of the seeker and the sought\n\n> The three steps are not stages to pass through once but a pattern that repeats at every level of existence.",
    emoji: "🔄",
    duration: 34000
  }
]

const LESSON_CONTENT = LESSON_12_SLIDES.map(s => s.content).join('\n\n')

export default function Lesson12Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const totalSlides = LESSON_12_SLIDES.length

  // Простая функция воспроизведения слайда
  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = LESSON_12_SLIDES.length
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`)
    
    // Останавливаем предыдущее аудио
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    // Создаём новый Audio объект
    const audio = new Audio(`/audio/lesson12/slide${slideIndex + 1}.mp3`)
    audioRef.current = audio
    
    // Обновление прогресса
    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    
    // Когда аудио закончилось - переход к следующему слайду
    audio.onended = () => {
      console.log(`Slide ${slideIndex + 1} ended`)
      if (slideIndex < totalSlides - 1) {
        const nextSlide = slideIndex + 1
        setCurrentSlide(nextSlide)
        setProgress(0)
        // Рекурсивно запускаем следующий слайд
        playSlide(nextSlide)
      } else {
        // Конец урока
        setIsPlaying(false)
        setProgress(100)
      }
    }
    
    // Ошибка загрузки - пробуем slide1.mp3 или пропускаем
    audio.onerror = () => {
      console.log(`Error loading slide ${slideIndex + 1}, trying slide1.mp3`)
      // Пробуем fallback на slide1.mp3
      const fallbackAudio = new Audio(`/audio/lesson12/slide1.mp3`)
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
        // Нет аудио - используем таймер
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
    
    // Запускаем воспроизведение
    audio.play().catch((err) => {
      console.error('Audio play error:', err)
      if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
        // Safari блокирует автовоспроизведение
        setIsPlaying(false)
        alert('Please click Play button to start audio')
      }
    })
  }, [LESSON_12_SLIDES.length])

  const togglePlay = () => {
    if (isPlaying) {
      // Пауза
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      // Запуск - создаём и запускаем аудио синхронно в обработчике клика
      setIsPlaying(true)
      setProgress(0)
      
      // Останавливаем предыдущее аудио
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      // Создаём аудио синхронно в обработчике клика (важно для Safari)
      const audioPath = `/audio/lesson12/slide${currentSlide + 1}.mp3`
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
        // Переходим к следующему слайду
        if (currentSlide < totalSlides - 1) {
          const nextSlide = currentSlide + 1
          setCurrentSlide(nextSlide)
          setProgress(0)
          playSlide(nextSlide)
        } else {
          setIsPlaying(false)
        }
      }
      
      // Запускаем немедленно - это важно для Safari
      audio.play().catch((err) => {
        console.error('Play failed:', err)
        setIsPlaying(false)
        alert('Audio playback failed. Please try again.')
      })
    }
  }

  const goToSlide = (index: number) => {
    // Останавливаем текущее аудио
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    setCurrentSlide(index)
    setProgress(0)
    
    // Если играем - запускаем новый слайд
    if (isPlaying) {
      playSlide(index)
    }
  }

  const currentSlideData = LESSON_12_SLIDES[currentSlide]

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
          {LESSON_12_SLIDES[0]?.title || 'Three Steps to Heaven'}
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
          lessonId={12}
          lessonTitle="Three Steps to Heaven"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/11"
              className="hover:text-white transition"
            >
              ← Lecture XI
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XII</span>
            <Link 
              href="/lessons/13"
              className="hover:text-white transition"
            >
              Lecture XIII →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}