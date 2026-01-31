'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_5_SLIDES = [
  {
    id: 1,
    title: "🎯 From Theory to Practice",
    content: "**👋 Good day!** In the last lesson, we discovered that the unique human ability — to abstract — leads to the formation of goals 🎯 and action according to rules 📏, the main one being the **prohibition of violence** 🚫.\n\nToday we move from theory to practice 🚀. We will answer the question: **what is activity worthy of a human being?** 🤔\n\nHow to distinguish genuinely human activity that creates goods ✨ from predatory imitation that leads to decline 📉?",
    emoji: "🎯",
    illustration: "theory-practice",
    duration: 20000
  },
  {
    id: 2,
    title: "⚡ The Essence of Human Activity",
    content: "**📖 Part One: The Essence of Human Activity**\n\nA goal 🎯 is born from anxiety, from the desire to improve one's situation. But a human, unlike a beast 🦁, cannot use violence against another person to achieve a goal. This is **taboo** 🚫.\n\n```\n┌─────────────────────────────────────────────────┐\n│  👤 HUMAN ACTIVITY = achieving goals            │\n│     WITHOUT using violence 🚫                   │\n└─────────────────────────────────────────────────┘\n```\n\n💎 To achieve goals, resources and energy are needed. In the human context, resources used to achieve a goal are called **goods**. Goods are limited ⚖️.\n\n❓ Therefore, a double task arises:\n1️⃣ How to obtain necessary goods?\n2️⃣ How to distribute them among competing goals?",
    emoji: "⚡",
    illustration: "human-activity",
    duration: 25000
  },
  {
    id: 3,
    title: "📚 Praxeology and Economics",
    content: "**📖 Part Two: Praxeology and Economics — The Science of Action**\n\n🔬 The theory describing optimal ways to achieve formed goals is called **praxeology** — the science of activity. Its core is analysis 🧠, searching for paths to the goal within rules.\n\n```\n┌─────────────────────────────────────────────────┐\n│  📊 PRAXEOLOGY = science of human action        │\n│  💰 ECONOMICS = obtaining & distributing goods  │\n└─────────────────────────────────────────────────┘\n```\n\n💰 The most important part of praxeology, dealing precisely with questions of obtaining and distributing goods, is **economics**.\n\n📖 **Definition:** Economics in its original sense is human activity aimed at obtaining goods and distributing them among goals by rank of importance.\n\n⚠️ Note: forming goals themselves is the domain of psychology 🧠. Economics begins when the goal already exists and a non-violent way to provide it with resources must be found.",
    emoji: "📚",
    illustration: "praxeology",
    duration: 28000
  },
  {
    id: 4,
    title: "⚖️ Ethics and Experience",
    content: "**📖 Part Three: Ethical Limits and Experience**\n\n🤔 Before acting, a person evaluates not only effectiveness but also **reputational risks** 📉. Violating informal rules of cooperation threatens loss of trust, and therefore future goods.\n\n```\n┌─────────────────────────────────────────────────┐\n│  ⚖️ ETHICS = spontaneously formed rules         │\n│     of non-violent interaction 🤝               │\n└─────────────────────────────────────────────────┘\n```\n\n❓ But what if modeling a path to the goal fails? Then a person can act spontaneously, by trial and error ❌✅❌✅.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🎲 EXPERIENCE = result of unintentional        │\n│     actions, positive or bitter 📈📉            │\n└─────────────────────────────────────────────────┘\n```\n\n🔥 Gaining experience is often associated with risk and resembles a **sacrifice on the altar of knowledge** 🎁.",
    emoji: "⚖️",
    illustration: "ethics-experience",
    duration: 25000
  },
  {
    id: 5,
    title: "🔬 Economics vs Physics",
    content: "**📖 Part Four: Economics as the Science of Uncertainty**\n\n❓ How does economic science fundamentally differ from physics? 🔬\n\n⚛️ A physicist discovers **objective laws** that don't depend on opinion. Gravity acts on everyone equally.\n\n📊 An economist deals with **private evaluative judgments** of people that constantly change. It would seem building a general theory is impossible 🤷.\n\n💡 The solution was found by analogy with gas physics. You can't track each molecule, but you can identify statistical regularities in the behavior of many. So in economics: we rely on **basic postulates** true for most:\n\n• 👤 A person prefers more goods to less\n• ⏰ A present good is valued more than a future one\n\n⚠️ **Key difference:** economic postulates are relative, not absolute. Economic theory works with uncertainty, striving to reduce it but unable to eliminate it completely.\n\n🚫 Any theory promising complete certainty in economics is **false** — it's an intellectual perpetual motion machine!",
    emoji: "🔬",
    illustration: "economics-physics",
    duration: 30000
  },
  {
    id: 6,
    title: "🎭 Substitution and Imitation",
    content: "**📖 Part Five: Substitution and Imitation**\n\n✨ Human activity based on **voluntary cooperation** and rejection of violence produces phenomenal growth in well-being 📈.\n\n💀 Violent activity — robbery, deception, fraud — gives only temporary private gain, undermining the basis of cooperation and leading to decline 📉.\n\n🎭 Therefore, **violators are forced to mimic**. They create an imitation of human activity:\n\n```\n👤 Honest Person    vs    🎭 Imitator\n─────────────────────────────────────\n💼 Business         →    'Business'\n💰 Profit           →    Loot\n🛠️ Work             →    Robbery\n🎁 Charity          →    'Charity'\n```\n\n⚠️ **Recognizing this imitation is a vital skill!** Its metastases, penetrating the body of society under plausible pretexts — 'fair redistribution', 'fighting for something' — lead to crises 💥, famine 🍽️, and wars ⚔️.",
    emoji: "🎭",
    illustration: "imitation",
    duration: 28000
  },
  {
    id: 7,
    title: "📖 Call to Literacy",
    content: "**📖 Part Six: Call to Literacy**\n\n❓ How to learn to recognize imitation? Return to basics:\n\n✅ Be honest with yourself\n✅ Accept conclusions of formal logic 🧠\n✅ Use quantitative analysis 📊\n✅ Master mathematics at the level of understanding relationships between quantities and formulas ➗\n\n📜 Economic science, in the words of **Ludwig von Mises**, cannot remain an esoteric branch of knowledge. It concerns everyone and belongs to all. It is the **main and true business of every citizen** 🏛️.\n\n```\n🚿 Personal hygiene     =     🧠 Thinking hygiene\n   (daily care)               (checking what we deal with)\n```\n\n⏰ Just as we find time for personal hygiene, we must find time for **hygiene of thinking** — to verify whether we're dealing with human activity or its dangerous imitation.",
    emoji: "📖",
    illustration: "literacy-call",
    duration: 25000
  },
  {
    id: 8,
    title: "🎓 Cycle Summary",
    content: "**🏁 Cycle Summary: We have traveled the full path!**\n\nFrom the act of distinction to the highest social laws 🏛️.\n\n```\n🧠 ALGORITHM OF THINKING:\nPerception 👁️ → Distinction 🔍 → Term 🏷️ → Quantity 🔢 → Formula 📐\n```\n\n```\n🏛️ FOUNDATION OF SOCIETY:\nAbility to abstract 🧠 → Knowledge 📚 → Rules 📏 → \nProhibition of violence 🚫 → LAW ⚖️\n```\n\n```\n✅ CRITERION OF ACTIVITY:\nGoal 🎯 + Non-violent action 🤝 = Human activity ✨\nImitation 🎭 = Violence 💀\n```\n\n🧭 Armed with this understanding, you receive not just knowledge, but a **coordinate system** for navigating the complex world of ideas, actions, and social institutions.\n\n🎯 You can distinguish a creative rule from a destructive one, law from arbitrariness, true economics from a predatory scheme.\n\n🎓 **This is the goal of true education** — not to fill the head with facts, but to give a tool for independently building a consistent picture of the world.\n\n🙏 **Thank you for traveling this path together!**",
    emoji: "🎓",
    illustration: "summary",
    duration: 35000
  }
];

