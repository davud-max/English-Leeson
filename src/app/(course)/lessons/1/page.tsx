import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_1_SLIDES = [
  {
    id: 1,
    title: "🎯 Terms and Definitions",
    content: "🧠 **How precise knowledge is born**\n\nHow observation transforms into words,\nand words into instruments of thought.",
    emoji: "🎯",
    illustration: "mind-mapping"
  },
  {
    id: 2,
    title: "🔍 From Observation to Term",
    content: "👁️ **Everything begins with observation**\n\nWhat we observe must be described clearly\nso others can understand exactly what we see.",
    emoji: "🔍",
    illustration: "eye-observation"
  },
  {
    id: 3,
    title: "📝 What is a Definition?",
    content: "> 📘 **DEFINITION**\n> The shortest description that helps\n> someone else understand what you observed",
    emoji: "📘",
    illustration: "dictionary"
  },
  {
    id: 4,
    title: "🏷️ What is a Term?",
    content: "> 🏷️ **TERM**\n> A word linked to a definition\n> for easier use and communication",
    emoji: "🏷️",
    illustration: "tag-label"
  },
  {
    id: 5,
    title: "📍 The Point Concept",
    content: "📍 **POINT** - Fundamental term\n0️⃣ Zero dimensions\n👻 Cannot be observed\n\nJust an idea in our minds!",
    emoji: "📍",
    illustration: "geometric-point"
  },
  {
    id: 6,
    title: "📏 The Line Concept",
    content: "📏 **LINE** - First-level term\n1️⃣ One dimension\n➡️ A point that extends\n\nMade of infinite unobservable points!",
    emoji: "📏",
    illustration: "straight-line"
  },
  {
    id: 7,
    title: "📐 The Plane Concept",
    content: "📐 **PLANE** - Second-level term\n2️⃣ Two dimensions\n↔️ Lines extending sideways\n\nLike an infinite flat surface!",
    emoji: "📐",
    illustration: "geometric-plane"
  },
  {
    id: 8,
    title: "🌌 The Space Concept",
    content: "🌌 **SPACE** - Third-level term\n3️⃣ Three dimensions\n↕️ Planes extending in all directions\n\nThe vast container of everything!",
    emoji: "🌌",
    illustration: "three-dimensional-space"
  },
  {
    id: 9,
    title: "🔑 Four Fundamental Terms",
    content: "📍 POINT (0D)\n📏 LINE (1D)\n📐 PLANE (2D)\n🌌 SPACE (3D)\n\nThese building blocks create all abstract ideas!",
    emoji: "🔑",
    illustration: "four-elements"
  },
  {
    id: 10,
    title: "⚖️ Key Distinction",
    content: "🎨 Abstract objects:\n✅ Can be fully described and defined\n\n🌍 Real objects:\n❌ Cannot be completely described\n\nReality is infinitely complex!",
    emoji: "⚖️",
    illustration: "balance-scale"
  },
  {
    id: 11,
    title: "🏷️ vs 📘 Name vs Term",
    content: "> 🏷️ **NAME**\n> 👉 Points to real things\n> ❌ Cannot be fully described\n\n> 📘 **TERM**\n> ❌ Cannot point to anything\n> ✅ Can be fully described",
    emoji: "🆚",
    illustration: "name-vs-term"
  },
  {
    id: 12,
    title: "🔄 Two Directions of Thinking",
    content: "**🌍 Reality → Abstraction**\n👁️ Observe → 📝 Describe → 📘 Define → 🏷️ Term\n\n**🧠 Abstraction → Reality**\n🏷️ Term → 🔍 Find matching objects",
    emoji: "🔄",
    illustration: "two-directions"
  },
  {
    id: 13,
    title: "👶 Learning Process Example",
    content: "🍎 Child sees red apple\n\"This is apple\"\n\n🍏 Show green apple\nChild: \"Not apple!\"\n\n⏳ Later understands\n\"Apple\" = general concept",
    emoji: "👶",
    illustration: "child-learning"
  },
  {
    id: 14,
    title: "🌱 Birth of Abstraction",
    content: "🧠 Child forms \"🍎 apple in general\"\n\nThis mental image becomes an abstraction\n\nNow recognizes any apple instantly!\n\nThe word transforms from name to term",
    emoji: "🌱",
    illustration: "brain-connection"
  },
  {
    id: 15,
    title: "🎓 Essence of Education",
    content: "> 🎓 **THE ESSENCE OF EDUCATION**\n>\n> Teaching free movement in both directions:\n> 🌍 Reality ⇄ 🧠 Abstraction\n>\n> Developing ability to translate between worlds",
    emoji: "🎓",
    illustration: "education-flow"
  },
  {
    id: 16,
    title: "💭 Foundation of Thinking",
    content: "✨ See invisible behind visible\n\n🎯 Find visible forms of invisible ideas\n\n🚀 This dual translation ability\nis the foundation of human thinking!",
    emoji: "💭",
    illustration: "invisible-visible"
  }
];

