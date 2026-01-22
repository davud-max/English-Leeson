// Direct Dual Stream Lesson 2 Implementation
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Dual content structure for each slide
const LESSON_2_DUAL_CONTENT = [
  {
    id: 1,
    title: "🔢 From Term to Counting",
    // 🎙️ VOICE NARRATION CONTENT
    voiceContent: `You taught the child — and yourself — to observe, describe, build definitions and assign terms. What's next?

Next — we'll learn to count.

Of course, you know how to count. But to teach this to the child, you need to understand-remember yourself what this means. And then — learn to explain it.

But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.`,
    
    // 🖼️ VISUAL PRESENTATION CONTENT
    visualContent: {
      mainText: "**From Terms to Counting: The Next Logical Step**",
      bulletPoints: [
        "✅ **Mastered**: Observation → Description → Definitions → Terms",
        "🎯 **Next Step**: Learning to COUNT quantities",
        "❓ **Key Question**: Why do we need counting?",
        "💡 **Motivation**: Understanding the NECESSITY of counting"
      ],
      visualElements: {
        type: "counting-intro",
        emojis: ["🔢", "✏️", "👉", "1️⃣", "2️⃣", "3️⃣"]
      }
    },
    emoji: "🔢",
    duration: 18000
  },
  
  {
    id: 2,
    title: "📦 Groups of Terms",
    voiceContent: `So, where did we stop? We had a drawing: circle, chords, radii, diameters.

Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group.

And immediately new question arises — how many are in the group? How to convey information about quantity to another person? That is — how to describe quantity?`,
    
    visualContent: {
      mainText: "**Identifying Groups of Identical Terms**",
      bulletPoints: [
        "🔍 **Activity**: Examine geometric drawing",
        "🧠 **Recognition**: Identify same terms (chords, radii, points)", 
        "📦 **Grouping**: Similar terms form groups",
        "❓ **New Challenge**: Describing QUANTITY of group members"
      ],
      visualElements: {
        type: "term-groups",
        emojis: ["🔘", "📦", "🔵", "🟢", "🟣"]
      }
    },
    emoji: "📦",
    duration: 20000
  },
  
  {
    id: 3,
    title: "🧮 What is Counting?",
    voiceContent: `Put three pencils on the table. If person is nearby, you just point — and they see how many. But if you went outside and were asked: 'How many pencils were on the table?' — need to describe their quantity. And for this they need to be counted.

In word 'count' — 'co' is prefix, 'unt' is root. In old times word 'cheta' meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?`,
    
    visualContent: {
      mainText: "**The Essence of Counting: Describing Quantity**",
      bulletPoints: [
        "📍 **Local**: Point and show (immediate presence)",
        "📞 **Remote**: Must DESCRIBE quantity verbally", 
        "🧮 **Solution**: Counting = Quantity description method",
        "🔤 **Etymology**: 'Count' = 'Co' (prefix) + 'Unt' (root)"
      ],
      visualElements: {
        type: "what-is-counting",
        emojis: ["🧮", "1️⃣", "2️⃣", "3️⃣", "🔢"]
      }
    },
    emoji: "🧮",
    duration: 18000
  },
  
  {
    id: 4,
    title: "🎯 Counting Paradox",
    voiceContent: `Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: 'Three.' But ask them to actually count. Count exactly these pencils.

They'll start, pointing finger at each: 'One, two, three.' As soon as they point at third pencil and say 'three,' lift this pencil and ask: 'How many is this?' They'll say: 'One.' But why just now they said it was 'three'?

Let them count again. They'll start: 'One, two, three...' As soon as they point at second pencil and say 'two,' stop them. Lift this second pencil and ask: 'How many is this?' They'll say: 'One.' But why before they said it was 'two'?`,
    
    visualContent: {
      mainText: "**The Counting Paradox: Context Dependency**",
      bulletPoints: [
        "👆 **Process**: Counting each object sequentially",
        "🔄 **Paradox**: Same object = Different numbers!", 
        "1️⃣ **First Count**: Object shows '3' when reached",
        "2️⃣ **Second Count**: Same object shows '2' when reached"
      ],
      visualElements: {
        type: "counting-paradox",
        emojis: ["🤯", "1️⃣", "2️⃣", "3️⃣", "❓"]
      }
    },
    emoji: "🎯",
    duration: 25000
  },
  
  {
    id: 5,
    title: "🧒 Patience in Learning",
    voiceContent: `But remember how your baby learned to walk. You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step...

Let your child now be ten years old, fifteen... They — still the same baby. They still need your comfort and your joy for their success.`,
    
    visualContent: {
      mainText: "**The Teacher's Patience: Learning Never Ends**",
      bulletPoints: [
        "👣 **Walking Analogy**: Patient guidance through failures", 
        "😊 **Emotional Support**: Celebrating small victories",
        "🎯 **Growth Mindset**: Same learning process at any age",
        "❤️ **Teacher Role**: Comfort + Encouragement = Success"
      ],
      visualElements: {
        type: "learning-patience",
        emojis: ["😊", "👏", "🌟", "👣", "❤️"]
      }
    },
    emoji: "🧒",
    duration: 20000
  }
];

