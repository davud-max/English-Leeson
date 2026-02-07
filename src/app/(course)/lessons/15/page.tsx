'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_15_SLIDES = [
  {
    id: 1,
    title: "[SLIDE:1]",
    content: `Hello. Today is a special lecture. We will not be discussing proven facts or physics textbooks. We are embarking on a journey through the **labyrinth of a single thought**. We will trace the birth, life, and perhaps the boundaries of one **audacious idea**.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 2,
    title: "",
    content: `This is a story about how one question can grow into an entire universe. A universe of **hypothesis**.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 3,
    title: "[SLIDE:2]",
    content: `# Part One. Beyond the Big Bang.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 4,
    title: "",
    content: `You've surely heard about the **Big Bang**. About how our Universe began from an unimaginably dense and hot point, a **singularity**. Science tells us: we cannot extrapolate further. Our equations break down. Time loses meaning.

> We cannot extrapolate further. Our equations break down. Time loses meaning.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 5,
    title: "",
    content: `But the human mind does not like dead ends. It stubbornly asks: what was there? Or rather, **what exists beyond this boundary?** Not emptiness—emptiness is already space. Something more **fundamental**. Something more **strange**.

> The human mind stubbornly refuses to accept limits, always seeking what lies beyond the known boundaries.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 6,
    title: "",
    content: `Our space is **three-dimensional**. It has length, width, and height. A **point** has zero dimensions. It has no extension, but it exists within space.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 7,
    title: "",
    content: `Now let's step beyond this point. Beyond everything. There, there isn't even the possibility for **extension**. There is no "there." This is not zero. This is **less than zero**. 

> This is the fundamental negation of space as we know it.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 8,
    title: "",
    content: `Let us call this state **Minus-Space**.`,
    emoji: "📝",
    duration: 20000
  },
  {
    id: 9,
    title: "[SLIDE:3]",
    content: `**Part Two. Instantaneous Movement.**`,
    emoji: "🌟",
    duration: 20000
  },
  {
    id: 10,
    title: "",
    content: `So we have given a name to the phantom. But what follows from this? If there is no **extension** in **Minus-Space**, then what is movement? After all, movement is the overcoming of distance. And if there is no distance, then the transition from one conditional position to another requires no time. It is instantaneous.

> If there is no distance, then the transition from one conditional position to another requires no time. It is **instantaneous**.`,
    emoji: "🔮",
    duration: 25120
  },
  {
    id: 11,
    title: "",
    content: `Now let's look at this from our world's perspective. Imagine a **particle**. It disappears. And immediately appears somewhere else, thousands of light-years away. For us, this is **teleportation**. But within the framework of our hypothesis, this is simply a logical consequence.

> The particle momentarily dove into **Minus-Space**, where there is no "here" and "there," and emerged at a new point.

**Distance was not overcome**. It simply did not exist on the path that the particle took.`,
    emoji: "📖",
    duration: 36000
  },
  {
    id: 12,
    title: "[SLIDE:4]",
    content: `**Part Three. Pixels of Reality.**`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 13,
    title: "",
    content: `Modern physics increasingly acknowledges that space at its most fundamental level, at the **Planck scale**, is discrete. Like a digital image. It consists of elementary cells. **Quanta of space**.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 14,
    title: "",
    content: `An elegant question arises. If space consists of **pixels**, then what exists between the pixels? There cannot be other, smaller pixels there. This leads to infinity. No. 

Between the boundaries of **spatial cells**, there must be something that is not space itself. Something that separates them and defines their very **discreteness**.

> What exists between spatial boundaries must be fundamentally non-spatial in nature - it is what creates and defines the discrete structure itself.`,
    emoji: "📊",
    duration: 25120
  },
  {
    id: 15,
    title: "",
    content: `You've already guessed it. This is **Minus-Space** again. It is the invisible framework, the seam of reality. That which allows space to be a structure, rather than an infinite expanse.

> It is that which allows space to be a structure, rather than an infinite expanse.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 16,
    title: "[SLIDE:5]",
    content: `# Part Four. Black Holes as Doors.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 17,
    title: "",
    content: `And now the most complex object in the Universe. **Black hole**. At its heart, according to calculations, the same **singularity**. **Infinite density**. **Collapse of all laws**.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 18,
    title: "",
    content: `But what if, under **monstrous pressure and gravity**, matter does not compress into a mathematical point, but does something else entirely? What if it **pushes through the barrier of our reality**? Passes through the sieve of these very **cells of space** and goes there, into **Minus-Space**?

> What if matter, under extreme conditions, doesn't collapse but instead transcends the boundaries of our dimensional framework?`,
    emoji: "📝",
    duration: 21440
  },
  {
    id: 19,
    title: "",
    content: `Then **singularity** is not the end. It is a door. A portal into a state that we cannot describe with our language of **extension and time**. Matter is not destroyed. It becomes **other**.

> Singularity is not the end. It is a door.

**Matter** does not cease to exist—it transforms into something fundamentally different, beyond our current conceptual framework of spatial and temporal dimensions.`,
    emoji: "🌟",
    duration: 20000
  },
  {
    id: 20,
    title: "[SLIDE:6]",
    content: `# Part Five. **Resonance Tubes**.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 21,
    title: "",
    content: `The **hypothesis** requires a mechanism. How is all of this connected into a unified picture? How can we explain not only strange phenomena, but also ordinary forces, **gravity**, **electromagnetism**?`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 22,
    title: "",
    content: `Here the second **key image** enters the scene. **Resonance tubes**.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 23,
    title: "",
    content: `Imagine two particles in our world. Each one oscillates, vibrating at its own frequency. Now let's imagine that they can be connected by the finest threads, **fundamental entities**. Let's conditionally call them **gravitons**. These threads are capable of passing through **Minus-Space**.`,
    emoji: "💡",
    duration: 22240
  },
  {
    id: 24,
    title: "",
    content: `When the **oscillation frequencies** of two particles coincide, the **thread-tube** connecting them enters into **resonance**. 

> Energy flows more freely through it, and the connection becomes stronger.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 25,
    title: "",
    content: `Different types of **interactions** may represent different types of **resonance** within these tubes. One frequency type we perceive as **gravitational force**. Another type we experience as **electromagnetic force**. 

Complex, **composite resonances** may be responsible for the **strong and weak interactions** within atomic nuclei.`,
    emoji: "🎯",
    duration: 22320
  },
  {
    id: 26,
    title: "[SLIDE:7]",
    content: `# Part Six. Unified Picture of the World.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 27,
    title: "",
    content: `The **worldview** becomes remarkably **unified**.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 28,
    title: "",
    content: `**Foundation**: **Minus-Space**, metaphysical background, nothingness devoid of properties.`,
    emoji: "📝",
    duration: 20000
  },
  {
    id: 29,
    title: "",
    content: `**The Fabric of Reality**: discrete cells of our space-time, floating in this background.`,
    emoji: "🌟",
    duration: 20000
  },
  {
    id: 30,
    title: "",
    content: `**Content**: particles, special **vibrational states** at the **junctions of cells**.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 31,
    title: "",
    content: `**Interactions**: resonant tubes connecting particles through **Minus-Space**.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 32,
    title: "",
    content: `In this model, other mysteries also find their place. **Dark matter**? Perhaps this is a form of matter whose **resonant profile** is almost completely immersed in **Minus-Space**. **Dark energy**? It might be the background pressure of **Minus-Space** itself, its fundamental energy that stretches the cells of our reality.`,
    emoji: "🔍",
    duration: 24480
  },
  {
    id: 33,
    title: "",
    content: `We arrive at a **magnificent conclusion**. This construction is nothing other than a sketch of the **Unified Field Theory**.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 34,
    title: "[SLIDE:8]",
    content: `**Part Seven. Limits of the Hypothesis.**`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 35,
    title: "",
    content: `Now let's take a step back. Everything you have just heard is a **brilliant**, **logical**, **breathtaking speculative construction**. A **philosophical hypothesis**. An **intellectual myth**.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 36,
    title: "",
    content: `Why? Because **science has rigid rules**. Its theories must be **mathematical**. From equations, we need to derive precise numbers—the mass of an electron, the curvature of space around the Sun. These numbers are then compared with instrument readings.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 37,
    title: "",
    content: `Our hypothesis about **Minus-Space** was born from imagery and analogy. This is the power of human logic and intuition. 

> But its main concepts still remain poetic metaphors.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 38,
    title: "",
    content: `This is not a **defeat of thought**. This is the designation of a **boundary**. A boundary between two **ways of knowing**.`,
    emoji: "📝",
    duration: 20000
  },
  {
    id: 39,
    title: "",
    content: `One approach is the **creation of holistic, comprehensible, and beautiful worldviews**. This is the art of the philosopher, the science fiction writer, the dreamer. 

> This is how ancient myths and natural philosophical systems were born.`,
    emoji: "🌟",
    duration: 20000
  },
  {
    id: 40,
    title: "",
    content: `Another approach involves **building working, testable, but often counterintuitive models**. This is the work of a **scientist**.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 41,
    title: "",
    content: `The **Minus-Space Hypothesis** is a powerful beat of the first wing. A burst of intuition, the courage to ask the wrong questions. But for an idea to take flight, it needs a second wing: **mathematical rigor** and **experimental verification**.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 42,
    title: "",
    content: `Perhaps someday, in the equations of a future **theory of quantum gravity**, someone will recognize echoes of this audacious idea. 

> Echoes of the thought that beyond the edge of our reality lies not emptiness, but something more fundamental—an **absolute Minus**, from whose silence was born the entire symphony of existence.`,
    emoji: "🔍",
    duration: 24960
  }
];

const LESSON_CONTENT = LESSON_15_SLIDES.map(s => s.content).join('\n\n');

export default function Lesson15Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_15_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson15/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_15_SLIDES[currentSlide].duration;
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

  useEffect(() => {
    if (!isPlaying || !audioError) return;
    
    const duration = LESSON_15_SLIDES[currentSlide].duration;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError, currentSlide]);

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

  const currentSlideData = LESSON_15_SLIDES[currentSlide];

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
              <p className="text-stone-400 text-sm">Lecture 15</p>
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

        {/* Voice Quiz Button */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-lg p-6 mb-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎤 Ready to Test Your Knowledge?</h3>
          <p className="text-amber-100 mb-4">Take a voice quiz with AI-generated questions based on this lecture</p>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition shadow-md"
          >
            Start Voice Quiz
          </button>
        </div>

        {/* Slide Navigation */}
        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
            {LESSON_15_SLIDES.map((slide, index) => (
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

      {/* Voice Quiz Modal */}
      {showQuiz && (
        <VoiceQuiz
          lessonId={15}
          lessonTitle="Theory of Everything: Minus-Space and Resonance"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/14"
              className="hover:text-white transition"
            >
              ← Lecture 14
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 15</span>
            <Link 
              href="/lessons/16"
              className="hover:text-white transition"
            >
              Lecture 16 →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
