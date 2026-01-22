// Pure Presentation Lesson 2 - 12+ Animated Slides
// Voice narration separate from visual presentation

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// 12+ SLIDES WITH ANIMATED PRESENTATIONS
const PRESENTATION_SLIDES = [
  {
    id: 1,
    title: "🔢 From Terms to Counting",
    // 🎙️ Voice-only content (NOT displayed)
    voiceNarration: `You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next?

Next — we'll learn to count.

Of course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it.

But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.`,
    
    // 🖼️ Visual presentation only
    visual: {
      animation: "pencil-counting",
      elements: ["✏️", "✏️", "✏️", "👉", "👉", "👉", "1️⃣", "2️⃣", "3️⃣"],
      colors: ["from-amber-400", "to-orange-500"],
      theme: "amber"
    }
  },
  
  {
    id: 2,
    title: "📦 Identifying Term Groups",
    voiceNarration: `So, where did we stop? We had a drawing: circle, chords, radii, diameters.

Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group.

And immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?`,
    
    visual: {
      animation: "group-formation",
      elements: ["🔘", "🔘", "🔘", "📦", "🔵", "🟢", "🟣"],
      colors: ["from-blue-400", "to-purple-500"],
      theme: "blue"
    }
  },
  
  {
    id: 3,
    title: "🧮 Understanding Counting",
    voiceNarration: `Put three pencils on the table. If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted.

In word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?`,
    
    visual: {
      animation: "number-reveal",
      elements: ["🧮", "1️⃣", "2️⃣", "3️⃣", "🔢"],
      colors: ["from-yellow-400", "to-orange-500"],
      theme: "yellow"
    }
  },
  
  {
    id: 4,
    title: "🎯 The Counting Paradox",
    voiceNarration: `Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils.

They'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?

Let them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?`,
    
    visual: {
      animation: "paradox-demo",
      elements: ["🤯", "1️⃣", "2️⃣", "3️⃣", "❓"],
      colors: ["from-red-400", "to-pink-500"],
      theme: "red"
    }
  },
  
  {
    id: 5,
    title: "🧒 Learning Requires Patience",
    voiceNarration: `But remember how your baby learned to walk. You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step...

Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.`,
    
    visual: {
      animation: "patience-cycle",
      elements: ["😊", "👏", "🌟", "👣", "❤️"],
      colors: ["from-green-400", "to-teal-500"],
      theme: "green"
    }
  },
  
  {
    id: 6,
    title: "📘 Defining the Counting Process",
    voiceNarration: `What is counting then?

Show one pencil and say: 'This is one pencil.' Ask: which word here is extra? Good if child guesses: word 'one.' 'Pencil' is already singular. Adding that it's one — unnecessary.

Now lift three pencils and say: 'These are pencils.' Then lift five: 'And these are pencils.' But quantities in first and second cases — different. If we say 'pencils' (plural), then need to describe their quantity. Description of quantity is counting.`,
    
    visual: {
      animation: "definition-process",
      elements: ["📘", "1️⃣", "3️⃣", "5️⃣", "✏️"],
      colors: ["from-indigo-400", "to-purple-500"],
      theme: "indigo"
    }
  },
  
  {
    id: 7,
    title: "📦 Groups and Their Quantities",
    voiceNarration: `But description of quantity of what and where?

Take three pencils, two pens and one marker. Ask: how many pencils here? Child answers: 'Three.' How many pens? 'Two.' How many markers? 'One.' How many items total? 'Six!'

Why each time different answers? Because spoke about different names: first — pencils, then — pens, then — markers, and finally — items.

Set of identically named items is called group.

Unification of identically named items — grouping.

Description of quantity of items in group — this is counting.`,
    
    visual: {
      animation: "group-quantities",
      elements: ["📦", "✏️", "🖊️", "🖍️", "1️⃣", "2️⃣", "3️⃣"],
      colors: ["from-purple-400", "to-pink-500"],
      theme: "purple"
    }
  },
  
  {
    id: 8,
    title: "🔤 Numerals and Digits Defined",
    voiceNarration: `Term denoting result of counting — numeral.

Symbol denoting numeral — digit.

Need to add: there are countable and uncountable groups. Uncountable — for example, stars in sky or leaves in forest. We say about them 'many,' but don't count individually.

How to describe quantity of units in countable group? Simplest way — counting on fingers.`,
    
    visual: {
      animation: "numeral-definition",
      elements: ["🔤", "1️⃣", "2️⃣", "3️⃣", "V", "五"],
      colors: ["from-pink-400", "to-rose-500"],
      theme: "pink"
    }
  },
  
  {
    id: 9,
    title: "✋ Finger Counting Method",
    voiceNarration: `When your child was three years old, they knew how to count on fingers. Check if they forgot how it's done. Put three pencils in front and ask to count them on fingers.

They'll probably start bending fingers and saying: 'One, two...' Stop them. They're counting fingers, but need to count pencils. They'll start pointing at pencils with finger, saying: 'One, two...' Stop again. They're counting with fingers, but need — on fingers.

Child is confused. Remind: on fingers count those who don't know numerals yet. That is — silently. Put aside one pencil — bend one finger. Put aside another pencil — bend another finger. Until get group of fingers equal to countable group. This we demonstrate, saying: 'This many!'`,
    
    visual: {
      animation: "finger-counting",
      elements: ["✋", "👆", "👆", "👆", "1️⃣", "2️⃣", "3️⃣"],
      colors: ["from-rose-400", "to-red-500"],
      theme: "rose"
    }
  },
  
  {
    id: 10,
    title: "🧮 Traditional Counting Systems",
    voiceNarration: `How many can count on fingers of one hand? Five. Can more? Can. How?

Child puzzled? Help. Hint: thumb marked phalanges of four remaining fingers. Resulting quantity was called dozen. Today this is twelve. 12 hours on clock face, 12 months in year... All from dozen.

On fingers of two hands? Child will say: twenty-four. That is, two dozens. But in old times could count on two hands up to five dozens. On one hand counted dozen, on other bent one finger. Another dozen — another finger... Five dozens called copeck. Today this quantity — sixty.`,
    
    visual: {
      animation: "traditional-systems",
      elements: ["🧮", "5️⃣", "12️⃣", "24️⃣", "60️⃣"],
      colors: ["from-orange-400", "to-amber-500"],
      theme: "orange"
    }
  },
  
  {
    id: 11,
    title: "六十 Sexagesimal System Legacy",
    voiceNarration: `In old times sexagesimal system was widespread. It remained on clocks: 60 seconds — minute, 60 minutes — hour. Sixtieth part of whole was called copeck — from word 'cope'. Maybe that's why hundredth part of ruble is still called copeck.

Can more than copeck? Can. Let child guess. If can't — hint: dozen counted on one hand, mark on second not whole finger, but phalanx. Get dozen dozens. This was called gross. Today this is 144. And there was dozen grosses — mass. This is 1728.`,
    
    visual: {
      animation: "sexagesimal-legacy",
      elements: ["六十", "60️⃣", "144️⃣", "1728️⃣", "⏰"],
      colors: ["from-amber-400", "to-yellow-500"],
      theme: "amber"
    }
  },
  
  {
    id: 12,
    title: "📏 Counting Sticks Technique",
    voiceNarration: `But in school haven't counted on fingers for long. Remember first grade. Counted with counting sticks. Notice: counted not sticks, but with sticks. How?

'Children, picture has many birds. Count them. Count like this: one bird — put aside one stick. Another bird — put aside another stick. And so, until count all. Now — show how many birds total? Right, as many as you have sticks. Sticks you can take and show mom. And mom will know how many birds there were.'

To count — means to describe quantity of units in given group.`,
    
    visual: {
      animation: "stick-counting",
      elements: ["📏", "￨", "￨", "￨", "￨", "￨", "🐦"],
      colors: ["from-lime-400", "to-green-500"],
      theme: "lime"
    }
  }
];

