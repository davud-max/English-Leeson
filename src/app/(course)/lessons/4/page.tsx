'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_4_SLIDES = [
  {
    id: 1,
    title: "🦁 The World of the Beast",
    content: "**🐾 Every living creature obtains food 🍖, defends itself 🛡️, cares for offspring 👶 — acts.** Actions are based on instincts ⚡ and reflexes. This is the world of the beast 🦁🐺🦊. The beast cannot change the goals that nature 🌿 sets before it. It cannot act purposefully.\n\n✨ **Human differs by a unique quality:** the ability to form new goals 🎯. And to achieve a new goal, new actions are needed. These are already **purposeful actions** 🚀.\n\nWhere does this ability come from? 🤔 It arose thanks to the ability to **abstract** — to distinguish, to differentiate something outside oneself. What is distinguished begins to exist for a person 💡.",
    emoji: "🦁",
    illustration: "beast-world",
    duration: 25000
  },
  {
    id: 2,
    title: "🐿️ Can Animals Abstract?",
    content: "**🤔 It may seem that animals can do this too.** A squirrel 🐿️ sees a nut 🌰, a fox 🦊 sees a rabbit 🐰. But we don't know if a squirrel can imagine a nut in its absence. Was there a goal to pick the nut, or did it simply obey instinct? ⚡\n\n🔬 **Scientists believe:** for the beast, neither the external world 🌍 nor itself exists. Everything is a unified system of signals 📡 and reactions ⚡.\n\n```\n🐿️ → 👀 → 🌰 → ⚡ Reaction\n     (No imagination, only instinct)\n```",
    emoji: "🐿️",
    illustration: "animal-perception",
    duration: 20000
  },
  {
    id: 3,
    title: "🌌 From Being to Abstraction",
    content: "**🧑 And what about humans?** At first, nothing existed for humans either. Everything was unified, whole 🌀 — let's call this **being**. Using the ability to abstract 🧠, humans learned to distinguish parts from being. They began to differentiate them.\n\n📖 **Definition:** The process of distinguishing and differentiating a part of being is called **abstraction**.\n\n🎯 A part of being perceived as a separate whole is called an **abstraction**.\n\n✨ **What is distinguished — begins to exist!** 💫\n\n```\n🌀 Being → 🔍 Abstraction → 💡 Existence\n```",
    emoji: "🌌",
    illustration: "being-abstraction",
    duration: 22000
  },
  {
    id: 4,
    title: "👁️ The First Abstractions",
    content: "**🔍 What did humans distinguish first?**\n\n1️⃣ **The physical world** 🌍 — what can be sensed\n2️⃣ **Nothingness** ⬛ — what lies beyond its boundaries\n3️⃣ **Themselves** 👤 — the observer\n\n💡 Without 'nothing' ⬛ one cannot imagine the boundaries of 'something' ⬜!\n\n🔄 Further, humans divide the physical world into parts: ☀️ sun, 🌤️ sky, 💧 water... Later they unite homogeneous parts into a higher-order abstraction — **being**.\n\n🍎🍎🍎 → 🍎 For example, from many apples arises the image of **'apple in general'**.",
    emoji: "👁️",
    illustration: "first-abstractions",
    duration: 22000
  },
  {
    id: 5,
    title: "🔤 Signs and Knowledge",
    content: "**✍️ Each abstraction is assigned a sign by humans:**\n\n🔊 A sound • 👋 A gesture • 🔣 A symbol\n\nSigns ✨ + Abstractions 💭 = **Knowledge** 📚\n\n📖 **Definition:** Knowledge is an abstraction translated into sign form.\n\n🧠 Operating with knowledge, humans build models of events and actions. They begin to **think** 💭.\n\n⚡ **Thinking is operations on abstractions.**\n\n```\n💭 Abstraction + 🔤 Sign = 📚 Knowledge\n📚 Knowledge + 🔄 Operations = 🧠 Thinking\n```",
    emoji: "🔤",
    illustration: "signs-knowledge",
    duration: 20000
  },
  {
    id: 6,
    title: "📝 Definitions and Terms",
    content: "**👀 Observing the world, humans divide it into many beings.** How to describe them? 🤔\n\nLet's recall the lesson about the ⭕ circle. If 👥👥👥👥👥 ten people describe the same thing, they will give ten different ✅ but correct descriptions.\n\n❓ But if you ask them to give the **shortest description**? It will be the same for everyone! ✨\n\n📖 This shortest description is the **DEFINITION**. It is unique. And it can be assigned a word — a **TERM** 🏷️.\n\n🔄 This is how our mind worked when we defined:\n⭕ circle • ➖ chord • ⬇️ diameter",
    emoji: "📝",
    illustration: "definitions-terms",
    duration: 22000
  },
  {
    id: 7,
    title: "🧬 Defining Human",
    content: "**🤔 If we follow this logic, then the term 'human' should also have a definition.**\n\nLet's try: 📝\n\n```\n┌─────────────────────────────────────────┐\n│  🧬 HUMAN = a being possessing the     │\n│     ability to ABSTRACT 🧠              │\n└─────────────────────────────────────────┘\n```\n\n⚡ **This is the main difference from the beast!**\n\n🦁 Beast: Instincts ⚡ → Actions\n🧑 Human: Abstraction 🧠 → Goals 🎯 → Actions 🚀",
    emoji: "🧬",
    illustration: "defining-human",
    duration: 15000
  },
  {
    id: 8,
    title: "📚 Literacy",
    content: "**🔄 Constant practice of working with definitions and terms develops a new quality** — the ability to act according to rules 📏. Let's call this **literacy** 📚.\n\n```\n┌─────────────────────────────────────┐\n│  📚 LITERACY = action by rules 📏   │\n└─────────────────────────────────────┘\n```\n\n✅ **A literate person** speaks briefly and precisely — uses terms 🏷️.\n\n❌ **An illiterate person** is forced to give lengthy descriptions... 📜📜📜\n\n```\n📚 Literate:   'Circle ⭕'\n❓ Illiterate: 'Round thing with all points same distance from center...'\n```",
    emoji: "📚",
    illustration: "literacy",
    duration: 18000
  },
  {
    id: 9,
    title: "🔗 Concepts",
    content: "**🔗 Between objects and phenomena there are connections.** They can also be described with signs 🔣.\n\n📏 Distance ÷ ⏱️ Time = 💨 **Speed**\n\n```\n┌─────────────────────────────────────────────┐\n│  🔗 CONCEPT = a term denoting the          │\n│     connection between quantities 📊        │\n│     or phenomena ✨                         │\n└─────────────────────────────────────────────┘\n```\n\n📚 The library of knowledge contains all terms and concepts. Operating with them, humans can model a state **better than the present** 🌟.\n\n💭 This model becomes a **thought**. If a person begins to act, the thought becomes a **goal** 🎯.",
    emoji: "🔗",
    illustration: "concepts",
    duration: 25000
  },
  {
    id: 10,
    title: "🎯 Goals and Purposeful Action",
    content: "```\n┌─────────────────────────────────────────┐\n│  🎯 GOAL = abstract model of desired ✨  │\n└─────────────────────────────────────────┘\n```\n\n🚀 To achieve it, new actions are needed — **purposeful ones**. This means humans are beings capable of acting purposefully. In this area, they are **free from instincts** 🔓!\n\n❓ **But how to achieve a goal?**\n\n🔄 Method 1: Trial and error ❌✅❌✅\n🧠 Method 2: Build models → Choose best → **Analysis** 📊\n\n```\n┌─────────────────────────────────────────────┐\n│  📏 RULE = result of analysis,             │\n│     sequence of actions leading to goal 🎯  │\n└─────────────────────────────────────────────┘\n```",
    emoji: "🎯",
    illustration: "goals-actions",
    duration: 25000
  },
  {
    id: 11,
    title: "🛤️ The Path of Thinking Human",
    content: "**🔄 Repeated application of a rule forms a skill** — an action brought to automatism ⚡. Perfecting skills in using knowledge, humans create **language** 🗣️, speech appears. And with it — the possibility of **cooperation** 🤝, coordinated activity for a common goal.\n\n🛤️ **We have traced the path:**\n\n```\n🧠 Abstraction → 📚 Knowledge → 💭 Thinking → 🎯 Goal → 📏 Rule\n```\n\n✨ This is the path of becoming a **thinking human** 🧠, an **acting human** 🚀.\n\n❓ **But is this enough for activity to be human?**\n\n❌ **No.** Because there is also violence 💥. And there is **law** ⚖️.\n\n🔜 *To be continued...*",
    emoji: "🛤️",
    illustration: "thinking-path",
    duration: 25000
  }
];