export default function DirectDualStreamLesson2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStream, setActiveStream] = useState<'voice' | 'visual'>('voice');
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSlideData = LESSON_2_DUAL_CONTENT[currentSlide];

  // Handle slide progression with dual stream awareness
  useEffect(() => {
    if (!isPlaying) return;

    // Alternate between streams every 3 seconds for demonstration
    const streamInterval = setInterval(() => {
      setActiveStream(prev => prev === 'voice' ? 'visual' : 'voice');
    }, 3000);

    // Advance slide based on duration
    const slideTimer = setTimeout(() => {
      if (currentSlide < LESSON_2_DUAL_CONTENT.length - 1) {
        setCurrentSlide(prev => prev + 1);
        setActiveStream('voice');
      } else {
        setIsPlaying(false);
      }
    }, currentSlideData.duration);

    slideTimerRef.current = slideTimer;

    return () => {
      clearInterval(streamInterval);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide, isPlaying, currentSlideData.duration]);

  const renderVisualIllustration = () => {
    const visualType = currentSlideData.visualContent.visualElements.type;
    
    switch(visualType) {
      case 'counting-intro':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-4 border-dashed border-amber-300">
            <div className="text-7xl mb-6">✏️✏️✏️</div>
            <div className="text-5xl mb-6 animate-pulse">👉👉👉</div>
            <div className="flex justify-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-xl text-2xl font-bold shadow-lg">1️⃣</div>
              <div className="bg-white px-4 py-2 rounded-xl text-2xl font-bold shadow-lg">2️⃣</div>
              <div className="bg-white px-4 py-2 rounded-xl text-2xl font-bold shadow-lg">3️⃣</div>
            </div>
            <div className="mt-6 text-green-800 font-bold text-lg">Counting Process Visualization</div>
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
            <div className="text-green-800 font-bold text-lg">Term Grouping Process</div>
          </div>
        );
      
      case 'what-is-counting':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-dashed border-yellow-300">
            <div className="text-8xl mb-6">🧮</div>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl">1</div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl">2</div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl">3</div>
            </div>
            <div className="text-green-800 font-bold text-lg">Counting Demonstration</div>
          </div>
        );
      
      case 'counting-paradox':
        return (
          <div className="text-center p-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl border-4 border-dashed border-red-300">
            <div className="text-7xl mb-6 animate-spin">🤯</div>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="bg-white px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl bg-red-100">1️⃣</div>
              <div className="bg-white px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl bg-yellow-100">2️⃣</div>
              <div className="bg-white px-6 py-3 rounded-2xl text-3xl font-bold shadow-xl bg-green-100">3️⃣</div>
            </div>
            <div className="text-green-800 font-bold text-lg">Counting Paradox Demo</div>
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
            <div className="text-green-800 font-bold text-lg">Learning Patience Cycle</div>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300">
            <div className="text-8xl mb-6">{currentSlideData.emoji}</div>
            <div className="text-green-800 font-bold text-lg">
              {visualType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header with Stream Indicator */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-2 transform hover:scale-105 transition-transform">
                {currentSlideData.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-green-100">Slide {currentSlide + 1} of {LESSON_2_DUAL_CONTENT.length}</p>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  activeStream === 'voice' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {activeStream === 'voice' ? '🎙️ VOICE STREAM' : '🖼️ VISUAL STREAM'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                Dual Content Streams
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
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Visual Presentation Stream */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 h-full border-4 border-green-200 hover:shadow-3xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-green-800">Visual Presentation Stream</h2>
              </div>
              
              {/* Active Stream Highlight */}
              {activeStream === 'visual' && (
                <div className="absolute inset-0 bg-purple-500/10 rounded-3xl border-2 border-purple-400 animate-pulse pointer-events-none"></div>
              )}
              
              <div className="relative">
                {/* Visual Illustration */}
                <div className="mb-6">
                  {renderVisualIllustration()}
                </div>
                
                {/* Visual Content Text */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">
                    {currentSlideData.visualContent.mainText}
                  </h3>
                  <ul className="space-y-3">
                    {currentSlideData.visualContent.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-purple-500 mt-1">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Voice Narration Stream */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-4 border-green-200 hover:shadow-3xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-green-800">Voice Narration Stream</h2>
              </div>
              
              {/* Active Stream Highlight */}
              {activeStream === 'voice' && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-3xl border-2 border-blue-400 animate-pulse pointer-events-none"></div>
              )}
              
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎙️</span>
                    <h3 className="text-xl font-bold text-blue-800">Full Narration Text</h3>
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentSlideData.voiceContent}
                  </div>
                </div>
                
                {/* Audio Controls */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Audio Synchronization</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                        isPlaying 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                    <div className="text-sm text-gray-600">
                      Duration: {Math.round(currentSlideData.duration / 1000)}s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stream Synchronization Controls */}
        <div className="mt-10 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-4 border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Stream Synchronization</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🎙️</div>
              <h3 className="font-bold text-blue-800 mb-2">Voice Stream</h3>
              <p className="text-sm text-blue-600">Full narration content for audio synthesis</p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold text-purple-800 mb-2">Synchronization</h3>
              <p className="text-sm text-purple-600">Both streams progress in parallel</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🖼️</div>
              <h3 className="font-bold text-green-800 mb-2">Visual Stream</h3>
              <p className="text-sm text-green-600">Condensed content for illustrations</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all hover:scale-105 shadow-lg"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Current Stream</div>
                <div className={`font-bold px-3 py-1 rounded-full ${
                  activeStream === 'voice' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {activeStream.toUpperCase()}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(LESSON_2_DUAL_CONTENT.length - 1, currentSlide + 1))}
              disabled={currentSlide === LESSON_2_DUAL_CONTENT.length - 1}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg"
            >
              {currentSlide === LESSON_2_DUAL_CONTENT.length - 1 ? 'Complete Lesson' : 'Next →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}