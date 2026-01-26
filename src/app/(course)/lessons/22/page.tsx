'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_22_SLIDES = [
  {
    id: 1,
    title: "",
    content: `Let's draw a circle. A line segment connecting two points on the circle is a **chord**. This is a definition and a term. A **chord** that passes through the center of the circle is a **diameter**. If we connect a point on the circle with its center, this is a **radius**. Their dimensions can be measured. Simple.

> The fundamental geometric relationships within a circle demonstrate how abstract concepts become concrete through measurement.`,
    emoji: "📖",
    duration: 24880
  },
  {
    id: 2,
    title: "",
    content: `Let's draw another circle, a larger one. We'll measure the radius and diameter again. They will be different in size. But the **terms** are the same! 

> Conclusion: terms do not distinguish sizes.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 3,
    title: "",
    content: `Let us denote the length of the diameter with the letter **d**, and the length of the radius with the letter **r**. These are **parameters**.

> A **parameter** is a letter designation for a quantity. A **quantity** is the result of counting or measurement.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 4,
    title: "",
    content: `Now an obvious thing: the **diameter** consists of two **radii**. Let's write it down: **d = 2r**. This is our first **formula**! 

> A formula is a parametric notation of the relationship between quantities. Or simply — a relationship between parameters.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 5,
    title: "",
    content: `What is it needed for? The **formula allows for calculation**. **Calculation** is obtaining the value of a parameter not through measurement, but by means of its connections with other parameters.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 6,
    title: "",
    content: `We measured the **radius (r)** — calculated the **diameter (d)** by multiplying by two. 

> "Too simple," the child will say. "The diameter can be measured directly anyway."

And you will agree.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 7,
    title: "",
    content: `But what cannot be measured with a ruler? **The length of the circumference itself!** The ruler is straight, the circumference is curved. 

You could take a string, lay it along the circumference, then stretch it out and measure it. But this is inconvenient and not always accurate.`,
    emoji: "✨",
    duration: 21040
  },
  {
    id: 8,
    title: "",
    content: `Let's denote the **circumference** with the letter c. How many **diameter lengths** fit into the length of the circumference? 

We measure the circumference length with a string, measure the diameter with a ruler, then divide c by d. We get approximately three. With any circle — approximately three.`,
    emoji: "📝",
    duration: 24880
  },
  {
    id: 9,
    title: "",
    content: `"**Approximately**" is not precise. More precisely — **3.14**. Even more precisely — **3.1415926535...** This is the number **π (pi)**. It equals the length of a circumference per unit length of its diameter.`,
    emoji: "🌟",
    duration: 21040
  },
  {
    id: 10,
    title: "",
    content: `Let's write: **c = πd**. We have calculated what is difficult to measure! We measured the easily measurable diameter and multiplied it by a known number.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 11,
    title: "",
    content: `But measuring the **radius** is even simpler than measuring the diameter! 

To measure the diameter, you need to align three points with the ruler — two points on the circumference and the center. For the radius, you only need two points.

And we remember: **d = 2r**. 

Let's substitute this into the formula: **c = 2πr**.

> Here it is — the final formula for the circumference of a circle.`,
    emoji: "📖",
    duration: 28240
  },
  {
    id: 12,
    title: "",
    content: `A **formula** allows us to calculate what is difficult or impossible to measure by using what is easy to measure.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 13,
    title: "",
    content: `Give a child a **compact disc** and a **ruler**. Let them find the length of its circumference. They will try to place the ruler against the edge. Let them struggle. Then, maybe, they'll figure out to wrap it with **string**. 

Eventually, they will measure the **diameter** — that's easy. And using the formula **c = πd**, they will calculate the **circumference**.

> This struggle and discovery process demonstrates how children naturally develop abstract mathematical thinking through hands-on experimentation.`,
    emoji: "💡",
    duration: 29920
  },
  {
    id: 14,
    title: "",
    content: `Ask: "Did you **measure** the length of the circumference?" He will answer: "Yes!" Correct him: 

> "No. You **measured** the length of the diameter. But the length of the circumference — you **calculated** it."`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 15,
    title: "",
    content: `This is important. The distinction between **measurement** and **calculation**. A **formula** is the bridge between them. It does not eliminate measurement, but rather overcomes its limitations.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 16,
    title: "",
    content: `Where does the human capacity to create such formulas come from? From the ability to **abstract**. **Abstraction** is the process of isolating and distinguishing parts of being. An **abstraction** is a part of being perceived as a separate whole.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 17,
    title: "",
    content: `An **animal cannot abstract**. For an animal, neither the external world nor itself exists as separate entities. Everything is a unified system of **signals and reactions**. 

> A squirrel sees a nut, but cannot imagine the nut in its absence.`,
    emoji: "✨",
    duration: 21040
  },
  {
    id: 18,
    title: "",
    content: `**Humans are distinctive.** They extract parts from existence: the physical world, nothingness, themselves. Then they break down the physical world into parts: sun, sky, water... Afterward, they unite homogeneous parts into a **higher-order abstraction** — **being**.

> For example, from a multitude of apples emerges the concept of "apple in general."`,
    emoji: "📝",
    duration: 26320
  },
  {
    id: 19,
    title: "",
    content: `Humans assign a **sign** to each abstraction—a sound, gesture, or symbol. **Signs** and **abstractions** form **knowledge**. 

> Knowledge is abstraction translated into symbolic form.

By working with knowledge, humans construct models of events and actions. This is when thinking begins. 

> Thinking is operations performed on abstractions.`,
    emoji: "🌟",
    duration: 24240
  },
  {
    id: 20,
    title: "",
    content: `**Constant work with definitions and terms** develops a new quality — the ability to act according to rules. 

> **Literacy is action according to rules.**

A **literate person** speaks concisely and precisely, using proper terminology. An **illiterate person** is forced to give lengthy descriptions.`,
    emoji: "🔮",
    duration: 21200
  },
  {
    id: 21,
    title: "",
    content: `There are **connections** between objects. These can also be described with signs. For example, the connection between distance and time is **speed**. A **concept** is a term that denotes the connection between quantities or phenomena.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 22,
    title: "",
    content: `The **knowledge library** contains all terms and concepts. By operating with them, a person can model a state that is better than the present one. This model becomes a **thought**. 

When a person begins to act, the thought becomes a **goal**. 

> A goal is an abstract model of what is desired.`,
    emoji: "🔍",
    duration: 21360
  },
  {
    id: 23,
    title: "",
    content: `To achieve a goal, new actions are needed — **purposeful actions**. Human beings are creatures capable of acting purposefully. In this domain, they are free from instincts.

> Humans possess the unique ability to transcend instinctual behavior through purposeful action.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 24,
    title: "",
    content: `But how do we achieve our goal? We can use **trial and error**. Or we can construct **models of action** and select the best one — applying **analysis**. The discovered sequence of actions is preserved as a **rule**. 

> A **rule** is the result of analysis — a sequence of actions that leads to the goal.`,
    emoji: "📊",
    duration: 22960
  },
  {
    id: 25,
    title: "",
    content: `The repeated application of a **rule** forms a **skill** — an action brought to the level of automatism. By perfecting skills in the use of knowledge, humans create **language**, and **speech** emerges. And with it comes the possibility of **cooperation** and **coordinated activity** toward a common goal.`,
    emoji: "🎯",
    duration: 21520
  },
  {
    id: 26,
    title: "",
    content: `This is how the path looks: **abstraction** → **knowledge** → **thinking** → **goal** → **rule**. This is the path of a thinking person, a person of action. 

But is this sufficient for human activity? No. 

> Because there is also violence. And there is law.`,
    emoji: "🧠",
    duration: 21280
  }
];

export default function Lesson22Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_22_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson22/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_22_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_22_SLIDES[currentSlide].duration;
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

  const currentSlideData = LESSON_22_SLIDES[currentSlide];

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
              <p className="text-stone-400 text-sm">Lecture 22</p>
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
            {LESSON_22_SLIDES.map((slide, index) => (
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
          lessonId={22}
          lessonTitle="FORMULAS, ABSTRACTION AND RULES"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/21"
              className="hover:text-white transition"
            >
              ← Lecture 21
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 22</span>
            <Link 
              href="/lessons"
              className="hover:text-white transition"
            >
              All Lessons →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
