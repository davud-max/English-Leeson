'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_12_SLIDES = [
  {
    id: 1,
    title: "Here Is Wisdom",
    content: "**\"Here is wisdom. Let him who has understanding count the number of the beast, for it is the number of a man; his number is six hundred sixty-six.\"**\n\nSo it is written in the Revelation of John the Theologian.\n\nAugustine said: *\"A sense is that by which the soul is informed of what the body experiences.\"*\n\nHow many physical senses are there? We know five. They say there is a sixth, but it is said to be something metaphysical. All information from the external world comes to us through the sense organs. For each kind of external influence there is its own organ.",
    emoji: "📖",
    duration: 32000
  },
  {
    id: 2,
    title: "Six Senses — The Number of the Beast",
    content: "The ear hears sounds. The eyes react to light, see. The nose reacts to smells. The mouth feels taste. The skin feels touch.\n\n**Five basic physical senses. But is it five?**\n\nWhat if there were six? Six, like the sixes in the Apocalypse. Yes — it is the **sexual sense** and the sexual organs. It is entirely physical and has its own organ. And this is a sense that cannot be obtained through other sense organs or replaced by other senses.\n\nThe flourishing of the world of the beast is the final formation of **six physical senses** operating on the basis of instincts and reflexes. This first six — the first sign in the number 666 — is **the number of the beast**.\n\n> In the first six, each unit is isolated. Each sense works independently. Each sense is directed inward and shows only what the beast's own body experiences. And the beast has no concern for what another body experiences.",
    emoji: "🐾",
    duration: 38000
  },
  {
    id: 3,
    title: "The Second Six — The Human Number",
    content: "Man, having received the ability to abstract, looked at the first six senses **from the outside**. He began gradually to abstract from them. Thereby he gained the ability not to submit to them, but to **rule over them**. To rule under the sign of love.\n\n**Ordinary, physical love** is the unification of all six senses under a single human sign for the understanding by one person of the feelings of another person.\n\n> Paraphrasing Augustine: ordinary, physical love is that by which the soul is informed of what **another body** experiences.\n\nThis awareness is as yet the only path to knowing another soul. The unified second six was at first weaker than the number of the beast. But over time, the human began to overcome the bestial.\n\n**The second six in the number 666 is the human number.**\n\nLet us explain with an example: six real apples are a group of isolated units. But at the second level, the group is presented as something unified, indivisible. And it is designated not by a set of units, but by an abstract symbol — the **digit 6**.",
    emoji: "❤️",
    duration: 40000
  },
  {
    id: 4,
    title: "The Third Six — The Divine Number",
    content: "Jesus, in turn, brought a new Love. **Love with a capital letter.** Love in which the bestial, the physical, is finally overcome through complete abstraction from the sensory.\n\nThe third six in the number 666 is the **transcendence of both the sign of the beast and the sign of man**. The third six is love of God and **the divine number**.\n\n> Paraphrasing Augustine again: supreme love is that by which the soul is informed of what **another soul** experiences.\n\nAnd love of the Lord, or divine love, is the direct communion of the individual soul with the universal soul. **This is the limit of man.**\n\nThis is like a sacred mathematical trinity: **quantity — digit — number**. The third step — number — completely transcends both the apples themselves and the sign of the quantity of apples. This is complete abstraction. It is impossible to represent a number. Any attempt to represent a number leads to the appearance of either its sign — a digit — or a concrete quantity of what is being counted.",
    emoji: "✨",
    duration: 42000
  },
  {
    id: 5,
    title: "The Error of Literal Understanding",
    content: "By most people, the call of Jesus was understood **literally**. Christians call for departure from the sensory through **rejection** of it. They declared everything sensory, bodily, to be sin, and succeeded so well in this that the sexual sense is not even perceived as one of the human senses. Moreover, it is associated with sin. Therefore, people speak only of **five senses**.\n\n**True love**, of which Jesus spoke, is complete abstraction from physical love, from the six senses — **not rejection of them**.\n\n> This is like the smile of the Cheshire Cat without the cat. But destroy the cat — and you destroy the smile. Destroy the physical senses — and you destroy divine love.",
    emoji: "⚠️",
    duration: 32000
  },
  {
    id: 6,
    title: "The Limit of Man",
    content: "No matter how high a level of abstraction man may reach, no matter how exalted a love he may attain, no matter how deeply he may penetrate into understanding the soul of another person — **a physical boundary between souls still remains**.\n\nThe number of the beast will never be completely overcome, for it is also the human number. Therefore, **man will exist only as long as human souls are separated by the physical**.\n\n> Loving one's neighbor, through communion with his living soul, man learns, as it were, to commune with the universal soul — with God.\n\nWhen the final transition is accomplished and the human number is overcome, the last six — **the number of God** — will be attained. And the third step to heaven will be overcome. And all souls will merge into one and unite with God.\n\n**And the end of Light will come, for God has no need of light. And man will disappear.**\n\n*Thank you for your attention.*",
    emoji: "🌟",
    duration: 40000
  }
]

export default function Lesson12Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = LESSON_12_SLIDES.length

  useEffect(() => {
    if (!isPlaying) return

    const audioFile = `/audio/lesson12/slide${currentSlide + 1}.mp3`
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback")
        setAudioError(true)
        const duration = LESSON_12_SLIDES[currentSlide].duration
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
    
    const duration = LESSON_12_SLIDES[currentSlide].duration
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

  const currentSlideData = LESSON_12_SLIDES[currentSlide]

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
              <p className="text-stone-400 text-sm">Lecture XII</p>
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
            {LESSON_12_SLIDES.map((slide, index) => (
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
              href="/lessons/11"
              className="hover:text-white transition"
            >
              ← Lecture XI: The Number 666
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XII</span>
            <Link 
              href="/lessons/13"
              className="hover:text-white transition"
            >
              Lecture XIII: The Sixth Human Level →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
