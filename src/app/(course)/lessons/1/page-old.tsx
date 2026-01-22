'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_1_SLIDES = [
  {
    id: 1,
    title: "🎯 Terms and Definitions",
    content: "🧠 **How precise knowledge is born**\n\nHow observation transforms into words,\nand words into instruments of thought.",
    emoji: "🎯",
    illustration: "mind-mapping",
    duration: 8000 // 8 seconds
  },
  {
    id: 2,
    title: "🔍 From Observation to Term",
    content: "👁️ **Everything begins with observation**\n\nWhat we observe must be described clearly\nso others can understand exactly what we see.",
    emoji: "🔍",
    illustration: "eye-observation",
    duration: 10000 // 10 seconds
  },
  {
    id: 3,
    title: "📝 What is a Definition?",
    content: "> 📘 **DEFINITION**\n> The shortest description that helps\n> someone else understand what you observed",
    emoji: "📘",
    illustration: "dictionary",
    duration: 8000
  },
  {
    id: 4,
    title: "🏷️ What is a Term?",
    content: "> 🏷️ **TERM**\n> A word linked to a definition\n> for easier use and communication",
    emoji: "🏷️",
    illustration: "tag-label",
    duration: 7000
  },
  {
    id: 5,
    title: "📍 The Point Concept",
    content: "📍 **POINT** - Fundamental term\n0️⃣ Zero dimensions\n👻 Cannot be observed\n\nJust an idea in our minds!",
    emoji: "📍",
    illustration: "geometric-point",
    duration: 9000
  },
  {
    id: 6,
    title: "📏 The Line Concept",
    content: "📏 **LINE** - First-level term\n1️⃣ One dimension\n➡️ A point that extends\n\nMade of infinite unobservable points!",
    emoji: "📏",
    illustration: "straight-line",
    duration: 10000
  },
  {
    id: 7,
    title: "📐 The Plane Concept",
    content: "📐 **PLANE** - Second-level term\n2️⃣ Two dimensions\n↔️ Lines extending sideways\n\nLike an infinite flat surface!",
    emoji: "📐",
    illustration: "geometric-plane",
    duration: 9000
  },
  {
    id: 8,
    title: "🌌 The Space Concept",
    content: "🌌 **SPACE** - Third-level term\n3️⃣ Three dimensions\n↕️ Planes extending in all directions\n\nThe vast container of everything!",
    emoji: "🌌",
    illustration: "three-dimensional-space",
    duration: 10000
  },
  {
    id: 9,
    title: "🔑 Four Fundamental Terms",
    content: "📍 POINT (0D)\n📏 LINE (1D)\n📐 PLANE (2D)\n🌌 SPACE (3D)\n\nThese building blocks create all abstract ideas!",
    emoji: "🔑",
    illustration: "four-elements",
    duration: 12000
  },
  {
    id: 10,
    title: "⚖️ Key Distinction",
    content: "🎨 Abstract objects:\n✅ Can be fully described and defined\n\n🌍 Real objects:\n❌ Cannot be completely described\n\nReality is infinitely complex!",
    emoji: "⚖️",
    illustration: "balance-scale",
    duration: 11000
  },
  {
    id: 11,
    title: "🏷️ vs 📘 Name vs Term",
    content: "> 🏷️ **NAME**\n> 👉 Points to real things\n> ❌ Cannot be fully described\n\n> 📘 **TERM**\n> ❌ Cannot point to anything\n> ✅ Can be fully described",
    emoji: "🆚",
    illustration: "name-vs-term",
    duration: 12000
  },
  {
    id: 12,
    title: "🔄 Two Directions of Thinking",
    content: "**🌍 Reality → Abstraction**\n👁️ Observe → 📝 Describe → 📘 Define → 🏷️ Term\n\n**🧠 Abstraction → Reality**\n🏷️ Term → 🔍 Find matching objects",
    emoji: "🔄",
    illustration: "two-directions",
    duration: 13000
  },
  {
    id: 13,
    title: "👶 Learning Process Example",
    content: "🍎 Child sees red apple\n\"This is apple\"\n\n🍏 Show green apple\nChild: \"Not apple!\"\n\n⏳ Later understands\n\"Apple\" = general concept",
    emoji: "👶",
    illustration: "child-learning",
    duration: 12000
  },
  {
    id: 14,
    title: "🌱 Birth of Abstraction",
    content: "🧠 Child forms \"🍎 apple in general\"\n\nThis mental image becomes an abstraction\n\nNow recognizes any apple instantly!\n\nThe word transforms from name to term",
    emoji: "🌱",
    illustration: "brain-connection",
    duration: 13000
  },
  {
    id: 15,
    title: "🎓 Essence of Education",
    content: "> 🎓 **THE ESSENCE OF EDUCATION**\n>\n> Teaching free movement in both directions:\n> 🌍 Reality ⇄ 🧠 Abstraction\n>\n> Developing ability to translate between worlds",
    emoji: "🎓",
    illustration: "education-flow",
    duration: 14000
  },
  {
    id: 16,
    title: "💭 Foundation of Thinking",
    content: "✨ See invisible behind visible\n\n🎯 Find visible forms of invisible ideas\n\n🚀 This dual translation ability\nis the foundation of human thinking!",
    emoji: "💭",
    illustration: "invisible-visible",
    duration: 12000
  }
];