export default function PurePresentationLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceIndicator, setShowVoiceIndicator] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSlideData = PRESENTATION_SLIDES[currentSlide];

  // Auto-advance slides (presentation mode)
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Advance to next slide after duration
    const slideTimer = setTimeout(() => {
      if (currentSlide < PRESENTATION_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 5000); // 5 seconds per slide for presentation

    slideTimerRef.current = slideTimer;

    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying]);

  const renderAnimatedSlide = () => {
    const visual = currentSlideData.visual;
    
    // Different animations based on slide type
    switch(visual.animation) {
      case 'pencil-counting':
        return (
          <div className={`text-center p-12 bg-gradient-to-br ${visual.colors[0]} ${visual.colors[1]} rounded-3xl shadow-2xl border-4 border-white/30`}>
            <div className="text-8xl mb-8 animate-bounce">✏️✏️✏️</div>
            <div className="text-6xl mb-8 animate-pulse">👉👉👉</div>
            <div className="flex justify-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl animate-fadeIn">
                1️⃣
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl animate-fadeIn" style={{animationDelay: '0.3s'}}>
                2️⃣
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl animate-fadeIn" style={{animationDelay: '0.6s'}}>
                3️⃣
              </div>
            </div>
          </div>
        );
      
      case 'group-formation':
        return (
          <div className={`text-center p-12 bg-gradient-to-br ${visual.colors[0]} ${visual.colors[1]} rounded-3xl shadow-2xl border-4 border-white/30`}>
            <div className="text-7xl mb-8">🔘🔘🔘</div>
            <div className="text-8xl mb-8 animate-spin">📦</div>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="w-8 h-8 bg-white/30 rounded-full animate-bounce"></div>
              <div className="w-8 h-8 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-8 h-8 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <div className="flex justify-center space-x-3 text-4xl">
              <div>🔵</div>
              <div>🟢</div>
              <div>🟣</div>
            </div>
          </div>
        );
      
      case 'number-reveal':
        return (
          <div className={`text-center p-12 bg-gradient-to-br ${visual.colors[0]} ${visual.colors[1]} rounded-3xl shadow-2xl border-4 border-white/30`}>
            <div className="text-9xl mb-8 animate-spin">🧮</div>
            <div className="flex justify-center space-x-8 mb-8">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl animate-bounce">1️⃣</div>
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl animate-bounce" style={{animationDelay: '0.3s'}}>2️⃣</div>
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl animate-bounce" style={{animationDelay: '0.6s'}}>3️⃣</div>
            </div>
            <div className="text-6xl animate-pulse">🔢</div>
          </div>
        );
      
      case 'paradox-demo':
        return (
          <div className={`text-center p-12 bg-gradient-to-br ${visual.colors[0]} ${visual.colors[1]} rounded-3xl shadow-2xl border-4 border-white/30`}>
            <div className="text-8xl mb-8 animate-spin">🤯</div>
            <div className="flex justify-center space-x-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-3xl text-4xl font-bold shadow-2xl hover:bg-red-500/30 transition-colors">1️⃣</div>
              <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-3xl text-4xl font-bold shadow-2xl hover:bg-yellow-500/30 transition-colors">2️⃣</div>
              <div className="bg-white/20 backdrop-blur-sm px-8 py-4 rounded-3xl text-4xl font-bold shadow-2xl hover:bg-green-500/30 transition-colors">3️⃣</div>
            </div>
            <div className="text-6xl animate-pulse">❓</div>
          </div>
        );
      
      case 'patience-cycle':
        return (
          <div className={`text-center p-12 bg-gradient-to-br ${visual.colors[0]} ${visual.colors[1]} rounded-3xl shadow-2xl border-4 border-white/30`}>
            <div className="text-8xl mb-8">🧒</div>
            <div className="flex justify-center space-x-6 mb-8 text-5xl">
              <div className="animate-bounce">😊</div>
              <div className="animate-pulse">👏</div>
              <div className="animate-bounce" style={{animationDelay: '0.5s'}}>🌟</div>
            </div>
            <div className="flex justify-center space-x-4 text-4xl">
              <div>👣</div>
              <div>❤️</div>
            </div>
          </div>
        );
      
      // Additional cases for remaining slide types
      default:
        return (
          <div className={`text-center p-12 bg-gradient-to-br ${visual.colors[0]} ${visual.colors[1]} rounded-3xl shadow-2xl border-4 border-white/30`}>
            <div className="text-8xl mb-8">
              {visual.elements[0]}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              {visual.elements.slice(1, 6).map((element, index) => (
                <div key={index} className="text-4xl animate-pulse" style={{animationDelay: `${index * 0.2}s`}}>
                  {element}
                </div>
              ))}
            </div>
            <div className="text-6xl">
              {visual.elements[6] || '✨'}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header with Voice Indicator */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentSlideData.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-300">Slide {currentSlide + 1} of {PRESENTATION_SLIDES.length}</p>
                {showVoiceIndicator && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-300 text-sm font-medium">🎙️ Voice Active</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowVoiceIndicator(!showVoiceIndicator)}
                className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-gray-300"
              >
                {showVoiceIndicator ? 'Hide Voice Indicator' : 'Show Voice Indicator'}
              </button>
              <Link 
                href="/lessons" 
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-gray-300"
              >
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Presentation Area */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* FULL SCREEN ANIMATED SLIDE */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/20 overflow-hidden">
          <div className="p-16">
            {renderAnimatedSlide()}
          </div>
          
          {/* Slide Progress Bar */}
          <div className="px-16 pb-8">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${((currentSlide + 1) / PRESENTATION_SLIDES.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Presentation Controls */}
        <div className="mt-12 bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-xl ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                <span className="text-3xl">{isPlaying ? '⏸️' : '▶️'}</span>
                {isPlaying ? 'Pause Presentation' : 'Start Presentation'}
              </button>
              
              <div className="text-center">
                <div className="text-gray-300 text-sm">Progress</div>
                <div className="text-2xl font-bold text-white">
                  {currentSlide + 1}/{PRESENTATION_SLIDES.length}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(PRESENTATION_SLIDES.length - 1, currentSlide + 1))}
              disabled={currentSlide === PRESENTATION_SLIDES.length - 1}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              {currentSlide === PRESENTATION_SLIDES.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
          
          {/* Slide Navigation Dots */}
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            {PRESENTATION_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-5 h-5 rounded-full transition-all transform hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg scale-125' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Voice Narration Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎙️</span>
            <h3 className="text-xl font-bold text-white">Voice Narration</h3>
          </div>
          <p className="text-gray-300 mb-4">
            The voice narration runs separately from the visual presentation. The text being read aloud is not displayed on screen to maintain focus on the animated slides.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-cyan-400 font-bold mb-1">🎙️ Voice Stream</div>
              <div className="text-gray-400">Full narration content for audio synthesis</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-purple-400 font-bold mb-1">🖼️ Visual Stream</div>
              <div className="text-gray-400">Pure animated slide presentations</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-green-400 font-bold mb-1">🔄 Synchronization</div>
              <div className="text-gray-400">Both streams progress in parallel</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}