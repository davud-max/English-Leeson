'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_8_SLIDES = [
  {
    id: 1,
    title: "Theory of Cognitive Resonance",
    content: "**Today we will talk about what happens at the very moment when a thought \"comes\" to you.**\n\nNot when you build it brick by brick, but when it arrives suddenly, like an **illumination**.\n\n> *A Phenomenological Model of Thinking and Development*\n\nWhy, out of thousands of possible ideas, does consciousness choose precisely this one? Why does one piece of knowledge remain dead weight, while another lights up the \"Eureka!\" bulb and changes behavior?",
    emoji: "🧠",
    duration: 22000
  },
  {
    id: 2,
    title: "Our Approach: How Does Thought Find Us?",
    content: "We will not turn to brain scanners. We will turn to **inner experience**.\n\nWe will build a **phenomenological model** — a map of how we experience the process of thinking.\n\n**Theory of Cognitive Resonance** is a model that places at the center:\n\n• Not neurons, but **you yourself**\n• Your unique \"I\"\n• Your feelings and capacity for discovery\n\nThis theory explains the **selective mechanism** of consciousness — why some thoughts become ours, while others pass by unnoticed.",
    emoji: "🔬",
    duration: 24000
  },
  {
    id: 3,
    title: "Two Circuits of Consciousness",
    content: "To understand the mechanism of thought selection, let us imagine our consciousness consisting of two interconnected but fundamentally different **circuits**.\n\n**Analog Circuit** — World of immediate, bodily, sensory experience:\n• Taste of an apple\n• Pain from a burn\n• Warmth of the sun\n• Vague longing\n\n**Digital Circuit** — World of abstractions, signs, concepts:\n• The word \"apple\"\n• Medical terminology\n• Temperature in degrees\n• The word \"melancholy\"\n\nThese two circuits speak **different languages** and have completely different properties.",
    emoji: "🔄",
    duration: 26000
  },
  {
    id: 4,
    title: "The Analog Circuit — Proto-Knowledge",
    content: "This is the world of direct experience. It cannot be transmitted in words — only experienced.\n\n**Characteristics:**\n\n• Language: NOT words, but **experiences**\n• Bandwidth: Low (dozens of states)\n• But each state is:\n  — Deeply rooted\n  — Energetically saturated\n  — A life lesson learned\n\nThis is the **inner core**, the **foundation of personality**.\n\n> *The taste of grandmother's pie. The first heartbreak. The triumph of a solved problem. Fear of heights. Joy of recognition.*\n\nThese experiences **cannot be conveyed** — they can only be **lived through**.",
    emoji: "🌊",
    duration: 26000
  },
  {
    id: 5,
    title: "The Digital Circuit — Interface",
    content: "This is the world of signs, symbols, abstract concepts.\n\n**Characteristics:**\n\n• Language: Clear, communicable\n• Bandwidth: **Colossal** (billions of combinations per second)\n• But by itself — **empty**\n\n**Examples:**\n\n• The word \"pain\" — just a set of sounds\n• The digit \"5\" — an abstraction without object\n• The formula E=mc² — symbols on paper\n\n**Key Insight:**\n\nThe digital circuit can manipulate trillions of combinations, but without connection to the analog — it's just **empty symbol shuffling**.",
    emoji: "💻",
    duration: 24000
  },
  {
    id: 6,
    title: "The Mechanism of Thinking: Dialogue and Resonance",
    content: "Where is thought born that we recognize as **our own**?\n\nThinking is not the work of one circuit. It is a process of **resonant dialogue** between them.\n\n**How It Works:**\n\n1. **Generation** — Digital circuit proposes variants: \"what if...\", \"this is similar to...\"\n\n2. **Projection** — Each model is projected onto the analog core\n\n3. **Resonance** — Moment of truth: pattern match!\n\n4. **Birth of Thought** — Amplified signal breaks through into consciousness",
    emoji: "⚡",
    duration: 28000
  },
  {
    id: 7,
    title: "Resonance or Not? The Decisive Moment",
    content: "What happens when the digital model meets the analog core?\n\n**No Resonance:**\n• Model doesn't find response\n• Signal fades\n• Empty mind game, unimportant information\n\n**Resonance Exists:**\n• Pattern matches!\n• Sharp **amplification**\n• Important thought, illumination, true desire\n\n**Formula of Thinking:**\n\n> The digital system asks questions, while the analog **votes with the resource of attention and emotional energy**. The winner gets the right to become a conscious thought.",
    emoji: "✅",
    duration: 26000
  },
  {
    id: 8,
    title: "The Inner Resonator",
    content: "What is this \"analog core\" that resonates so selectively?\n\nThis is our unique **Inner Resonator**, or **cognitive profile**.\n\n**What Shapes It:**\n\n• **Heredity** — Data \"from the manufacturer\", features of the nervous system\n\n• **Cultural Code** — Language, values, concepts of society\n\n• **Personal Experience** — Every experience, success and failure tunes the resonator\n\nEach of us is a **unique instrument** that responds to its own frequencies.",
    emoji: "🎸",
    duration: 26000
  },
  {
    id: 9,
    title: "How Goals Are Born",
    content: "If a thought describes a reality **more preferable** than the current one...\n\n**The Chain:**\n\n1. **Thought** — \"It would be good if...\"\n\n2. **Resonance** — with analog core\n\n3. **Desire** — Emotionally charged image\n\n4. **Action** — We begin to act\n\n5. **Goal** — Desire we embody in action\n\n**Important Conclusion:**\n\n> Purposeful activity is not something separate from thinking. It is its **direct, natural continuation**.",
    emoji: "🎯",
    duration: 24000
  },
  {
    id: 10,
    title: "Pedagogy of Resonance: How to Develop Thinking?",
    content: "If thinking is resonance, then how do we develop it?\n\n**Dead-End Path:** *Traditional memorization*\n• Loading digital circuit with empty signs\n• No connection to experience\n• No material for resonance\n• Student \"doesn't want\" to learn\n\n**Effective Path:** *Learning through experience*\n• First: **Experience**\n• Then: **Name** for it\n• Powerful resonance!\n• Knowledge becomes \"one's own\"",
    emoji: "📚",
    duration: 26000
  },
  {
    id: 11,
    title: "The Logic of Effective Learning",
    content: "**Step 1: Analog Experience**\n\nCreate a situation where the student:\n• Feels the problem\n• Acts\n• Experiences\n\n**Step 2: Digital Label**\n\nAt the moment of peak experience, give:\n• Name\n• Formula\n• Rule\n\n**Step 3: Resonance!**\n\nLiving experience connects with abstract sign — the \"Wow!\" effect.\n\n**The Teacher's Task:**\n\n> Not to transmit information, but to **organize a meeting** between the student's analog experience and the digital label of knowledge.",
    emoji: "🎓",
    duration: 28000
  },
  {
    id: 12,
    title: "Conclusion: Thought as Encounter",
    content: "**We Are Resonators**\n\nWe are not processors coldly sorting through data. We are **unique resonators of meaning**.\n\n**Thoughts Are Gifts**\n\nOur thoughts are gifts that we discover within ourselves when a signal finds response in our experience.\n\n> *Care for the richness of your analog world: Fill it with diverse experience, deep feelings, bold actions. And then more and more thoughts will find their resonance in you, and you — your unique place and purpose in the world.*\n\n**Thank you for your attention.**",
    emoji: "🌟",
    duration: 30000
  }
];

export default function Lesson8Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_8_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson8/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        // Fallback to timer-based advancement
        const duration = LESSON_8_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_8_SLIDES[currentSlide].duration;
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

  const currentSlideData = LESSON_8_SLIDES[currentSlide];

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
              <p className="text-stone-400 text-sm">Lecture VIII</p>
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
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {LESSON_8_SLIDES.map((slide, index) => (
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
              href="/lessons/7"
              className="hover:text-white transition"
            >
              ← Lecture VII: The Fair and the Coin
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture VIII</span>
            <Link 
              href="/lessons/9"
              className="hover:text-white transition"
            >
              Lecture IX: Creation of the World →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
