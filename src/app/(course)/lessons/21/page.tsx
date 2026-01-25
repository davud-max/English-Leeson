'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_21_SLIDES = [
  {
    id: 1,
    title: "",
    content: `Everything begins with **observation**. But to observe is not simply to see. An animal sees, but does not observe. Only humans know how to observe. 

> **Observation** is the artificial separation of a part from unified existence.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 2,
    title: "",
    content: `Imagine a child who sees an apple. At first, for them it is simply part of the general flow of impressions. Then they begin to **distinguish this apple** from the background. They observe it. This is the **first step**.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 3,
    title: "",
    content: `**Observed phenomena** must be described in words. If ten people describe the same thing, they will give ten different descriptions. But what if we ask for the **shortest description**? It will be identical for everyone. 

> This shortest description is the definition.`,
    emoji: "💡",
    duration: 20640
  },
  {
    id: 4,
    title: "",
    content: `**Definition** — the shortest description of what is observed. A **term** is assigned to the definition. **Term** — a word used to designate the definition.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 5,
    title: "",
    content: `But there are special terms — **fundamental terms**. They have no definitions. The first of these is **point**. A point has no definition. It is zero-dimensional. 

> A point made on paper with a pencil is not a point, but a spot.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 6,
    title: "",
    content: `If we **mentally extend a point** — we get a line. A line is the **first level**, one-dimensional. 

If we **mentally extend a line crosswise** — we get a plane. A plane is the **second level**, two-dimensional. 

If we **mentally extend a plane crosswise** — we get space. Space is the **third level**, three-dimensional.

> Through mental abstraction, we progress from point to line to plane to space, each step adding a new dimension to our conceptual framework.`,
    emoji: "🧠",
    duration: 27600
  },
  {
    id: 7,
    title: "",
    content: `All these terms are **ultimate concepts**. They cannot be observed. They exist only in the mind as **pure abstraction**. But they allow us to construct definitions of any abstract objects.

> These terms exist only in the mind as pure abstraction, yet they enable the construction of definitions for any abstract objects.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 8,
    title: "",
    content: `An **abstract object** can be described completely and definitively. A **real object** cannot. A real object has an infinite number of details. 

> A word for a real object is a **name**. It can be shown. A word for an abstract object is a **term**. It cannot be shown, but it can be described completely.`,
    emoji: "📝",
    duration: 22800
  },
  {
    id: 9,
    title: "",
    content: `After we have learned to **observe**, **describe**, **construct definitions**, and **assign terms**, a question arises: 

> How many? How many of what and where?`,
    emoji: "🌟",
    duration: 20000
  },
  {
    id: 10,
    title: "",
    content: `A set of identical terms forms a **group**. And immediately the question arises: how many are there in the group? The description of the quantity of objects in a group is what constitutes **counting**.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 11,
    title: "",
    content: `Place three pencils in front of a child. They will begin: "One, two, three." But when saying "three," they point to one—the third pencil. When saying "two"—to one, the second pencil. But each pencil is **one**! The child becomes confused.

> The child experiences confusion when the **numerical sequence** conflicts with the **individual identity** of each object.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 12,
    title: "",
    content: `Show one pencil: "This is **one pencil**." Which word is unnecessary? The word "**one**" is unnecessary! "**Pencil**" is already in singular form.

Now show three pencils: "These are **pencils**." Five pencils: "And these are **pencils**." But the quantities are different!

> As soon as we speak in plural form, we need to describe exactly how many are in each group.`,
    emoji: "🔍",
    duration: 28160
  },
  {
    id: 13,
    title: "",
    content: `Take three pencils, two pens, one marker. Pencils — three. Pens — two. Marker — one. How many in total? Six.

Six what? Six **objects**. Depending on which term is used, we get different groups and different quantities.

> A **group** is a set of objects with the same name. **Grouping** is the process of combining such objects. **Counting** is describing the quantity of objects in a group.`,
    emoji: "💡",
    duration: 30400
  },
  {
    id: 14,
    title: "",
    content: `The term designating the result of counting is a **numeral**: "three," "five," "twelve." The symbol representing a numeral without regard to the term is a **digit**: 3, 5, 12.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 15,
    title: "",
    content: `The very first method of counting is **counting on fingers**. People count on their fingers silently. You set aside one object — you bend one finger. Until you get a group of fingers equal to the group of objects.

> You show: that's how many!`,
    emoji: "🎯",
    duration: 20160
  },
  {
    id: 16,
    title: "",
    content: `**Five fingers** on one hand. But what if you need to count more than five? In ancient times, people counted by **dozens** — twelve. They used the thumb to mark the phalanges on the other four fingers. **Five dozen** — sixty, a **copa**. This is where the **sexagesimal system** comes from: 60 seconds in a minute, 60 minutes in an hour.`,
    emoji: "🧠",
    duration: 28880
  },
  {
    id: 17,
    title: "",
    content: `Then came **counting sticks**. They didn't count the sticks themselves, but counted *with* the sticks. One bird in the picture — set aside one stick. Show how many sticks — that's how many birds there are.`,
    emoji: "✨",
    duration: 20000
  },
  {
    id: 18,
    title: "",
    content: `You can pronounce a **numeral**. You can write down a **digit**. But what is the **number "five"**?

Try to imagine the number five. You won't be able to do it. 

You will imagine five objects — that's a **group**. Or the symbol "5" — that's a **digit**. 

> But the number "five" itself is a **pure abstraction**. It's impossible to visualize.`,
    emoji: "📝",
    duration: 24560
  },
  {
    id: 19,
    title: "",
    content: `We have traveled the path from **observation** to **counting**. From the ability to distinguish an object from existence to the ability to describe the quantity of such objects. This is the foundation. What comes next is how to connect these quantities to one another.`,
    emoji: "🌟",
    duration: 20240
  }
];

const LESSON_CONTENT = LESSON_21_SLIDES.map(s => s.content).join('\n\n');

export default function Lesson21Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_21_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson21/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_21_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_21_SLIDES[currentSlide].duration;
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

  const currentSlideData = LESSON_21_SLIDES[currentSlide];

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
              <p className="text-stone-400 text-sm">Lecture 21</p>
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
            {LESSON_21_SLIDES.map((slide, index) => (
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
          lessonId={21}
          lessonTitle="OBSERVATION, TERMS AND COUNTING"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/20"
              className="hover:text-white transition"
            >
              ← Lecture 20
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 21</span>
            <Link 
              href="/lessons/22"
              className="hover:text-white transition"
            >
              Lecture 22 →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
