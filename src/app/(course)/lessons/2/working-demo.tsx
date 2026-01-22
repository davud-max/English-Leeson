// Simple Working Lesson 2 with Visual Illustrations
'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

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

export default function WorkingLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentSlideData = LESSON_2_SLIDES[currentSlide];

  // Simple visual illustration renderer
  const renderIllustration = () => {
    switch(currentSlideData.illustration) {
      case 'counting-intro':
        return (
          <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-2 border-dashed border-amber-300">
            <div className="text-6xl mb-4">✏️✏️✏️</div>
            <div className="text-4xl mb-4">👉👉👉</div>
            <div className="flex justify-center space-x-3">
              <div className="bg-white px-3 py-1 rounded-lg shadow">1️⃣</div>
              <div className="bg-white px-3 py-1 rounded-lg shadow">2️⃣</div>
              <div className="bg-white px-3 py-1 rounded-lg shadow">3️⃣</div>
            </div>
            <div className="mt-4 text-green-800 font-medium">Counting Introduction</div>
          </div>
        );
      
      case 'term-groups':
        return (
          <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-2 border-dashed border-blue-300">
            <div className="text-5xl mb-3">🔘🔘🔘</div>
            <div className="text-6xl mb-3">📦</div>
            <div className="flex justify-center space-x-2 mb-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            </div>
            <div className="text-green-800 font-medium">Term Groups</div>
          </div>
        );
      
      case 'what-is-counting':
        return (
          <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-2 border-dashed border-yellow-300">
            <div className="text-7xl mb-4">🧮</div>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">1</div>
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">2</div>
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">3</div>
            </div>
            <div className="text-green-800 font-medium">What is Counting?</div>
          </div>
        );
      
      case 'counting-paradox':
        return (
          <div className="text-center p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl border-2 border-dashed border-red-300">
            <div className="text-6xl mb-4">🤯</div>
            <div className="flex justify-center space-x-3 mb-4">
              <div className="bg-white px-4 py-2 rounded-lg text-2xl font-bold shadow hover:bg-red-100 transition-colors">1️⃣</div>
              <div className="bg-white px-4 py-2 rounded-lg text-2xl font-bold shadow hover:bg-yellow-100 transition-colors">2️⃣</div>
              <div className="bg-white px-4 py-2 rounded-lg text-2xl font-bold shadow hover:bg-green-100 transition-colors">3️⃣</div>
            </div>
            <div className="text-green-800 font-medium">Counting Paradox</div>
          </div>
        );
      
      case 'learning-patience':
        return (
          <div className="text-center p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl border-2 border-dashed border-green-300">
            <div className="text-6xl mb-4">🧒</div>
            <div className="flex justify-center space-x-3 mb-4 text-3xl">
              <div>😊</div>
              <div className="animate-bounce">👏</div>
              <div>🌟</div>
            </div>
            <div className="text-green-800 font-medium">Learning Patience</div>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-7xl mb-4">{currentSlideData.emoji}</div>
            <div className="text-green-800 font-medium">
              {currentSlideData.illustration.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentSlideData.title}</h1>
              <p className="text-green-100">Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}</p>
            </div>
            <Link 
              href="/lessons" 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors self-start"
            >
              Back to Lessons
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Visual Illustration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full border border-green-200">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Visual Demo</h2>
              {renderIllustration()}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div 
                      key={index}
                      className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
                    >
                      <ReactMarkdown className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-6 py-3 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Slide {currentSlide + 1} of {LESSON_2_SLIDES.length}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(LESSON_2_SLIDES.length - 1, currentSlide + 1))}
              disabled={currentSlide === LESSON_2_SLIDES.length - 1}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {currentSlide === LESSON_2_SLIDES.length - 1 ? 'Complete Lesson' : 'Next →'}
            </button>
          </div>
          
          {/* Slide Navigation Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {LESSON_2_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-green-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}