export default function Lesson5Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  const totalDuration = LESSON_5_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;

    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    const audioFile = `/audio/lesson5/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(audioRef.current.currentTime / audioRef.current.duration);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentSlide < LESSON_5_SLIDES.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
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
      totalTimeRef.current += LESSON_5_SLIDES[currentSlide].duration * progress;
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
    LESSON_5_SLIDES.slice(0, index).forEach(slide => {
      totalTimeRef.current += slide.duration;
    });
  };

  const nextSlide = () => {
    if (currentSlide < LESSON_5_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const currentSlideData = LESSON_5_SLIDES[currentSlide];

  const renderIllustration = (illustrationType: string) => {
    const illustrationMap: { [key: string]: JSX.Element } = {
      'theory-practice': (
        <div className="flex flex-col items-center space-y-4 animate-float">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">📚</div>
            <div className="text-3xl animate-pulse">→</div>
            <div className="text-5xl">🚀</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Theory → Practice
          </div>
        </div>
      ),
      'human-activity': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🎯</div>
            <div className="text-2xl">+</div>
            <div className="text-4xl">🚫</div>
            <div className="text-2xl">=</div>
            <div className="text-4xl">👤</div>
          </div>
          <div className="text-sm mt-2">Goal + No Violence = Human Activity</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Essence of Human Activity
          </div>
        </div>
      ),
      'praxeology': (
        <div className="flex flex-col items-center space-y-3 animate-slideInLeft">
          <div className="text-5xl mb-2">📊</div>
          <div className="flex space-x-2">
            <div className="bg-blue-500/30 px-3 py-1 rounded text-sm">Praxeology</div>
            <div className="text-xl">⊃</div>
            <div className="bg-green-500/30 px-3 py-1 rounded text-sm">Economics</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Science of Action
          </div>
        </div>
      ),
      'ethics-experience': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-4xl">⚖️</div>
              <div className="text-xs mt-1">Ethics</div>
            </div>
            <div className="text-center">
              <div className="text-4xl">🎲</div>
              <div className="text-xs mt-1">Experience</div>
            </div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Rules & Learning
          </div>
        </div>
      ),
      'economics-physics': (
        <div className="flex flex-col items-center space-y-3 animate-fadeInUp">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl">⚛️</div>
              <div className="text-xs mt-1">Physics</div>
              <div className="text-xs text-green-300">Objective</div>
            </div>
            <div className="text-2xl">≠</div>
            <div className="text-center">
              <div className="text-4xl">💰</div>
              <div className="text-xs mt-1">Economics</div>
              <div className="text-xs text-yellow-300">Relative</div>
            </div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Science of Uncertainty
          </div>
        </div>
      ),
      'imitation': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl">👤</div>
              <div className="text-xs mt-1 text-green-300">Real</div>
            </div>
            <div className="text-2xl">vs</div>
            <div className="text-center">
              <div className="text-4xl">🎭</div>
              <div className="text-xs mt-1 text-red-300">Fake</div>
            </div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Recognize Imitation!
          </div>
        </div>
      ),
      'literacy-call': (
        <div className="flex flex-col items-center space-y-3 animate-float">
          <div className="text-5xl mb-2">📖</div>
          <div className="flex space-x-2 text-2xl">
            <span>✅</span>
            <span>🧠</span>
            <span>📊</span>
            <span>➗</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Tools for Understanding
          </div>
        </div>
      ),
      'summary': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="text-5xl mb-2">🎓</div>
          <div className="flex space-x-1 text-2xl">
            <span>👁️</span>
            <span>→</span>
            <span>🔍</span>
            <span>→</span>
            <span>🏷️</span>
            <span>→</span>
            <span>⚖️</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
            Complete Journey
          </div>
        </div>
      ),
      'default': (
        <div className="flex flex-col items-center space-y-3">
          <div className="text-6xl mb-2">{currentSlideData.emoji}</div>
        </div>
      )
    };

    return illustrationMap[illustrationType] || illustrationMap['default'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-2">{currentSlideData.title}</h1>
              <p className="text-orange-100">Slide {currentSlide + 1} of {LESSON_5_SLIDES.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                Progress: {Math.round(totalProgress * 100)}%
              </div>
              <Link href="/lessons" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all">
                Back to Lessons
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-orange-800">📈 Lesson Progress</span>
              <span className="text-sm text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full">
                {Math.round(totalProgress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${totalProgress * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-orange-200">
            <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-orange-100">Slide {currentSlide + 1} of {LESSON_5_SLIDES.length}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8 flex justify-center">
                <div className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-2xl p-8 shadow-xl">
                  {renderIllustration(currentSlideData.illustration)}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-white to-orange-50 p-4 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition-all"
                    >
                      <ReactMarkdown className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-8 py-6 border-t border-orange-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl font-medium transition-all"
                >
                  ← Previous
                </button>

                <button
                  onClick={togglePlay}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                  }`}
                >
                  <span className="text-2xl mr-2">{isPlaying ? '⏸️' : '▶️'}</span>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === LESSON_5_SLIDES.length - 1}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl font-medium transition-all"
                >
                  Next →
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {LESSON_5_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <audio ref={audioRef} />

          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link href="/lessons/4" className="text-gray-600 hover:text-orange-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all">
              ← Lesson 4
            </Link>
            <Link href="/checkout" className="bg-gradient-to-r from-orange-600 to-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl">
              🚀 Enroll to Continue
            </Link>
            <Link href="/lessons/6" className="text-gray-600 hover:text-orange-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all">
              Lesson 6 →
            </Link>
          </div>

          <div className="mt-16 bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-700 rounded-3xl p-10 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🎯 Master Human Activity!</h2>
            <p className="text-orange-100 mb-8 text-xl max-w-2xl mx-auto">
              Continue learning with all 17 interactive lessons for just $30
            </p>
            <Link href="/checkout" className="inline-block bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-110 shadow-xl">
              🚀 Enroll Now - $30
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
