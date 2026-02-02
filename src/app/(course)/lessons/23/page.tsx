'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_23_SLIDES = [
  {
    id: 1,
    title: "",
    content: `In our previous lesson, we established that humans have the ability to **set goals** and **act according to rules**. But among all rules, there is one that stands above all others as the most important.

> This rule was not invented, but discovered, like a law of physics. It is the prohibition against violence toward another human being. This is **the Law**.`,
    emoji: "📖",
    duration: 24480
  },
  {
    id: 2,
    title: "",
    content: `**Human activity** is activity directed toward achieving formed goals without the use of violence. Goals arise from uneasiness, from the desire to improve one's condition. But humans, unlike animals, cannot use violence against another human being to achieve their goals. This is **taboo**. But how did this taboo emerge?`,
    emoji: "🔍",
    duration: 24720
  },
  {
    id: 3,
    title: "",
    content: `To achieve goals, one needs resources and energy. In the human context, resources used to achieve goals are called **goods**. Goods are limited. Humans face a dual challenge: how to obtain the necessary goods and how to distribute them among competing goals.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 4,
    title: "",
    content: `The theory that describes optimal ways of achieving established goals is called **praxeology** — the science of action. Its core is **analysis**, the search for paths to goals within the framework of rules. 

> **Economics** is human activity directed toward obtaining goods and distributing them among goals according to their rank of importance.`,
    emoji: "📊",
    duration: 27440
  },
  {
    id: 5,
    title: "",
    content: `It is important to distinguish: **the formation of goals themselves** is the domain of psychology. **Economics begins** when a goal already exists and one needs to find a **non-violent way** to provide it with resources.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 6,
    title: "",
    content: `Before taking action, a person evaluates not only **effectiveness** but also **reputational risks**. Violating informal rules of cooperation threatens the loss of trust, and consequently, future benefits. 

> These spontaneously formed rules of non-coercive interaction between people we call **ethics**.`,
    emoji: "🧠",
    duration: 22800
  },
  {
    id: 7,
    title: "",
    content: `Humans can **model the path to their goal** in advance. When modeling isn't possible, they act through **trial and error**, acquiring experience. 

> **Experience** is the connection between objects or phenomena obtained through unintentional actions.

Gaining experience is often associated with **risk**.`,
    emoji: "✨",
    duration: 24080
  },
  {
    id: 8,
    title: "",
    content: `How does **economic science** fundamentally differ from **physics**? Physics discovers objective laws that are independent of opinion. Gravity affects everyone equally. 

Economics, however, deals with people's **subjective value judgments**, which are constantly changing. You cannot track every gas molecule, but you can identify statistical regularities. 

The same applies to economics: we rely on basic postulates that are true for the majority:

- People prefer greater goods to lesser ones
- People prefer present goods to future ones

> But these postulates are relative, not absolute.`,
    emoji: "📝",
    duration: 46320
  },
  {
    id: 9,
    title: "",
    content: `**Key distinction**: economic theory works with uncertainty, striving to reduce it, but is unable to eliminate it completely. Any theory that promises complete certainty in economics is false — it is an intellectual **"perpetual motion machine."**

> Any theory that promises complete certainty in economics is false — it is an intellectual "perpetual motion machine."`,
    emoji: "🌟",
    duration: 20000
  },
  {
    id: 10,
    title: "",
    content: `**Human activity** based on voluntary cooperation and the rejection of violence generates phenomenal growth in prosperity. **Creation leads to growth**, while **destruction—robbery, deception—leads to decline**. Therefore, those who employ violence are forced to camouflage themselves.

They create an **imitation of human activity**—they too have "business," "profit," and "services." But for an honest person, profit is the result of **voluntary exchange**. For a robber, their gains are the result of **coercion**.

> Creation leads to growth, while destruction—robbery, deception—leads to decline.`,
    emoji: "🔮",
    duration: 38960
  },
  {
    id: 11,
    title: "",
    content: `The danger of **imitation** lies in the fact that its metastases, penetrating the body of society under plausible pretexts such as "**fair redistribution**," lead to crises, famine, and wars.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 12,
    title: "",
    content: `Language, born from **signs for abstractions**, enables something entirely new—the **exchange of knowledge**. People begin to communicate. 

> Communication is the exchange of knowledge.

Communication leads to the possibility of making agreements, forming groups, and acting together toward a common goal. 

**Society** is a group of people united by a shared **information field**. 

Thus, the ability to **abstract** gave birth to society.`,
    emoji: "🔍",
    duration: 34480
  },
  {
    id: 13,
    title: "",
    content: `Here, one must not confuse **society** and **organization**. An organization is created intentionally to unite efforts toward achieving a common goal. In an organization, the goal is known. It is written in the charter. The organization's resources are also known—they too are described in the charter. But what exactly needs to be done and how it should be done to successfully achieve the goal using these resources—this is unknown. This is only assumed. And this is described in the program. Programs can change.

**Society**, on the contrary, has no goal, or rather, it is unknown to any mortal. Society emerges spontaneously. But conversely, the rules of society are known:

> These are the 10 commandments.`,
    emoji: "💡",
    duration: 56480
  },
  {
    id: 14,
    title: "",
    content: `But what else happens when people begin to interact? **Conflicts arise**. The most terrible of these is **violence** — the use of force against another person. Violence deprives people of freedom, the right to act, and property. 

Over millennia of spontaneous selection, the main, salvific rule has crystallized — **the prohibition of violence**. This is not a rule that someone invented. It was **discovered**.

> **Law is a formal prohibition against the use of violence against a person.**`,
    emoji: "📊",
    duration: 35280
  },
  {
    id: 15,
    title: "",
    content: `But if **violence** is prohibited, then how can one defend against those who still use it? The answer: it is specifically **violence** that is prohibited—the use of force against a person's rights, freedom, and property. Force can and must be used against violence. This is what **defense** means.

> Organized forceful protection of humans from violence—this is **politics**.

**Civilization** is a society protected by politics. The word itself comes from the Latin "*civilis*"—meaning "fenced off, protected."`,
    emoji: "🎯",
    duration: 37280
  },
  {
    id: 16,
    title: "",
    content: `Do all people equally understand against whom violence should not be used? History shows: **no**. Humanity develops in leaps. Each level represents a new circle of people whom an individual recognizes as **"their own."**

The **first level** is family. "One's own" are only members of my family.

The **second level** is clan or tribe. "One's own" is the entire tribe.

The **third level** is people, nation. "One's own" are all who speak my language.

The **fourth, highest level** is civil society. "One's own" is any person who has renounced violence.

> Each of us passes through these levels in childhood, and our upbringing is the purposeful elevation to a higher level.`,
    emoji: "🧠",
    duration: 47520
  },
  {
    id: 17,
    title: "",
    content: `Conflict between people of different levels is a **civilizational conflict**. For a person at the **"tribe" level**, a representative of another tribe is not human—violence can be used against them. For a person at the **"people" level**, both tribes are their own, and violence is unacceptable.

Therefore, the modern definition of human can be clarified:

> **Human** is a being that distinguishes another human and recognizes their rights, freedom, and property.`,
    emoji: "✨",
    duration: 35680
  },
  {
    id: 18,
    title: "",
    content: `**Learning to see the difference between genuine human activity and imitation** is the main practical goal. To achieve this, one must be honest with oneself, accept the conclusions of **formal logic**, and use exclusively one's own **reason** for analysis.`,
    emoji: "📝",
    duration: 20000
  },
  {
    id: 19,
    title: "",
    content: `**Economics** is the primary and true concern of every citizen. This endeavor, like daily hygiene, is worth dedicating time and energy to. 

> Because only in this way can we protect the genuinely human world built on **abstractions**, **rules**, and **voluntary cooperation**.`,
    emoji: "🌟",
    duration: 20480
  }
];

export default function Lesson23Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_23_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson23/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_23_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_23_SLIDES[currentSlide].duration;
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

  const currentSlideData = LESSON_23_SLIDES[currentSlide];

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
              <p className="text-stone-400 text-sm">Lecture 23</p>
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
            {LESSON_23_SLIDES.map((slide, index) => (
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
          lessonId={23}
          lessonTitle="HUMAN ACTIVITY, LAW AND CIVILIZATION"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/22"
              className="hover:text-white transition"
            >
              ← Lecture 22
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 23</span>
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
