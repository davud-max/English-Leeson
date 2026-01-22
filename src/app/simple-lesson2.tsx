// Simple Working Lesson 2 Page
'use client'

import { useState } from 'react'

const SLIDES = [
  {
    id: 1,
    title: "🔢 From Term to Counting",
    content: [
      "You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next?",
      "Next — we'll learn to count.",
      "Of course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it.",
      "But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure."
    ],
    emoji: "🔢",
    illustration: "counting-intro"
  },
  {
    id: 2,
    title: "📦 Groups of Terms",
    content: [
      "So, where did we stop? We had a drawing: circle, chords, radii, diameters.",
      "Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing?",
      "At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points.",
      "Set of identical terms forms a group. And immediately new question arises — how many are in the group?"
    ],
    emoji: "📦",
    illustration: "term-groups"
  },
  {
    id: 3,
    title: "🧮 What is Counting?",
    content: [
      "Put three pencils on the table. If person is nearby, you just point — and they see how many.",
      "But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity.",
      "And for this they need to be counted.",
      "In word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair."
    ],
    emoji: "🧮",
    illustration: "what-is-counting"
  },
  {
    id: 4,
    title: "🎯 Counting Paradox",
    content: [
      "Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: 'Three.'",
      "But ask them to actually count. Count exactly these pencils.",
      "They'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil.",
      "Ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?"
    ],
    emoji: "🎯",
    illustration: "counting-paradox"
  },
  {
    id: 5,
    title: "🧒 Patience in Learning",
    content: [
      "But remember how your baby learned to walk. You didn't yell at them when nothing worked out.",
      "You helped again and again, comforting after each failure. And how you rejoiced at first independent step!",
      "You didn't hide this joy. And baby felt it, and strained to take another step...",
      "Let your child now be ten years old, fifteen... They — still the same baby."
    ],
    emoji: "🧒",
    illustration: "learning-patience"
  }
];

export default function SimpleLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = SLIDES[currentSlide];

  const renderIllustration = () => {
    switch(slide.illustration) {
      case 'counting-intro':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-4 border-dashed border-amber-300">
            <div className="text-7xl mb-6">✏️✏️✏️</div>
            <div className="text-5xl mb-6 animate-pulse">👉👉👉</div>
            <div className="flex justify-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-xl text-2xl font-bold shadow-lg hover:bg-amber-50 transition-colors">1️⃣</div>
              <div className="bg-white px-4 py-2 rounded-xl text-2xl font-bold shadow-lg hover:bg-amber-50 transition-colors">2️⃣</div>
              <div className="bg-white px-4 py-2 rounded-xl text-2xl font-bold shadow-lg hover:bg-amber-50 transition-colors">3️⃣</div>
            </div>
            <div className="mt-6 text-green-800 font-bold text-lg">Counting Introduction</div>
          </div>
        );
      
      case 'term-groups':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-4 border-dashed border-blue-300">
            <div className="text-6xl mb-6">🔘🔘🔘</div>
            <div className="text-7xl mb-6">📦</div>
            <div className="flex justify-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-6 h-6 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-6 h-6 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <div className="text-green-800 font-bold text-lg">Term Groups</div>
          </div>
        );
      
      case 'what-is-counting':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-dashed border-yellow-300">
            <div className="text-8xl mb-6">🧮</div>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl hover:scale-110 transition-transform">1</div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl hover:scale-110 transition-transform">2</div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl hover:scale-110 transition-transform">3</div>
            </div>
            <div className="text-green-800 font-bold text-lg">What is Counting?</div>
          </div>
        );
      
      case 'counting-paradox':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl border-4 border-dashed border-red-300">
            <div className="text-7xl mb-6 animate-spin">🤯</div>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="bg-white px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl hover:bg-red-100 transition-colors">1️⃣</div>
              <div className="bg-white px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl hover:bg-yellow-100 transition-colors">2️⃣</div>
              <div className="bg-white px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl hover:bg-green-100 transition-colors">3️⃣</div>
            </div>
            <div className="text-green-800 font-bold text-lg">Counting Paradox</div>
          </div>
        );
      
      case 'learning-patience':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl border-4 border-dashed border-green-300">
            <div className="text-7xl mb-6">🧒</div>
            <div className="flex justify-center space-x-4 mb-6 text-4xl">
              <div className="animate-bounce">😊</div>
              <div className="animate-pulse">👏</div>
              <div className="animate-bounce" style={{animationDelay: '0.5s'}}>🌟</div>
            </div>
            <div className="text-green-800 font-bold text-lg">Learning Patience</div>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300">
            <div className="text-8xl mb-6">{slide.emoji}</div>
            <div className="text-green-800 font-bold text-lg">
              {slide.illustration.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-3 transform hover:scale-105 transition-transform">
                {slide.title}
              </h1>
              <p className="text-green-100 text-lg">Slide {currentSlide + 1} of {SLIDES.length}</p>
            </div>
            <a 
              href="/lessons" 
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
            >
              ← Back to Lessons
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Visual Illustration */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full border-4 border-green-200 hover:shadow-3xl transition-all">
              <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Visual Demo</h2>
              {renderIllustration()}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-200 hover:shadow-3xl transition-all">
              <div className="space-y-6">
                {slide.content.map((paragraph, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-400 hover:shadow-md transition-all hover:translate-x-2"
                  >
                    <p className="text-gray-800 leading-relaxed text-lg">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-8 py-4 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <div className="text-lg font-bold text-green-800 mb-2">Progress</div>
              <div className="text-2xl font-mono text-green-600 bg-green-50 px-4 py-2 rounded-full">
                {currentSlide + 1} / {SLIDES.length}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(SLIDES.length - 1, currentSlide + 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              {currentSlide === SLIDES.length - 1 ? 'Complete Lesson' : 'Next →'}
            </button>
          </div>
          
          {/* Slide Navigation Dots */}
          <div className="mt-8 flex justify-center gap-3">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-5 h-5 rounded-full transition-all transform hover:scale-125 ${
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