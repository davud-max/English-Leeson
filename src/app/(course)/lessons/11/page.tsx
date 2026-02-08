'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

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

const LESSON_CONTENT = LESSON_11_SLIDES.map(s => s.content).join('\n\n')

export default function Lesson11Page() {
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

  const totalSlides = LESSON_11_SLIDES.length

  // Простая функция воспроизведения слайда
  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = LESSON_11_SLIDES.length
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`)
    
    // Останавливаем предыдущее аудио
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    // Создаём новый Audio объект
    const audio = new Audio(`/audio/lesson11/slide${slideIndex + 1}.mp3`)
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
      const fallbackAudio = new Audio(`/audio/lesson11/slide1.mp3`)
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
  }, [LESSON_11_SLIDES.length])

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
      const audioPath = `/audio/lesson11/slide${currentSlide + 1}.mp3`
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

  const currentSlideData = LESSON_11_SLIDES[currentSlide]

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
            
            <div className="text-stone-500 text-sm whitespace-nowrap">
              {currentSlide + 1}/{totalSlides}
            </div>
          </div>
        </div>
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
          lessonId={11}
          lessonTitle="The Number 666"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/10"
              className="hover:text-white transition"
            >
              ← Lecture X
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XI</span>
            <Link 
              href="/lessons/12"
              className="hover:text-white transition"
            >
              Lecture XII →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}