'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_8_SLIDES = [
  {
    id: 1,
    title: "🧠 Theory of Cognitive Resonance",
    content: "**👋 Today we will talk about what happens at the very moment when a thought \"comes\" to you.**\n\nNot when you build it brick by brick, but when it arrives suddenly, like an **illumination** ✨.\n\n```\n💡 🎯 ✨\nA Phenomenological Model of Thinking and Development\n```\n\nWhy, out of thousands of possible ideas, does consciousness choose precisely this one? Why does one piece of knowledge remain dead weight, while another lights up the \"Eureka!\" 💡 bulb and changes behavior?",
    emoji: "🧠",
    illustration: "cognitive-resonance",
    duration: 22000
  },
  {
    id: 2,
    title: "🔬 Our Approach",
    content: "**📖 Introduction: How Does Thought Find Us?**\n\nWe will not turn to brain scanners 🔬. We will turn to **inner experience**.\n\nWe will build a **phenomenological model** — a map of how we experience the process of thinking.\n\n```\n🎵 THEORY OF COGNITIVE RESONANCE\n\nA model that places at the center:\n• Not neurons 🧬\n• But YOU yourself 👤\n• Your unique \"I\" ❤️\n• Your feelings and capacity for discovery ✨\n```\n\n🎯 This theory explains the **selective mechanism** of consciousness — why some thoughts become ours, while others pass by unnoticed.",
    emoji: "🔬",
    illustration: "phenomenological-approach",
    duration: 24000
  },
  {
    id: 3,
    title: "🔄 Two Circuits of Consciousness",
    content: "**📖 Part One: Two Circuits of Consciousness**\n\nTo understand the mechanism of thought selection, let us imagine our consciousness consisting of two interconnected but fundamentally different **circuits**.\n\n```\n🌊 ANALOG CIRCUIT          💻 DIGITAL CIRCUIT\n─────────────────────────────────────────────\nWorld of immediate,        World of abstractions,\nbodily, sensory           signs, concepts\nexperience\n\n🍎 Taste of an apple       📝 The word \"apple\"\n🔥 Pain from a burn        💊 Medical term\n☀️ Warmth of the sun       🌡️ Temperature in °C\n😢 Vague longing           📖 \"Melancholy\"\n```\n\nThese two circuits speak **different languages** and have completely different properties!",
    emoji: "🔄",
    illustration: "two-circuits",
    duration: 26000
  },
  {
    id: 4,
    title: "🌊 The Analog Circuit",
    content: "**🌊 ANALOG CIRCUIT — PROTO-KNOWLEDGE**\n\nThis is the world of direct experience. It cannot be transmitted in words — only experienced.\n\n```\n📊 CHARACTERISTICS:\n\n• Language: NOT words, but EXPERIENCES 😌\n• Bandwidth: LOW (dozens of states)\n• But EACH state is:\n  → Deeply rooted 🌳\n  → Energetically saturated ⚡\n  → A life lesson learned 📚\n```\n\n❤️ This is the **inner core**, the **foundation of personality**.\n\n_The taste of grandmother's pie. The first heartbreak. The triumph of a solved problem. Fear of heights. Joy of recognition._\n\n🎯 These experiences **cannot be conveyed** — they can only be **lived through**.",
    emoji: "🌊",
    illustration: "analog-circuit",
    duration: 26000
  },
  {
    id: 5,
    title: "💻 The Digital Circuit",
    content: "**💻 DIGITAL CIRCUIT — INTERFACE**\n\nThis is the world of signs, symbols, abstract concepts.\n\n```\n📊 CHARACTERISTICS:\n\n• Language: Clear, communicable 🗣️\n• Bandwidth: COLOSSAL 🚀\n  (billions of combinations per second)\n• But by itself — EMPTY! 🕳️\n```\n\n**Examples:**\n\n```\n📝 The word \"pain\" — just a set of sounds\n🔢 The digit \"5\" — an abstraction without object\n📖 The formula E=mc² — symbols on paper\n```\n\n⚠️ **KEY INSIGHT:**\n\nThe digital circuit can manipulate **trillions** of combinations, but without connection to the analog — it's just **empty symbol shuffling**.",
    emoji: "💻",
    illustration: "digital-circuit",
    duration: 24000
  },
  {
    id: 6,
    title: "⚡ The Resonance Mechanism",
    content: "**📖 Part Two: The Mechanism of Thinking — Dialogue and Resonance**\n\nWhere is thought born that we recognize as **our own**?\n\n🎯 Thinking is not the work of one circuit. It is a process of **resonant dialogue** between them!\n\n```\n🔄 HOW IT WORKS:\n\n1️⃣ GENERATION\n   Digital circuit proposes variants:\n   \"what if...\", \"this is similar to...\"\n\n2️⃣ PROJECTION\n   Each model is projected onto\n   the analog core\n\n3️⃣ RESONANCE\n   Moment of truth: pattern match!\n\n4️⃣ BIRTH OF THOUGHT\n   Amplified signal breaks through\n   into consciousness\n```",
    emoji: "⚡",
    illustration: "resonance-mechanism",
    duration: 28000
  },
  {
    id: 7,
    title: "✅ Resonance or Not?",
    content: "**🎵 The Decisive Moment**\n\nWhat happens when the digital model meets the analog core?\n\n```\n❌ NO RESONANCE:\n\n   💻 Model doesn't find response\n        ↓\n   📉 Signal fades\n        ↓\n   🗑️ Empty mind game\n   💤 Unimportant information\n```\n\n```\n✅ RESONANCE EXISTS:\n\n   💻 Pattern matches! 🎯\n        ↓\n   📈 Sharp AMPLIFICATION\n        ↓\n   💡 Important thought!\n   ✨ Illumination!\n   ❤️ True desire!\n```\n\n🎼 **FORMULA OF THINKING:**\n\nThe digital system asks questions, while the analog **votes with the resource of attention and emotional energy**. The winner gets the right to become a conscious thought.",
    emoji: "✅",
    illustration: "resonance-result",
    duration: 26000
  },
  {
    id: 8,
    title: "🎸 The Inner Resonator",
    content: "**📖 Part Three: The Inner Resonator and the Birth of Goals**\n\nWhat is this \"analog core\" that resonates so selectively?\n\n🎸 This is our unique **Inner Resonator**, or **cognitive profile**.\n\n```\n🧬 WHAT SHAPES IT:\n\n🧬 HEREDITY\n   Data \"from the manufacturer\" —\n   features of the nervous system\n\n🏛️ CULTURAL CODE\n   Language, values, concepts\n   of society\n\n❤️ PERSONAL EXPERIENCE\n   Every experience, success\n   and failure — tunes the resonator\n```\n\n🎯 Each of us is a **unique instrument** that responds to its own frequencies!",
    emoji: "🎸",
    illustration: "inner-resonator",
    duration: 26000
  },
  {
    id: 9,
    title: "🎯 Birth of Goals",
    content: "**🎯 How Goals Are Born**\n\nIf a thought describes a reality **more preferable** than the current one...\n\n```\n💭 THOUGHT\n   \"It would be good if...\"\n        ↓\n🎵 RESONANCE with analog core\n        ↓\n💖 DESIRE\n   Emotionally charged image\n        ↓\n🏃 ACTION\n   We begin to act\n        ↓\n🎯 GOAL\n   Desire we embody in action\n```\n\n💡 **IMPORTANT CONCLUSION:**\n\n```\n┌─────────────────────────────────────────────────┐\n│  Purposeful activity is not something          │\n│  separate from thinking.                        │\n│                                                 │\n│  It is its DIRECT, NATURAL continuation! 🚀    │\n└─────────────────────────────────────────────────┘\n```",
    emoji: "🎯",
    illustration: "birth-of-goals",
    duration: 24000
  },
  {
    id: 10,
    title: "📚 Pedagogy of Resonance",
    content: "**📖 Part Four: Pedagogy of Resonance — How to Develop Thinking?**\n\nIf thinking is resonance, then how do we develop it?\n\nThe answer becomes **crystal clear**! 💎\n\n```\n🚫 DEAD-END PATH:\n   Traditional memorization\n\n   📥 Loading digital circuit\n      with empty signs\n   ❌ No connection to experience\n   🔇 No material for resonance\n   😴 Student \"doesn't want\" to learn\n```\n\n```\n✅ EFFECTIVE PATH:\n   Learning through experience\n\n   🎭 First: EXPERIENCE\n   🏷️ Then: NAME for it\n   🎵 Powerful RESONANCE!\n   ❤️ Knowledge becomes \"one's own\"\n```",
    emoji: "📚",
    illustration: "pedagogy-resonance",
    duration: 26000
  },
  {
    id: 11,
    title: "🎓 Logic of Effective Learning",
    content: "**🎓 THE LOGIC OF EFFECTIVE LEARNING**\n\n```\n1️⃣ ANALOG EXPERIENCE\n   Create a situation where the student:\n   • Feels the problem 😰\n   • Acts 🏃\n   • Experiences 😮\n\n2️⃣ DIGITAL LABEL\n   At the moment of peak experience,\n   give:\n   • Name 🏷️\n   • Formula 📐\n   • Rule 📜\n\n3️⃣ RESONANCE!\n   Living experience connects with\n   abstract sign.\n   💥 \"WOW!\" effect\n```\n\n👨‍🏫 **THE TEACHER'S TASK:**\n\nNot to transmit information, but to **organize a meeting** between the student's analog experience and the digital label of knowledge.",
    emoji: "🎓",
    illustration: "effective-learning",
    duration: 28000
  },
  {
    id: 12,
    title: "🌟 Conclusion: Thought as Encounter",
    content: "**🌟 Conclusion: Thought as Encounter**\n\n```\n🧠 💡 ❤️\n```\n\n**🎵 WE ARE RESONATORS**\n\nWe are not processors coldly sorting through data. We are **unique resonators of meaning**.\n\n**🎁 THOUGHTS ARE GIFTS**\n\nOur thoughts are gifts that we discover within ourselves when a signal finds response in our experience.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🌟 Care for the richness of your              │\n│     ANALOG world:                               │\n│                                                 │\n│  • Fill it with diverse experience 🌍          │\n│  • Deep feelings ❤️                            │\n│  • Bold actions 🦁                              │\n│                                                 │\n│  And then more and more thoughts will find     │\n│  their resonance in you, and you —             │\n│  your unique place and PURPOSE in the world!   │\n└─────────────────────────────────────────────────┘\n```\n\n🙏 **Thank you for your attention!**",
    emoji: "🌟",
    illustration: "conclusion",
    duration: 30000
  }
];

