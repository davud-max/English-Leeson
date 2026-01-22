// Simple Working Lesson - Minimal Approach
// Just working slides with basic functionality

'use client'

import { useState } from 'react'
import Link from 'next/link'

// Simple slide data
const SIMPLE_SLIDES = [
  { id: 1, title: "Start Learning", emoji: "🎓", color: "blue" },
  { id: 2, title: "Observe Carefully", emoji: "👁️", color: "green" },
  { id: 3, title: "Ask Questions", emoji: "❓", color: "yellow" },
  { id: 4, title: "Find Patterns", emoji: "🔄", color: "purple" },
  { id: 5, title: "Group Items", emoji: "📦", color: "red" },
  { id: 6, title: "Count Objects", emoji: "🔢", color: "orange" },
  { id: 7, title: "Describe Results", emoji: "📝", color: "pink" },
  { id: 8, title: "Share Knowledge", emoji: "🤝", color: "indigo" }
];

export default function SimpleWorkingLesson() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  
  const currentSlideData = SIMPLE_SLIDES[currentSlide];

  // Simple auto-progress
  const nextSlide = () => {
    if (currentSlide < SIMPLE_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setIsAutoPlay(false);
    }
  };

  // Auto-play handler
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
    if (!isAutoPlay) {
      const interval = setInterval(() => {
        if (currentSlide < SIMPLE_SLIDES.length - 1) {
          setCurrentSlide(prev => prev + 1);
        } else {
          clearInterval(interval);
          setIsAutoPlay(false);
        }
      }, 3000);
      
      // Clean up on unmount or when stopped
      return () => clearInterval(interval);
    }
  };

  // Color mapping
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-cyan-600',
      green: 'from-green-500 to-emerald-600', 
      yellow: 'from-yellow-500 to-amber-600',
      purple: 'from-purple-500 to-fuchsia-600',
      red: 'from-red-500 to-pink-600',
      orange: 'from-orange-500 to-red-600',
      pink: 'from-pink-500 to-rose-600',
      indigo: 'from-indigo-500 to-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Simple Lesson Presenter
            </h1>
            <Link 
              href="/lessons" 
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-colors"
            >
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Slide Display */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/20 overflow-hidden mb-8">
          <div className="p-16">
            <div className={`text-center p-12 bg-gradient-to-br ${getColorClasses(currentSlideData.color)} rounded-2xl shadow-xl`}>
              <div className="text-9xl mb-8 animate-pulse">
                {currentSlideData.emoji}
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                {currentSlideData.title}
              </h2>
              <div className="text-white/80">
                Slide {currentSlide + 1} of {SIMPLE_SLIDES.length}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all hover:scale-105"
            >
              ← Previous
            </button>
            
            <button
              onClick={toggleAutoPlay}
              className={`px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 ${
                isAutoPlay 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              }`}
            >
              {isAutoPlay ? '⏹️ Stop Auto' : '▶️ Auto Play'}
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === SIMPLE_SLIDES.length - 1}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all hover:scale-105"
            >
              {currentSlide === SIMPLE_SLIDES.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentSlide + 1) / SIMPLE_SLIDES.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Slide Navigation */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {SIMPLE_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 scale-125 shadow-lg' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Simple Lesson Status</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">{SIMPLE_SLIDES.length}</div>
                <div className="text-gray-300 text-sm">Total Slides</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{currentSlide + 1}</div>
                <div className="text-gray-300 text-sm">Current Slide</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {isAutoPlay ? '▶️' : '⏸️'}
                </div>
                <div className="text-gray-300 text-sm">Auto Play</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}