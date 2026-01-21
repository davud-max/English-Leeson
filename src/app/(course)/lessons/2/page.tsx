'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_2_SLIDES = [
  {
    id: 1,
    title: "🔢 From Term to Number and Counting",
    content: "🧠 **How counting is born**\n\nHow terms multiply and create the need for numbers.\nFrom individual terms to groups, from counting to numbers.",
    emoji: "🔢",
    illustration: "counting-numbers",
    duration: 8000
  },
  {
    id: 2,
    title: "📦 The Need: From Terms to Groups",
    content: "👁️ **Observation:**\nWe have a drawing with circles, centers, chords, radii.\n\n**Question:** Are there identical terms on this drawing?\n\n📦 **GROUP** - Collection of objects designated by one term\nGroup of chords. Group of radii. Group of points.",
    emoji: "📦",
    illustration: "grouping-objects",
    duration: 12000
  },
  {
    id: 3,
    title: "🎯 The Essence of Counting: It's Not What You Think",
    content: "✋ Put three pencils in front of you. Ask a child to count them.\nThey point to the first: One, second: Two, third: Three.\n\n⚠️ **Paradox:** On the word 'Three,' ask: How many pencils is this? They'll say: Three!\n\nBut they just counted THREE pencils by saying the number THREE.",
    emoji: "🎯",
    illustration: "counting-paradox",
    duration: 15000
  },
  {
    id: 4,
    title: "🧠 The Discovery: Counting is Comparison",
    content: "**💡 Insight:**\nThe child compared their group of pencils with an etalon group - their fingers!\n\n🔢 **COUNTING = Comparing one group with another, etalon group**\n\nWe don't count objects directly. We compare our group with a standard group (fingers) and name the result.",
    emoji: "🧠",
    illustration: "comparison-counting",
    duration: 14000
  },
  {
    id: 5,
    title: "🔢 What is a Number?",
    content: "> 📘 **NUMBER**\n> The name of an etalon group\n> Used for comparison with other groups\n\n**Examples:**\n- Finger group = Five\n- Hand group = Five\n- Foot group = Ten (fingers + toes)",
    emoji: "📘",
    illustration: "number-definition",
    duration: 10000
  },
  {
    id: 6,
    title: "🔢 Numerals and Digits",
    content: "**🔢 NUMERAL** - Symbol representing a number\nExamples: 1, 2, 3, 4, 5\n\n**🔢 DIGIT** - Single symbol used in numerals\nDigits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9\n\n**🔢 NUMBER** - The concept, the etalon group\n**NUMERAL** - How we write it\n**DIGIT** - Building blocks of numerals",
    emoji: "🔢",
    illustration: "numerals-digits",
    duration: 13000
  },
  {
    id: 7,
    title: "🧮 Traditional Counting Systems",
    content: "**Dozen** = 12 items\nOrigin: Counting finger segments (3 segments × 4 fingers = 12)\n\n**Score** = 20 items\nOrigin: Counting all fingers and toes\n\n**Gross** = 144 items\nOrigin: 12 dozens (12 × 12)",
    emoji: "🧮",
    illustration: "traditional-systems",
    duration: 12000
  },
  {
    id: 8,
    title: "🧠 Natural Numbers",
    content: "**Natural numbers** = Counting numbers\n1, 2, 3, 4, 5, 6, 7, 8, 9, 10...\n\nThey emerge naturally from our counting algorithm:\n\nTERMIN → GROUP → COUNTING → NUMBER → NATURAL NUMBER",
    emoji: "🧠",
    illustration: "natural-numbers",
    duration: 11000
  },
  {
    id: 9,
    title: "🔄 Two Paths of Thinking",
    content: "**🔬 ANALYSIS PATH**\nFrom concrete to abstract\nReality → Observations → Grouping → Counting → Numbers\n\n**🔧 SYNTHESIS PATH**\nFrom abstract to concrete\nNumbers → Etalon groups → Matching → Finding objects in reality",
    emoji: "🔄",
    illustration: "two-paths",
    duration: 14000
  },
  {
    id: 10,
    title: "🎯 Lesson Summary",
    content: "**We've traced the birth of counting:**\n\nTERMIN → GROUP → COUNTING → NUMBER\n\n**Key insight:** Counting is comparison with etalon groups\n\n**Foundation of mathematics:** From terms to numbers through systematic grouping",
    emoji: "🎯",
    illustration: "lesson-summary",
    duration: 12000
  }
];

export default function Lesson2Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Calculate total lesson duration
  const totalDuration = LESSON_2_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = `/audio/lesson2/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Set timer for current slide
    slideTimerRef.current = setTimeout(() => {
      if (currentSlide < LESSON_2_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        setIsPlaying(false);
      }
    }, LESSON_2_SLIDES[currentSlide].duration);

    // Update progress
    const startTime = Date.now();
    const slideDuration = LESSON_2_SLIDES[currentSlide].duration;
    
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
      if (currentSlide < LESSON_2_SLIDES.length - 1) {
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
      totalTimeRef.current += LESSON_2_SLIDES[currentSlide].duration * progress;
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
    totalTimeRef.current = LESSON_2_SLIDES.slice(0, index).reduce((sum, slide) => sum + slide.duration, 0);
    
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Lesson 2 • Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}
              </span>
              <button 
                onClick={togglePlay}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'} Lecture
              </button>
              <Link href="/checkout" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
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
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
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
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
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
                <div className="text-6xl mb-4 animate-pulse">{LESSON_2_SLIDES[currentSlide].emoji}</div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {LESSON_2_SLIDES[currentSlide].title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
              </div>

              {/* Slide Content */}
              <div className="text-center mb-8">
                <div className="prose prose-lg max-w-2xl mx-auto
                  prose-headings:text-gray-900
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-strong:text-orange-700 prose-strong:font-semibold
                  prose-blockquote:border-l-4 prose-blockquote:border-orange-500 
                  prose-blockquote:bg-orange-50 prose-blockquote:py-3 prose-blockquote:px-6
                  prose-blockquote:not-italic prose-blockquote:font-medium">
                  <ReactMarkdown>{LESSON_2_SLIDES[currentSlide].content}</ReactMarkdown>
                </div>
              </div>

              {/* Illustration Area */}
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 w-full max-w-md border border-orange-100 animate-pulse">
                  <div className="text-center">
                    <div className="text-8xl mb-4 opacity-80">
                      {LESSON_2_SLIDES[currentSlide].emoji}
                    </div>
                    <p className="text-gray-600 font-medium">
                      {LESSON_2_SLIDES[currentSlide].illustration.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="flex justify-center gap-2 mb-6">
                {LESSON_2_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-orange-500 scale-125'
                        : index < currentSlide
                          ? 'bg-yellow-500'
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
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
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
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    🎵 Playing Slide {currentSlide + 1} • Total Time: {Math.floor(totalProgress * totalDuration / 1000)}s
                  </span>
                </div>
                <div className="text-2xl">🔊</div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🚀 Ready to Master Mathematical Thinking?</h2>
            <p className="text-orange-100 mb-6 text-lg max-w-2xl mx-auto">
              Get lifetime access to all 17 interactive lectures with seamless audio synchronization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/checkout" 
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
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