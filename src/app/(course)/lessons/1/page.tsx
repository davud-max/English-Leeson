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
    duration: 8000
  },
  {
    id: 2,
    title: "👁️ From Observation to Term",
    content: "🔍 **Everything begins with observation**\n\nClear description is the foundation of understanding.\nFrom seeing to knowing.",
    emoji: "👁️",
    illustration: "observation",
    duration: 7000
  },
  {
    id: 3,
    title: "📘 What is a Definition?",
    content: "📝 **The shortest description**\n\nThat helps others understand what you observed.\nPrecision in communication.",
    emoji: "📘",
    illustration: "definition",
    duration: 8000
  },
  {
    id: 4,
    title: "🏷️ What is a Term?",
    content: "🔗 **A word linked to a definition**\n\nFor easier communication.\nBuilding blocks of thought.",
    emoji: "🏷️",
    illustration: "term",
    duration: 7000
  },
  {
    id: 5,
    title: "⚫ The Point Concept",
    content: "🎯 **A fundamental term**\n\nWith zero dimensions, just an idea in our minds.\nAbstract thinking begins.",
    emoji: "⚫",
    illustration: "point",
    duration: 9000
  },
  {
    id: 6,
    title: "📏 The Line Concept",
    content: "📏 **A first-level term**\n\nWith one dimension, extending infinitely.\nFirst step into geometry.",
    emoji: "📏",
    illustration: "line",
    duration: 8000
  },
  {
    id: 7,
    title: "⬜ The Plane Concept",
    content: "⬜ **A second-level term**\n\nWith two dimensions, like an infinite flat surface.\nExpanding our thinking space.",
    emoji: "⬜",
    illustration: "plane",
    duration: 9000
  },
  {
    id: 8,
    title: "🧊 The Space Concept",
    content: "🧊 **A third-level term**\n\nWith three dimensions, containing everything.\nThe world we live in.",
    emoji: "🧊",
    illustration: "space",
    duration: 8000
  },
  {
    id: 9,
    title: "⚛️ Four Fundamental Terms",
    content: "⚛️ **Point, Line, Plane, Space**\n\nBuilding blocks of abstract ideas.\nFoundation of mathematical thinking.",
    emoji: "⚛️",
    illustration: "fundamental-terms",
    duration: 10000
  },
  {
    id: 10,
    title: "🔑 Key Distinction",
    content: "🔑 **Abstract objects**\n\nCan be fully described.\n**Real objects** cannot.",
    emoji: "🔑",
    illustration: "distinction",
    duration: 8000
  },
  {
    id: 11,
    title: "🏷️ Name vs Term",
    content: "🏷️ **Names** point to real things.\n**Terms** can be fully described but not pointed to.\nUnderstanding the difference.",
    emoji: "🏷️",
    illustration: "name-vs-term",
    duration: 9000
  },
  {
    id: 12,
    title: "🔄 Two Directions",
    content: "🔄 **Reality to Abstraction**\nand back again.\nMovement between worlds.",
    emoji: "🔄",
    illustration: "two-directions",
    duration: 7000
  },
  {
    id: 13,
    title: "🧒 Learning Process",
    content: "🧒 **Child learns**\n\nThat apple means general concept,\nnot just one fruit.",
    emoji: "🧒",
    illustration: "learning-process",
    duration: 8000
  },
  {
    id: 14,
    title: "🧠 Birth of Abstraction",
    content: "🧠 **Mental image forms**\n\nNow any apple is recognized instantly.\nPower of abstract thinking.",
    emoji: "🧠",
    illustration: "abstraction",
    duration: 9000
  },
  {
    id: 15,
    title: "🎯 Essence of Education",
    content: "🎯 **Teaching movement**\n\nBetween reality and abstraction.\nDeveloping thinking capacity.",
    emoji: "🎯",
    illustration: "education",
    duration: 10000
  },
  {
    id: 16,
    title: "🔮 Foundation of Thinking",
    content: "🔮 **Seeing invisible behind visible**\n\nFinding forms of invisible ideas.\nTrue wisdom begins.",
    emoji: "🔮",
    illustration: "foundation",
    duration: 9000
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

  // Handle slide progression based on AUDIO (audio has priority)
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
      if (currentSlide < LESSON_1_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        // Lesson completed
        console.log("🎓 Lesson 1 completed!");
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
    setProgress(0);
    totalTimeRef.current = 0;
    LESSON_1_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_1_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_1_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-orange-600 hover:text-orange-700 font-medium">
              ← All Lessons
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Lesson 1 of 17</span>
              <Link href="/checkout" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Slide Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-orange-100">Slide {currentSlide + 1} of {LESSON_1_SLIDES.length}</p>
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
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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
                  disabled={currentSlide === LESSON_1_SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Slide Navigation */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {LESSON_1_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-orange-600' 
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
            <Link href="/lessons" className="text-gray-600 hover:text-gray-900 font-medium">
              ← All Lessons
            </Link>
            <div className="flex gap-3">
              <Link href="/checkout" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
                Enroll to Continue
              </Link>
            </div>
            <Link href="/lessons/2" className="text-gray-600 hover:text-gray-900 font-medium">
              Lesson 2 →
            </Link>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Master Critical Thinking!</h2>
            <p className="text-orange-100 mb-6 text-lg">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link href="/checkout" className="inline-block bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">
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