export default function Lesson4Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  // Calculate total lesson duration
  const totalDuration = LESSON_4_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  // Handle slide progression based on AUDIO (audio has priority)
  useEffect(() => {
    if (!isPlaying) return;

    // Clear any existing timer
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    // Load and play audio for current slide
    const audioFile = `/audio/lesson4/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

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
      console.log(`🎵 Audio ended for slide ${currentSlide + 1}, advancing...`);
      if (currentSlide < LESSON_4_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        console.log("🎓 Lesson 4 completed!");
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
  }, [currentSlide, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
      setIsPlaying(false);
      totalTimeRef.current += LESSON_4_SLIDES[currentSlide].duration * progress;
    } else {
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
    LESSON_4_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_4_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_4_SLIDES[currentSlide];

  // Render visual illustration based on type
  const renderIllustration = (illustrationType: string) => {
    const illustrationMap: { [key: string]: JSX.Element } = {
      'beast-world': (
        <div className="flex flex-col items-center space-y-4 animate-float">
          <div className="flex space-x-4">
            <div className="text-5xl transform hover:scale-110 transition-transform duration-200">🦁</div>
            <div className="text-5xl transform hover:scale-110 transition-transform duration-200">🐺</div>
            <div className="text-5xl transform hover:scale-110 transition-transform duration-200">🦊</div>
          </div>
          <div className="flex space-x-2 text-2xl">
            <span>⚡</span>
            <span className="animate-pulse">→</span>
            <span>🎯</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Instinct & Reflex
          </div>
        </div>
      ),
      'animal-perception': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">🐿️</div>
            <div className="text-3xl animate-pulse">👀</div>
            <div className="text-5xl">🌰</div>
          </div>
          <div className="text-2xl mt-2">❓</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Instinct or Goal?
          </div>
        </div>
      ),
      'being-abstraction': (
        <div className="flex flex-col items-center space-y-4 animate-slideInLeft">
          <div className="text-6xl mb-2">🌌</div>
          <div className="flex space-x-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-30"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-50"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-300 to-green-300 rounded-full opacity-70"></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Being → Abstraction
          </div>
        </div>
      ),
      'first-abstractions': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="grid grid-cols-3 gap-3 text-4xl">
            <div className="bg-yellow-500/30 p-2 rounded-lg">☀️</div>
            <div className="bg-blue-500/30 p-2 rounded-lg">🌊</div>
            <div className="bg-cyan-500/30 p-2 rounded-lg">🌤️</div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-2xl">👁️</span>
            <span className="animate-pulse">→</span>
            <span className="text-xl font-bold">∃</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Observer & World
          </div>
        </div>
      ),
      'signs-knowledge': (
        <div className="flex flex-col items-center space-y-3 animate-fadeInUp">
          <div className="text-5xl mb-2">🔤</div>
          <div className="flex space-x-2">
            <div className="bg-white/20 px-3 py-1 rounded text-xl">A</div>
            <div className="bg-white/20 px-3 py-1 rounded text-xl">→</div>
            <div className="bg-white/20 px-3 py-1 rounded text-xl">🍎</div>
          </div>
          <div className="text-2xl mt-2">📚 = 🔤 + 💭</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Signs → Knowledge
          </div>
        </div>
      ),
      'definitions-terms': (
        <div className="flex flex-col items-center space-y-3 animate-slideInRight">
          <div className="text-5xl mb-2">📝</div>
          <div className="flex flex-col items-center space-y-1">
            <div className="text-sm bg-white/20 px-2 py-1 rounded">Description 1</div>
            <div className="text-sm bg-white/20 px-2 py-1 rounded">Description 2</div>
            <div className="text-sm bg-white/20 px-2 py-1 rounded">...</div>
          </div>
          <div className="text-xl mt-2">↓</div>
          <div className="text-lg font-bold bg-purple-500/30 px-3 py-1 rounded">DEFINITION</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Shortest Description
          </div>
        </div>
      ),
      'defining-human': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">🦁</div>
            <div className="text-3xl">≠</div>
            <div className="text-5xl">👤</div>
          </div>
          <div className="text-2xl mt-2">🧠 = Abstraction</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Human Definition
          </div>
        </div>
      ),
      'literacy': (
        <div className="flex flex-col items-center space-y-3 animate-float">
          <div className="text-5xl mb-2">📚</div>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl">✅</div>
              <div className="text-xs">Terms</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl">📏</div>
              <div className="text-xs">Rules</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl">🎯</div>
              <div className="text-xs">Precision</div>
            </div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Action by Rules
          </div>
        </div>
      ),
      'concepts': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="text-5xl mb-2">🔗</div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500/30 px-2 py-1 rounded">Distance</div>
            <div className="text-xl">÷</div>
            <div className="bg-green-500/30 px-2 py-1 rounded">Time</div>
            <div className="text-xl">=</div>
            <div className="bg-purple-500/30 px-2 py-1 rounded font-bold">Speed</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Connections Between Quantities
          </div>
        </div>
      ),
      'goals-actions': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="text-5xl mb-2">🎯</div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">💭</div>
            <div className="animate-pulse">→</div>
            <div className="text-2xl">🎯</div>
            <div className="animate-pulse">→</div>
            <div className="text-2xl">📋</div>
          </div>
          <div className="text-sm mt-2">Thought → Goal → Rule</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Purposeful Action
          </div>
        </div>
      ),
      'thinking-path': (
        <div className="flex flex-col items-center space-y-3 animate-slideInLeft">
          <div className="text-5xl mb-2">🛤️</div>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <div className="bg-blue-500/30 px-2 py-1 rounded">Abstraction</div>
            <div className="animate-pulse">→</div>
            <div className="bg-green-500/30 px-2 py-1 rounded">Knowledge</div>
            <div className="animate-pulse">→</div>
            <div className="bg-yellow-500/30 px-2 py-1 rounded">Thinking</div>
            <div className="animate-pulse">→</div>
            <div className="bg-orange-500/30 px-2 py-1 rounded">Goal</div>
            <div className="animate-pulse">→</div>
            <div className="bg-red-500/30 px-2 py-1 rounded">Rule</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Path of Thinking Human
          </div>
        </div>
      ),
      'default': (
        <div className="flex flex-col items-center space-y-3">
          <div className="text-6xl mb-2">{currentSlideData.emoji}</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            {illustrationType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      )
    };

    return illustrationMap[illustrationType] || illustrationMap['default'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Animated Header */}
      <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-2 transform hover:scale-105 transition-transform duration-300">
                {currentSlideData.title}
              </h1>
              <p className="text-purple-100 animate-pulse">Slide {currentSlide + 1} of {LESSON_4_SLIDES.length}</p>
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
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-200 animate-fadeInUp">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-purple-800">
                📈 Lesson Progress
              </span>
              <span className="text-sm text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                {Math.round(totalProgress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-purple-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            {/* Slide Header */}
            <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 p-6 text-white animate-slideInDown">
              <div className="flex items-center gap-4">
                <span className="text-4xl transform hover:scale-125 transition-transform duration-300">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold transform hover:translate-x-2 transition-transform duration-300">{currentSlideData.title}</h1>
                  <p className="text-purple-100 animate-pulse">Slide {currentSlide + 1} of {LESSON_4_SLIDES.length}</p>
                </div>
              </div>
            </div>

            {/* Slide Body */}
            <div className="p-8 animate-fadeIn">
              {/* Visual Illustration */}
              <div className="mb-8 flex justify-center">
                <div className="bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl p-8 shadow-xl">
                  {renderIllustration(currentSlideData.illustration)}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-white to-purple-50 p-4 rounded-xl border-l-4 border-purple-400 hover:shadow-md transition-all duration-300 hover:translate-x-2 transform"
                    >
                      <ReactMarkdown className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>

                <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full transition-all duration-500 shadow-md"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-8 py-6 border-t border-purple-200">
              <div className="flex items-center justify-between animate-fadeIn">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  ← Previous
                </button>

                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                  }`}
                >
                  <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_4_SLIDES.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Next →
                </button>
              </div>

              {/* Slide Navigation */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center animate-fadeInUp">
                {LESSON_4_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 shadow-md ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg scale-125' 
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} />

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 animate-fadeInUp">
            <Link 
              href="/lessons/3" 
              className="flex items-center gap-2 text-gray-600 hover:text-purple-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg border border-gray-200 hover:border-purple-300"
            >
              ← Lesson 3
            </Link>
            
            <div className="flex gap-4">
              <Link 
                href="/checkout" 
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform"
              >
                🚀 Enroll to Continue
              </Link>
            </div>
            
            <Link 
              href="/lessons/5" 
              className="flex items-center gap-2 text-gray-600 hover:text-purple-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg border border-gray-200 hover:border-purple-300"
            >
              Lesson 5 →
            </Link>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700 rounded-3xl p-10 text-white text-center shadow-2xl border border-purple-300/50 animate-fadeInUp hover:shadow-3xl transition-all duration-500">
            <h2 className="text-3xl font-bold mb-4 transform hover:scale-105 transition-transform duration-300">
              🧠 Master the Art of Abstraction!
            </h2>
            <p className="text-purple-100 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link 
              href="/checkout" 
              className="inline-block bg-white text-purple-600 hover:bg-gradient-to-r hover:from-white hover:to-purple-50 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-3xl transform border-2 border-white"
            >
              🚀 Enroll Now - $30
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