export default function Lesson1Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Calculate total lesson duration
  const totalDuration = LESSON_1_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = `/audio/lesson1/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Set timer for current slide
    slideTimerRef.current = setTimeout(() => {
      if (currentSlide < LESSON_1_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        setIsPlaying(false);
      }
    }, LESSON_1_SLIDES[currentSlide].duration);

    // Update progress
    const startTime = Date.now();
    const slideDuration = LESSON_1_SLIDES[currentSlide].duration;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const slideProgress = Math.min(elapsed / slideDuration, 1);
      setProgress(slideProgress);
      
      // Total progress
      const totalElapsed = totalTimeRef.current + elapsed;
      setTotalProgress(totalElapsed / totalDuration);
    };

    const progressInterval = setInterval(updateProgress, 100);
    
    return () => {
      clearInterval(progressInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying]);

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Audio ended naturally, advance to next slide
      if (currentSlide < LESSON_1_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSlide]);

  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      audioRef.current?.pause();
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
      setIsPlaying(false);
      totalTimeRef.current += LESSON_1_SLIDES[currentSlide].duration * progress;
    } else {
      // Play - audio will be loaded in useEffect
      setIsPlaying(true);
    }
  };

  const goToSlide = (index: number) => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }
    setCurrentSlide(index);
    totalTimeRef.current = LESSON_1_SLIDES.slice(0, index).reduce((sum, slide) => sum + slide.duration, 0);
    
    // Audio will be loaded automatically in useEffect when currentSlide changes
    if (isPlaying) {
      // Let useEffect handle audio loading and playing
    }
  };

  const restartLesson = () => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }
    setCurrentSlide(0);
    setProgress(0);
    setTotalProgress(0);
    totalTimeRef.current = 0;
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Slide {currentSlide + 1} of {LESSON_1_SLIDES.length}
              </span>
              <button 
                onClick={togglePlay}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'} Lecture
              </button>
              <Link href="/checkout" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Enroll Now - $30
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bars */}
          <div className="mb-8 space-y-3">
            {/* Current Slide Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Current Slide Progress</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Total Lesson Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Progress</span>
                <span>{Math.round(totalProgress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalProgress * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Slide Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 md:p-12">
              {/* Slide Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-pulse">{LESSON_1_SLIDES[currentSlide].emoji}</div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {LESSON_1_SLIDES[currentSlide].title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              {/* Slide Content */}
              <div className="text-center mb-8">
                <div className="prose prose-lg max-w-2xl mx-auto
                  prose-headings:text-gray-900
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-strong:text-blue-700 prose-strong:font-semibold
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                  prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:px-6
                  prose-blockquote:not-italic prose-blockquote:font-medium">
                  <ReactMarkdown>{LESSON_1_SLIDES[currentSlide].content}</ReactMarkdown>
                </div>
              </div>

              {/* Illustration Area */}
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 w-full max-w-md border border-blue-100 animate-pulse">
                  <div className="text-center">
                    <div className="text-8xl mb-4 opacity-80">
                      {LESSON_1_SLIDES[currentSlide].emoji}
                    </div>
                    <p className="text-gray-600 font-medium">
                      {LESSON_1_SLIDES[currentSlide].illustration.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="flex justify-center gap-2 mb-6">
                {LESSON_1_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-blue-500 scale-125'
                        : index < currentSlide
                          ? 'bg-green-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={restartLesson}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  🔄 Restart
                </button>
                <button
                  onClick={togglePlay}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Continue'} Lecture
                </button>
              </div>
            </div>
          </div>

          {/* Audio Status */}
          {isPlaying && (
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    🎵 Playing Slide {currentSlide + 1} • Total Time: {Math.floor(totalProgress * totalDuration / 1000)}s
                  </span>
                </div>
                <div className="text-2xl">🔊</div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🚀 Ready to Master Critical Thinking?</h2>
            <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
              Get lifetime access to all 17 interactive lectures with seamless audio synchronization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/checkout" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
              >
                Enroll Now - $30
              </Link>
              <button 
                onClick={togglePlay}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-8 py-4 rounded-xl font-bold transition-all border border-white/30 flex items-center gap-2"
              >
                {isPlaying ? '⏸️ Pause Demo' : '▶️ Start Lecture'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
