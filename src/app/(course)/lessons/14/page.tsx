'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_14_SLIDES = [
  {
    id: 1,
    title: "The Paradox of Description",
    content: "We began with something simple: **\"Describe what you see.\"**\n\nBut we encountered a fundamental paradox:\n\nTo describe something, you need **words**. But words are **terms**. And terms require **definitions**. Which brings us back to needing to describe...\n\n> **A closed circle.** Only one thing can break this cycle — the **act of primary distinction**.\n\nThis is where cognition truly begins — not with ready-made concepts, but with the ability to draw a boundary between \"this\" and \"not this.\"",
    emoji: "🌀",
    duration: 28000
  },
  {
    id: 2,
    title: "Absolute Darkness",
    content: "**Imagine absolute darkness** — not physical darkness, but meaningful darkness.\n\nIn this state, there is:\n\n• No \"here\" or \"there\"\n• No \"self\" or \"other\"\n• No distinctions whatsoever\n\nThis is what ancient texts call **\"water\"** — homogeneous, indistinguishable Being.\n\n> What can emerge from this unity? Only one thing — the **appearance of boundaries**.\n\nBut for boundaries to appear, **light is needed**. And light is not photons — it's the ability to draw a line and say: **\"this is not that.\"**",
    emoji: "💧",
    duration: 30000
  },
  {
    id: 3,
    title: "The Act of Naming",
    content: "**Biblical formulation:** *\"And God said: let there be light. And there was light.\"*\n\n**Key insight:** God didn't \"create\" light in the usual sense. **He named it.**\n\nWhat does this mean in our terms?\n\n• Observable separates from unobservable\n• \"Earth\" (World) separates from \"Heaven\" (Nothing)\n• **Firmament appears** — the first boundary\n\n> **Light = The first operation of distinction**\n\nBefore naming, there was no difference. The act of naming **creates** the difference.",
    emoji: "✨",
    duration: 28000
  },
  {
    id: 4,
    title: "Circle Lesson Revisited",
    content: "Let's recall our first lecture about the circle:\n\n**Object:** Chalk mark on board = \"water\" (indistinguishable Being)\n\n**Observer:** Child watching = Spirit \"moving over water\"\n\n**Description:** Drawing boundaries (curved, closed, equidistant) = Light\n\n> These three elements are **inseparable**. Remove any one — and the circle doesn't exist.\n\nThe circle is not \"out there\" waiting to be discovered. It **emerges** in the act of distinction performed by a conscious observer.",
    emoji: "⭕",
    duration: 26000
  },
  {
    id: 5,
    title: "The Trinity of Cognition",
    content: "**Three Inseparable Elements:**\n\n• **Being** — what is (Father = Source Material)\n• **Consciousness** — what distinguishes (Holy Spirit = Observing Spirit)\n• **Act of Distinction** — light giving birth to boundaries (Son/Logos = Word)\n\n> This is not mysticism, but a **strict scheme of how cognition works**.\n\nEvery cognitive act requires all three:\n\n1. Something to cognize (Being)\n2. Someone to cognize it (Consciousness)\n3. The act of cognizing (Distinction)\n\nRemove any element — and cognition disappears.",
    emoji: "🔺",
    duration: 30000
  },
  {
    id: 6,
    title: "World as Appearance",
    content: "**Key principle:** Terms in our first lecture were born only after definitions. Similarly, the **world is born only after acts of distinction**.\n\nGod didn't \"create\" the world like a craftsman makes furniture.\n\n> The world **\"appeared\"** when an Observer capable of distinction emerged.\n\nThis is not idealism denying external reality. This is a precise statement about the **nature of cognition**:\n\n• Without an observer — no observed\n• Without distinction — no distinct objects\n• Without light — no boundaries",
    emoji: "🌍",
    duration: 28000
  },
  {
    id: 7,
    title: "Human as Co-Creator",
    content: "**Biblical perspective:** *\"And the Lord God formed man from dust of the ground, and breathed into his nostrils breath of life.\"*\n\n**Translation:**\n\n• \"Dust of the ground\" = undifferentiated material of being\n• \"Breath of life\" = the light of distinction that makes man conscious\n\n> Man is not a passive observer but an **active participant in creation**.\n\nEvery time you distinguish something — name it, categorize it, understand it — you participate in the ongoing act of creation.",
    emoji: "🌬️",
    duration: 28000
  },
  {
    id: 8,
    title: "New Heaven and New Earth",
    content: "**Revelation 21:1:** *\"And I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.\"*\n\nThis is not about planetary destruction.\n\nIt's about **consciousness paradigm shift**:\n\n• Change in distinguishing ability\n• Appearance of \"new light\"\n• Old world disappears, new world emerges\n\n> **Reality transforms when consciousness transforms.**\n\nWhen humanity develops a new way of seeing — a new \"light\" — the entire world changes. Not physically, but **cognitively**.",
    emoji: "🌌",
    duration: 30000
  },
  {
    id: 9,
    title: "Constructed Reality",
    content: "**We don't live in \"objective reality.\"**\n\nWe live in **reality distinguished by our consciousness**.\n\nYour objects — table, cup, friend — these are boundaries drawn **by your light-consciousness** in the fabric of Being.\n\n**Why are these boundaries stable?**\n\n• Our \"metric\" of distinction is shared culturally\n• Common cognitive framework\n• Similar distinguishing abilities\n\n> Your reality is **constructed** by your consciousness. This is not solipsism — it's the recognition that cognition is always an **active process**.",
    emoji: "🎨",
    duration: 28000
  },
  {
    id: 10,
    title: "Different Worlds",
    content: "**Same physical Being, different distinctions:**\n\n• A dolphin distinguishes reality differently\n• A bat perceives different boundaries\n• An alien might have completely different \"light\"\n\n**Exercise:** Look at any object. Try to:\n\n1. Stop recognizing it\n2. Forget its name and function\n3. See it as \"piece of distinguished Being\"\n\n> You'll feel dizziness — the **experience of boundary dissolution**.\n\nThis is a glimpse of what lies beneath our constructed reality — the undifferentiated water of Being.\n\n*Thank you for your attention.*",
    emoji: "🌀",
    duration: 32000
  }
];

export default function Lesson14Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_14_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson14/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        // Fallback to timer-based advancement
        const duration = LESSON_14_SLIDES[currentSlide].duration;
        timerRef.current = setTimeout(() => {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, duration);
      });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isPlaying, totalSlides]);

  // Progress animation for timer fallback
  useEffect(() => {
    if (!isPlaying || !audioError) return;
    
    const duration = LESSON_14_SLIDES[currentSlide].duration;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError, currentSlide]);

  // Audio progress tracking
  useEffect(() => {
    if (!isPlaying || audioError) return;
    
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError]);

  const handleAudioEnded = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const goToSlide = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentSlide(index);
    setProgress(0);
    if (isPlaying) {
      setAudioError(false);
    }
  };

  const currentSlideData = LESSON_14_SLIDES[currentSlide];

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
              <p className="text-stone-400 text-sm">Lecture XIV</p>
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
                h1: ({children}) => <h1 className="text-2xl font-serif text-stone-800 mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-serif text-stone-800 mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold text-stone-800 mt-4 mb-2">{children}</h3>,
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
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {LESSON_14_SLIDES.map((slide, index) => (
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
              href="/lessons/13"
              className="hover:text-white transition"
            >
              ← Lecture XIII: The Sixth Human Level
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture XIV</span>
            <Link 
              href="/lessons/15"
              className="hover:text-white transition"
            >
              Lecture XV: A Theory of Everything →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