export default function Lesson8Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  const totalDuration = LESSON_8_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);

    const audioFile = `/audio/lesson8/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [currentSlide, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration || LESSON_8_SLIDES[currentSlide].duration / 1000;
        setProgress((currentTime / duration) * 100);
        
        let previousDuration = 0;
        for (let i = 0; i < currentSlide; i++) {
          previousDuration += LESSON_8_SLIDES[i].duration;
        }
        const currentProgress = previousDuration + (currentTime * 1000);
        setTotalProgress((currentProgress / totalDuration) * 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, totalDuration]);

  const handleAudioEnded = () => {
    if (currentSlide < LESSON_8_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
      setTotalProgress(100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
    if (isPlaying && audioRef.current) {
      const audioFile = `/audio/lesson8/slide${index + 1}.mp3`;
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const currentSlideData = LESSON_8_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        onError={(e) => console.log("Audio error:", e)}
      />
      
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/lessons" className="text-white/70 hover:text-white flex items-center gap-2">
            <span>←</span> Back to Lessons
          </Link>
          <h1 className="text-white font-medium">Lesson 8: Theory of Cognitive Resonance</h1>
          <div className="text-white/70">
            {currentSlide + 1} / {LESSON_8_SLIDES.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Slide Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-6xl">{currentSlideData.emoji}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {currentSlideData.title}
          </h2>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-white/90 leading-relaxed mb-4">{children}</p>,
                strong: ({children}) => <strong className="text-teal-300 font-semibold">{children}</strong>,
                code: ({children}) => (
                  <code className="block bg-black/30 rounded-lg p-4 my-4 text-teal-200 text-sm whitespace-pre-wrap font-mono">
                    {children}
                  </code>
                ),
                ul: ({children}) => <ul className="list-disc list-inside text-white/90 space-y-2">{children}</ul>,
                li: ({children}) => <li className="text-white/90">{children}</li>,
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-white/60 text-sm mb-1">
            <span>Slide Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Total Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white/60 text-sm mb-1">
            <span>Lesson Progress</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="p-3 rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition"
          >
            ⏮️
          </button>
          
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-2xl hover:from-teal-400 hover:to-cyan-400 transition shadow-lg"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={() => goToSlide(Math.min(LESSON_8_SLIDES.length - 1, currentSlide + 1))}
            disabled={currentSlide === LESSON_8_SLIDES.length - 1}
            className="p-3 rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition"
          >
            ⏭️
          </button>
        </div>

        {/* Slide Navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          {LESSON_8_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition ${
                index === currentSlide
                  ? 'bg-teal-500 text-white'
                  : index < currentSlide
                  ? 'bg-teal-500/30 text-white/70'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link 
            href="/lessons/7"
            className="text-white/70 hover:text-white transition"
          >
            ← Lesson 7
          </Link>
          <span className="text-white/50">Theory of Cognitive Resonance</span>
          <Link 
            href="/lessons/9"
            className="text-white/70 hover:text-white transition"
          >
            Lesson 9 →
          </Link>
        </div>
      </footer>
    </div>
  );
}
