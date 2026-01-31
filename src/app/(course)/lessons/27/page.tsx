'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_27_SLIDES = [
  {
    id: 1,
    title: "",
    content: `We have completed the circle. From simple observation—to **theology**. But our tool—**abstraction**—knows no boundaries. What if space, which we consider a fundamental given, itself has structure? What lies beyond its limits?`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 2,
    title: "",
    content: `Modern physics allows for the idea of **space quantization**. All of space may be a mosaic of elementary cells. But what exists between them? 

Between the cells there cannot be "less space." But there also cannot be "nothing" there. 

> We need a concept for the absence of even the possibility of extension. Let us call this **Minus-space**.`,
    emoji: "🔍",
    duration: 26400
  },
  {
    id: 3,
    title: "",
    content: `**Space** is that which possesses extension and metrics (distance). A **point** (zero-space) is that which possesses position but not extension. **Minus-space** is that which possesses neither extension nor position. This is not emptiness. This is the absence of the container itself, the cancellation of the act of distinguishing between "here" and "there."

> This is the absence of the container itself, the cancellation of the act of distinguishing between "here" and "there."`,
    emoji: "💡",
    duration: 28080
  },
  {
    id: 4,
    title: "",
    content: `What follows from this? In the ordinary world, **movement** is the overcoming of distance, requiring time. In **Minus-space**, there is no distance—transition is instantaneous. A particle disappears and appears thousands of light-years away. For us—**teleportation**. Within the framework of this hypothesis—the particle "dove" into **Minus-space**, where there is no "here" and "there," and emerged at a new point. 

> Distance was not overcome—it simply did not exist.`,
    emoji: "📊",
    duration: 36480
  },
  {
    id: 5,
    title: "",
    content: `But what are **black holes**? At their heart lies a **singularity**. Infinite density. The collapse of all laws.

But what if, under monstrous pressure, matter doesn't compress into a point but does something else entirely? What if it pushes through the barrier of our reality, passes through the "sieve" of space cells, and escapes into **Minus-space**?

> Then the singularity is not an end, but a door. A portal into a state that we cannot describe in the language of extension and time.`,
    emoji: "🎯",
    duration: 36400
  },
  {
    id: 6,
    title: "",
    content: `The hypothesis requires a mechanism. How is all of this connected? Imagine: two particles in our world oscillate at their own frequency. They are bound by the finest threads — **gravitons** — through **Minus-space**. When frequencies align, the thread enters resonance. Energy flows more freely, the connection strengthens. 

> All fundamental interactions — gravity, electromagnetism, nuclear forces — are simply different "settings" of one basic process: resonant connection through Minus-space.`,
    emoji: "🧠",
    duration: 38720
  },
  {
    id: 7,
    title: "",
    content: `This is a **philosophical hypothesis**. **Scientific theories** must be mathematical. **Precise numbers** must be derived from equations. Our concepts—"**absence of extension**," "**resonance tubes**"—remain poetic metaphors for now.

> The philosophical path involves creating holistic, comprehensible, beautiful pictures of the world. The scientific path involves constructing working, testable, but often counterintuitive models.

The **Minus-Space hypothesis** is a powerful sweep of the first wing, a surge of intuition. But for an idea to take flight, it needs a second wing—**mathematical rigor**.`,
    emoji: "✨",
    duration: 46160
  },
  {
    id: 8,
    title: "",
    content: `Perhaps someday, in the equations of a future **theory of quantum gravity**, someone will recognize the echoes of this audacious thought. 

> Echoes of the idea that beyond the edge of our reality lies not emptiness, but something more fundamental — an absolute **"Minus"**, from whose silence the entire symphony of existence was born.`,
    emoji: "📝",
    duration: 24720
  },
  {
    id: 9,
    title: "",
    content: `**"In the beginning was the Word"** — the Word as the first term, the first boundary drawn. In our imagination, this **"Word"** represents the birth of the first cell of Space from Minus-space.

Our entire course has been a gradual introduction to the grammar of the language in which reality itself may possibly be written.

> The Word as the first term, the first boundary drawn.`,
    emoji: "🌟",
    duration: 24240
  },
  {
    id: 10,
    title: "",
    content: `We have traveled a long journey from our first concepts to profound philosophical truths. The time has come to bring everything together and see the complete picture. 

> The path of humanity — from the ability to distinguish to the comprehension of **unity**.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 11,
    title: "",
    content: `The entire course is founded on understanding what makes a human being truly human — the **ability to abstract**. This is a gift, a light by which we distinguish the world. 

> An animal sees, but does not observe. A human observes, distinguishes, abstracts.

We create the world within our own **consciousness**.`,
    emoji: "📖",
    duration: 24400
  },
  {
    id: 12,
    title: "",
    content: `**Levels of abstraction** lead us from quantity to digit, from digit to number. From the concrete to the general, from the general to the absolute. Each level opens new horizons.`,
    emoji: "🔍",
    duration: 20000
  },
  {
    id: 13,
    title: "",
    content: `The **Biblical narrative of creation** is the story of the awakening of human consciousness. 

> **Water** represents primordial Being, an indistinguishable unity. **Light** is the capacity to abstract, the gift of discernment. The **firmament** is the boundary between World and Nothingness. **Man** is the observer, born from water through light.`,
    emoji: "💡",
    duration: 26720
  },
  {
    id: 14,
    title: "",
    content: `> **The Sacred Trinity of Knowledge**: God is Water plus the Holy Spirit. Number is Group plus Numeral. The attempt to see one leads to the two others.`,
    emoji: "📊",
    duration: 20000
  },
  {
    id: 15,
    title: "",
    content: `**The Theory of Cognitive Resonance** reveals the mechanism of thinking. Our consciousness operates as a dialogue between two circuits.

The **analog circuit** encompasses sensory experience and lived feelings. The **digital circuit** contains abstractions, symbols, and concepts.

> Thought is born when a digital model finds resonance within analog experience.

The **digital circuit** poses questions, while the **analog circuit** responds with energy.`,
    emoji: "🎯",
    duration: 30080
  },
  {
    id: 16,
    title: "",
    content: `Hence the main **pedagogical conclusion**: first **experience and lived understanding**, then **name and formula**. Not the other way around! 

> Memorizing empty symbols does not create resonance.`,
    emoji: "🧠",
    duration: 20000
  },
  {
    id: 17,
    title: "",
    content: `The **ability to abstract** leads to action. **Praxeology** is the science of purposeful human action. 

> Activity is the achievement of goals without violence.

**Economics** is the science of distributing limited goods according to priorities. It is a science of uncertainty. 

**Ethics** consists of spontaneously emerging rules for non-violent cooperation.`,
    emoji: "✨",
    duration: 26560
  },
  {
    id: 18,
    title: "",
    content: `The **key skill** is distinguishing between **creation** and **imitation**. Imitation is coercive activity that masquerades as legitimate. 

The profit of an honest person is the result of **voluntary exchange**. The spoils of a robber are the result of **coercion**.

> The fundamental difference lies in the voluntary nature of legitimate activity versus the forced nature of illegitimate imitation.`,
    emoji: "📝",
    duration: 20000
  },
  {
    id: 19,
    title: "",
    content: `The philosophical interpretation of the number **666** reveals three stages of love. The first six is the **number of the beast**: six separate senses. The second six is the **number of man**: senses united by love for another body. The third six is the **number of God**: complete abstraction, love for the soul. 

> This is the path from the quantity of apples to the digit 6, and from there—to the number six.`,
    emoji: "🌟",
    duration: 32560
  },
  {
    id: 20,
    title: "",
    content: `The history of humanity is an **ascension through levels of humanness**. 

**Moses's level** — the letter of the law. God is external, above all. External compulsion toward the commandments. 

**Jesus's level** — the spirit of the law. God is within each person. Love instead of compulsion. 

**The sixth human level**: there is no longer Jew or Gentile; there is no slave or free — all are one. 

> The expansion of the human circle to encompass all peoples.`,
    emoji: "🔮",
    duration: 34480
  },
  {
    id: 21,
    title: "",
    content: `The wisdom of **sacred texts** is united in the essential. The Quran teaches: 

> "Repel evil with good, and your enemy will become a friend." 

In the Bible, **light** is the ability to distinguish between good and evil. The Gospel reveals: 

> "God is in you, and you are in God."`,
    emoji: "📖",
    duration: 21840
  },
  {
    id: 22,
    title: "",
    content: `All these lessons come together to form a unified **human path**.

The first step is **Distinction**. Acquiring the ability to abstract, that very light.

The second is **Knowledge**. Dividing the world into parts, creating concepts.

The third is **Activity**. Purposeful action without violence.

The fourth is **Unification**. Love as the reverse path to unity.

And the fifth is **Comprehension**. Understanding the trinity, realizing that God is within.`,
    emoji: "🔍",
    duration: 34080
  },
  {
    id: 23,
    title: "",
    content: `> This is the **paradox of the path**. To know unity, one must first divide. To return to God, one must first separate. **Abstraction** divides the world, while **love** reunites it.`,
    emoji: "💡",
    duration: 20000
  },
  {
    id: 24,
    title: "",
    content: `# **Main Conclusions of Our Course**

**Abstraction** is the gift that makes a human being human.

> **Thinking** is resonance, a dialogue between experience and abstraction. Teaching must happen through lived experience.

> **Love** is the path back to unity. From the feelings of an animal to the communion of souls.

> And the highest level is not external law, but **inner truth**. God within.`,
    emoji: "📊",
    duration: 28720
  },
  {
    id: 25,
    title: "",
    content: `> Nurture the richness of your experience. Develop your ability to **abstract**. Distinguish **imitation** from **creation**. Seek God not outside, but within yourself. And remember: the path to unity lies through understanding differences.`,
    emoji: "🎯",
    duration: 20000
  }
];

export default function Lesson27Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_27_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson27/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(() => {
        setAudioError(true);
        const duration = LESSON_27_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_27_SLIDES[currentSlide].duration;
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
    if (isPlaying) setAudioError(false);
  };

  const currentSlideData = LESSON_27_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      <audio ref={audioRef} onEnded={handleAudioEnded} onError={() => setAudioError(true)} />
      
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">← Back to Course</Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture 27</p>
            </div>
            <div className="text-stone-400 text-sm">{currentSlide + 1} / {totalSlides}</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">{currentSlideData.title}</h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        <article className="bg-white rounded-lg shadow-lg border border-stone-200 p-8 md:p-12 mb-8">
          <div className="prose prose-stone prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-stone-700 leading-relaxed mb-5 text-lg">{children}</p>,
                strong: ({children}) => <strong className="text-stone-900 font-semibold">{children}</strong>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-amber-700 pl-6 my-6 italic text-stone-600 bg-amber-50 py-4 pr-4 rounded-r">{children}</blockquote>,
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500 font-medium">Slide Progress</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-700 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-10">
          <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium">← Previous</button>
          <button onClick={togglePlay} className="px-8 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md">{isPlaying ? '⏸ Pause' : '▶ Play Lecture'}</button>
          <button onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))} disabled={currentSlide === totalSlides - 1} className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium">Next →</button>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-lg p-6 mb-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎤 Ready to Test Your Knowledge?</h3>
          <p className="text-amber-100 mb-4">Take a voice quiz with AI-generated questions</p>
          <button onClick={() => setShowQuiz(true)} className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition shadow-md">Start Voice Quiz</button>
        </div>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
            {LESSON_27_SLIDES.map((slide, index) => (
              <button key={slide.id} onClick={() => goToSlide(index)} className={`p-3 rounded text-sm font-medium transition ${index === currentSlide ? 'bg-amber-700 text-white' : index < currentSlide ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`} title={slide.title}>{index + 1}</button>
            ))}
          </div>
        </div>
      </main>

      {showQuiz && <VoiceQuiz lessonId={27} lessonTitle="THREE STEPS TO HEAVEN AND THE SIXTH LEVEL OF MAN" onClose={() => setShowQuiz(false)} />}

      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/lessons/26" className="hover:text-white transition">← Lecture 26</Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 27</span>
            <Link href="/lessons" className="hover:text-white transition">All Lessons →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