export default function Lesson1Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Аудио файлы для каждого слайда (пока демо)
  const slideAudios = [
    "/audio/lesson1/slide1.mp3",
    "/audio/lesson1/slide2.mp3", 
    "/audio/lesson1/slide3.mp3",
    "/audio/lesson1/slide4.mp3",
    "/audio/lesson1/slide5.mp3",
    "/audio/lesson1/slide6.mp3",
    "/audio/lesson1/slide7.mp3",
    "/audio/lesson1/slide8.mp3",
    "/audio/lesson1/slide9.mp3",
    "/audio/lesson1/slide10.mp3",
    "/audio/lesson1/slide11.mp3",
    "/audio/lesson1/slide12.mp3",
    "/audio/lesson1/slide13.mp3",
    "/audio/lesson1/slide14.mp3",
    "/audio/lesson1/slide15.mp3",
    "/audio/lesson1/slide16.mp3"
  ];

  const nextSlide = () => {
    if (currentSlide < LESSON_1_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
      if (isPlaying) {
        // Автоматически проигрывать следующий аудио
        playCurrentSlideAudio();
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      if (isPlaying) {
        playCurrentSlideAudio();
      }
    }
  };

  const playCurrentSlideAudio = () => {
    if (audioRef.current) {
      audioRef.current.src = slideAudios[currentSlide];
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      playCurrentSlideAudio();
      setIsPlaying(true);
    }
  };

  // Обработка окончания аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentSlide < LESSON_1_SLIDES.length - 1) {
        nextSlide();
      } else {
        setIsPlaying(false);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentSlide, isPlaying]);

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
                {isPlaying ? '⏸️ Pause' : '▶️ Play'} Audio
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
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Getting Started</span>
              <span>Advanced Concepts</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentSlide + 1) / LESSON_1_SLIDES.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Audio Progress */}
            {isPlaying && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-red-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Slide Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 md:p-12">
              {/* Slide Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{LESSON_1_SLIDES[currentSlide].emoji}</div>
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
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 w-full max-w-md border border-blue-100">
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

              {/* Navigation Controls */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentSlide === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {LESSON_1_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        if (isPlaying) playCurrentSlideAudio();
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-blue-500 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_1_SLIDES.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentSlide === LESSON_1_SLIDES.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {currentSlide === LESSON_1_SLIDES.length - 1 ? 'Finish' : 'Next'} →
                </button>
              </div>
            </div>
          </div>

          {/* Audio Player Status */}
          {isPlaying && (
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    Playing Slide {currentSlide + 1} Audio
                  </span>
                </div>
                <div className="text-2xl">🔊</div>
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Stop
                </button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🚀 Ready to Master Critical Thinking?</h2>
            <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
              Get lifetime access to all 17 interactive lessons with audio narration and beautiful slide presentations
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
                {isPlaying ? '⏸️ Pause Demo' : '▶️ Listen to Sample'}
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
