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
    title: "📘 What is a Number?",
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

  // Handle slide progression based on AUDIO (audio has priority)
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

    // Audio duration controls slide timing - no fixed timer needed
    // Slide advances when audio ends (handled in separate audio event listener)

    // Update progress based on actual audio playback
    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(audioRef.current.currentTime / audioRef.current.duration);
        
        // Update total progress based on actual playback time
        const totalElapsed = totalTimeRef.current + (audioRef.current.currentTime * 1000);
        setTotalProgress(totalElapsed / totalDuration);
      }
    };

    const progressInterval = setInterval(updateProgress, 100);
    
    return () => {
      clearInterval(progressInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying, totalDuration]);

  // Handle audio playback events (AUDIO CONTROLS TIMING)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Audio ended naturally - advance to next slide
      console.log(`🎵 Audio ended for slide ${currentSlide + 1}, advancing...`);
      if (currentSlide < LESSON_2_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        console.log("🎓 Lesson 2 completed!");
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    // Add event listeners
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSlide, isPlaying]);

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
    setProgress(0);
    totalTimeRef.current = 0;
    LESSON_2_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_2_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_2_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-yellow-600 hover:text-yellow-700 font-medium">
              ← All Lessons
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Lesson 2 of 17</span>
              <Link href="/checkout" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Enroll Now - $30
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Lesson Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(totalProgress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Slide Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-yellow-100">Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}</p>
                </div>
              </div>
            </div>

            {/* Slide Body */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{currentSlideData.content}</ReactMarkdown>
              </div>

              {/* Slide Progress */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Slide Progress</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-50 px-8 py-6 border-t">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  ← Previous
                </button>

                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_2_SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Slide Navigation */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {LESSON_2_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-yellow-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} />

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Link href="/lessons/1" className="text-gray-600 hover:text-gray-900 font-medium">
              ← Lesson 1
            </Link>
            <div className="flex gap-3">
              <Link href="/checkout" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
                Enroll to Continue
              </Link>
            </div>
            <Link href="/lessons/3" className="text-gray-600 hover:text-gray-900 font-medium">
              Lesson 3 →
            </Link>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-yellow-500 to-amber-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Master Mathematical Thinking!</h2>
            <p className="text-yellow-100 mb-6 text-lg">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link href="/checkout" className="inline-block bg-white text-yellow-600 hover:bg-yellow-50 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">
              Enroll Now - $30
            </Link>
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