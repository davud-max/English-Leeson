// Enhanced Lesson 2 with Visual Illustrations
'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_2_SLIDES = [
  {
    id: 1,
    title: "🔢 From Term to Counting",
    content: "**You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next?**\n\nNext — we'll learn to count.\n\nOf course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it.\n\nBut first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.",
    emoji: "🔢",
    illustration: "counting-intro",
    duration: 18000
  },
  {
    id: 2,
    title: "📦 Groups of Terms",
    content: "**So, where did we stop?** We had a drawing: circle, chords, radii, diameters.\n\nChild already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group.\n\nAnd immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?",
    emoji: "📦",
    illustration: "term-groups",
    duration: 20000
  },
  {
    id: 3,
    title: "🧮 What is Counting?",
    content: "**Put three pencils on the table.** If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted.\n\nIn word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?",
    emoji: "🧮",
    illustration: "what-is-counting",
    duration: 18000
  },
  {
    id: 4,
    title: "🎯 Counting Paradox",
    content: "**Put three pencils in front of child and ask to count them.** Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils.\n\nThey'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?\n\nLet them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?",
    emoji: "🎯",
    illustration: "counting-paradox",
    duration: 25000
  },
  {
    id: 5,
    title: "🧒 Patience in Learning",
    content: "**But remember how your baby learned to walk.** You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step... Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.",
    emoji: "🧒",
    illustration: "learning-patience",
    duration: 20000
  }
];

export default function EnhancedLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  const totalDuration = LESSON_2_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);
  const currentSlideData = LESSON_2_SLIDES[currentSlide];

  // Render visual illustration based on slide type
  const renderIllustration = () => {
    switch(currentSlideData.illustration) {
      case 'counting-intro':
        return (
          <div className="flex flex-col items-center space-y-4 animate-float">
            <div className="flex space-x-3 justify-center">
              {[1, 2, 3].map(num => (
                <div key={num} className="text-5xl transform hover:scale-110 transition-transform duration-200 cursor-pointer">✏️</div>
              ))}
            </div>
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3].map(num => (
                <div key={num} className="text-3xl animate-pulse" style={{animationDelay: `${num * 0.3}s`}}>👉</div>
              ))}
            </div>
            <div className="text-green-800 text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
              Counting Introduction
            </div>
          </div>
        );
      
      case 'term-groups':
        return (
          <div className="flex flex-col items-center space-y-3 animate-fadeIn">
            <div className="flex space-x-2 mb-2">
              <div className="text-2xl bg-blue-500/30 px-2 py-1 rounded">🔘</div>
              <div className="text-2xl bg-green-500/30 px-2 py-1 rounded">🔘</div>
              <div className="text-2xl bg-purple-500/30 px-2 py-1 rounded">🔘</div>
            </div>
            <div className="text-4xl">📦</div>
            <div className="flex space-x-1 justify-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
            <div className="text-green-800 text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
              Term Groups
            </div>
          </div>
        );
      
      case 'what-is-counting':
        return (
          <div className="flex flex-col items-center space-y-4 animate-slideInLeft">
            <div className="text-6xl mb-2">🧮</div>
            <div className="flex space-x-4 justify-center">
              {[1, 2, 3].map(num => (
                <div key={num} className="text-3xl bg-white/80 w-12 h-12 rounded-lg flex items-center justify-center font-bold shadow-md">
                  {num}
                </div>
              ))}
            </div>
            <div className="text-green-800 text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
              What is Counting?
            </div>
          </div>
        );
      
      case 'counting-paradox':
        return (
          <div className="flex flex-col items-center space-y-3 animate-bounceIn">
            <div className="text-5xl mb-2">🤯</div>
            <div className="flex space-x-3 justify-center">
              <div className="text-3xl bg-red-500/30 px-3 py-1 rounded transform hover:scale-110 transition-transform">1️⃣</div>
              <div className="text-3xl bg-yellow-500/30 px-3 py-1 rounded transform hover:scale-110 transition-transform">2️⃣</div>
              <div className="text-3xl bg-green-500/30 px-3 py-1 rounded transform hover:scale-110 transition-transform">3️⃣</div>
            </div>
            <div className="text-green-800 text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
              Counting Paradox
            </div>
          </div>
        );
      
      case 'learning-patience':
        return (
          <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
            <div className="text-5xl mb-2">🧒</div>
            <div className="flex space-x-2 justify-center">
              <div className="text-2xl">😊</div>
              <div className="text-2xl animate-bounce">👏</div>
              <div className="text-2xl">🌟</div>
            </div>
            <div className="text-green-800 text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
              Learning Patience
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-6xl mb-2">{currentSlideData.emoji}</div>
            <div className="text-green-800 text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
              {currentSlideData.illustration.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Animated Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-2 transform hover:scale-105 transition-transform duration-300">
                {currentSlideData.title}
              </h1>
              <p className="text-green-100 animate-pulse">Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-slideInRight">
                Progress: {Math.round(totalProgress * 100)}%
              </div>
              <Link 
                href="/lessons" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Visual Illustration */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 h-full border border-green-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center animate-slideInLeft">Visual Demo</h2>
              <div className="flex justify-center items-center h-80 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border-2 border-dashed border-green-300 hover:border-green-400 transition-colors duration-300">
                {renderIllustration()}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-green-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-white to-green-50 p-4 rounded-xl border-l-4 border-green-400 hover:shadow-md transition-all duration-300 hover:translate-x-2 transform"
                    >
                      <ReactMarkdown className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Progress */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 animate-fadeInUp">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-green-800">📊 Slide Progress</span>
                  <span className="text-sm font-semibold text-green-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-md"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-green-200 hover:shadow-3xl transition-all duration-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              ← Previous
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform ${
                isPlaying 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              }`}
            >
              <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={() => setCurrentSlide(Math.min(LESSON_2_SLIDES.length - 1, currentSlide + 1))}
              disabled={currentSlide === LESSON_2_SLIDES.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Next →
            </button>
          </div>

          {/* Slide Navigation Dots */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center animate-fadeInUp">
            {LESSON_2_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 shadow-md ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg scale-125' 
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}