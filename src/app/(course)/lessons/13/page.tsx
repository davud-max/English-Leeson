'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_13_SLIDES = [
  {
    id: 1,
    title: "In the Beginning Was the Word",
    content: "The first chapter of the **Gospel of John** almost word for word repeats the first chapter of the Old Testament — if we view them from the standpoint of the Theory of Abstraction.\n\nIn society, the law brought by **Moses** was at work. All walk under one God — that is, under one law — and this makes people **equal before the law**.\n\n> The system of protection of rights, freedoms, and property takes on a universal character for all members of one's own people. This gives impetus to economic development. **A market is formed.**",
    emoji: "📜",
    duration: 30000
  },
  {
    id: 2,
    title: "From Letter to Spirit",
    content: "The commandments were sent through Moses in the form of tablets — that is, the **letter of the law** appeared, uniform for all.\n\nThe New Testament speaks of the **spirit of the law**. If the old law was sent through Moses, then this new thing must be brought by a new prophet.\n\n> The Apostle Paul says: *\"He has made us competent as ministers of a new covenant — not of the letter but of the Spirit; for the letter kills, but the Spirit gives life.\"*\n\nThis is the transition from **external regulation** to **internal understanding**.",
    emoji: "✨",
    duration: 28000
  },
  {
    id: 3,
    title: "Two Baptisms",
    content: "If attaining the level of Moses was marked by **baptism with holy water**, then the new level — the level of Jesus — is marked by **baptism with the Holy Spirit**.\n\nJohn the Baptist says of this:\n\n> *\"The one on whom you see the Spirit descend and remain is the one who will baptize with the Holy Spirit.\"*\n\nAt the previous level, anyone who believed in the one Heavenly God and fulfilled the commandments — *thou shalt not kill, thou shalt not steal* — was recognized as human.\n\n**In essence, the foundations of market relations and trade were being introduced into life.**",
    emoji: "💧",
    duration: 30000
  },
  {
    id: 4,
    title: "Born of Water and Spirit",
    content: "What new level of humanity does the new prophet proclaim?\n\nJesus answered:\n\n> *\"Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit. Flesh gives birth to flesh, but the Spirit gives birth to spirit.\"*\n\nHere is a direct link to the first chapter of the Old Testament. Man must **emerge from the water** over which the Spirit of God hovered.\n\nFirst, man distinguishes **physical man**; then, **spiritual man**. The New Testament speaks precisely of this.",
    emoji: "🌊",
    duration: 28000
  },
  {
    id: 5,
    title: "The Eucharist",
    content: "Jesus said:\n\n> *\"Unless you eat the flesh of the Son of Man and drink his blood, you have no life in you.\"*\n\nMany of His disciples, hearing this, said: *\"This is a hard teaching. Who can accept it?\"*\n\nMost likely, the **Eucharist** is devoted precisely to this — the consecration of bread and wine and their subsequent consumption.\n\n**Bread** — the body of Christ — is primordial **earth**.\n**Blood of Christ** — primordial **heaven**.\nBoth together are primordial **water**, over which the Spirit of God hovered.\n\n> The division of water into heaven and earth occurred **in man, in his consciousness**.",
    emoji: "🍞",
    duration: 32000
  },
  {
    id: 6,
    title: "Grace and Truth",
    content: "John proclaims the new human level that Jesus brought. This is the level of **grace and truth**.\n\n**Grace** is a blessing freely given by God to every person. Through it, the path to truth opens — the path to God.\n\n> And this blessing is **the ability to abstract**. This ability was given to man from the beginning. But only now, with its help, is man able to comprehend truth.\n\n*\"No one has ever seen God.\"* But He is comprehended through understanding the **Trinity** — the sacred threefold unity.",
    emoji: "🕊️",
    duration: 28000
  },
  {
    id: 7,
    title: "Two Levels of Humanity",
    content: "**The Level of Moses:**\n- God is One, one for all people, and He is **outside**, above all people\n- He is an external force that gave people the law\n- Law is a formal prohibition on violence against man\n- Here death is punishment; it frightens man\n- Coercion is needed to observe the commandments\n- **Being a man of the Old Testament is difficult**\n\n**The Level of Jesus:**\n- God is one **in each person**\n- He is an internal force giving man a soul\n- One who comprehends this no longer needs external law\n- He **cannot** violate the commandments\n- Death is the return of the soul to the Father; there is no longer fear\n- **Being a man of the New Testament is easy**, for its foundation is love",
    emoji: "⚖️",
    duration: 36000
  },
  {
    id: 8,
    title: "The Sixth Human Level",
    content: "The New Testament brings not only the message of the salvation of the soul. It allows **expansion of the human circle**.\n\nThe Apostle Paul says:\n\n> *\"There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus.\"*\n\nThis is the **sixth human level**, where not only a member of one's own people — united by blood, marked by circumcision, acknowledging the commandments — is human, but **a representative of any people** who opens God within himself and loves God **is human**.\n\nIn everyone there is the Spirit of truth. To awaken it, one must believe and accept. **Logic and reason cannot accept this.** One must make a **leap of faith** — a leap across infinity.\n\n*Thank you for your attention.*",
    emoji: "🌍",
    duration: 36000
  }
]

export default function Lesson13Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = LESSON_13_SLIDES.length

  useEffect(() => {
    if (!isPlaying) return

    const audioFile = `/audio/lesson13/slide${currentSlide + 1}.mp3`
    if (audioRef.current) {
      audioRef.current.src = audioFile
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback")
        setAudioError(true)
        const duration = LESSON_13_SLIDES[currentSlide].duration
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
    
    const duration = LESSON_13_SLIDES[currentSlide].duration
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

  const currentSlideData = LESSON_13_SLIDES[currentSlide]

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
              <p className="text-stone-400 text-sm">Lecture XIII</p>
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
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {LESSON_13_SLIDES.map((slide, index) => (
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
              href="/lessons/12"
              className="hover:text-white transition"
            >
              ← Lecture XII: Three Steps to Heaven
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XIII</span>
            <Link 
              href="/lessons/14"
              className="hover:text-white transition"
            >
              Lecture XIV: How Consciousness Creates →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
