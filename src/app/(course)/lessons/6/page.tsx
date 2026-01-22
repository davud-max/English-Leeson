'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_6_SLIDES = [
  {
    id: 1,
    title: "🗣️ From Language to Society",
    content: "**👤 So, we have a person who thinks, sets goals, and acts according to rules.** But they are not alone! 👥\n\n🗣️ Language, born from signs for abstractions, allows something completely new — **exchanging knowledge**. People begin to communicate 💬. And communication leads to the possibility of making agreements, uniting in groups, and acting together for a common goal 🎯.\n\n✨ Thus, the ability to abstract gave rise to **society**.\n\n```\n┌─────────────────────────────────────────────────┐\n│  💬 COMMUNICATION = exchange of knowledge       │\n│  👥 SOCIETY = group united by shared            │\n│     information field 📡                        │\n└─────────────────────────────────────────────────┘\n```",
    emoji: "🗣️",
    illustration: "language-society",
    duration: 22000
  },
  {
    id: 2,
    title: "⚔️ Violence and Law",
    content: "**❓ But what happens when people begin to interact?** Conflicts arise ⚡. The most terrible of them — **violence** 💀, the use of force against another person.\n\nForce can deprive a person of:\n🔓 Freedom\n⚖️ Right to act by their own rules\n🏠 Property\n\n🚫 Violence destroys the very foundation of cooperation. Over millennia of spontaneous selection between different groups, the main, saving rule crystallized — **the prohibition of violence**.\n\n```\n┌─────────────────────────────────────────────────┐\n│  ⚖️ LAW = formal prohibition on the use of     │\n│     violence against a person 🚫               │\n└─────────────────────────────────────────────────┘\n```\n\n📜 This is not a rule someone invented and introduced. It was **discovered**, like a law of physics ⚛️. It is formal — it makes no distinctions by skin color 🎨, gender 👤, or age 📅.",
    emoji: "⚔️",
    illustration: "violence-law",
    duration: 28000
  },
  {
    id: 3,
    title: "🛡️ Defense and Civilization",
    content: "**❓ But if violence is prohibited, how to defend against those who still use it?**\n\nThe answer is in the definition itself: what's prohibited is **violence** — the use of force against a person, not force itself 💪. Force can and should be used **against violence**.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🛡️ DEFENSE = use of force against violence   │\n└─────────────────────────────────────────────────┘\n```\n\n🏛️ Organized force protection of a person from violence — this is **politics**.\n\n🌆 And society protected by such politics is called **civilization**. From Latin 'civilis' — fenced, protected.\n\n```\n🛡️ Defense → 🏛️ Politics → 🌆 Civilization\n```",
    emoji: "🛡️",
    illustration: "defense-civilization",
    duration: 25000
  },
  {
    id: 4,
    title: "📊 Levels of Civilization",
    content: "**❓ Do all people equally understand against whom violence cannot be used?**\n\n📜 History shows: **no**. Humanity develops in leaps, transitioning from one level to another. Each level is a new circle of people whom a person recognizes as their own — protected by law.\n\n```\n👨‍👩‍👧‍👦 FAMILY LEVEL:\n   'My own' = only my family members\n\n🏕️ TRIBE LEVEL:\n   'My own' = entire tribe\n\n🏴 NATION LEVEL:\n   'My own' = all who speak my language,\n   share my blood\n\n🌍 CIVIL SOCIETY LEVEL:\n   'My own' = any person who has\n   rejected violence ✨\n```\n\n👶 Each of us in childhood passes through these levels, and our upbringing is a **purposeful ascent** to a higher level 📈.",
    emoji: "📊",
    illustration: "civilization-levels",
    duration: 28000
  },
  {
    id: 5,
    title: "⚡ Civilizational Conflict",
    content: "**💥 Conflict between people from different levels is a civilizational conflict.**\n\nFor a person at the **tribe level** 🏕️, a representative of another tribe is not a person — violence can be used against them.\n\nFor a person at the **nation level** 🏴, both tribes are 'their own', and violence is unacceptable.\n\nTheir collision is a **clash of different rules** for distinguishing 'human — not human' 🤔.\n\n```\n┌─────────────────────────────────────────────────┐\n│  👤 HUMAN = a being that distinguishes another  │\n│     human and recognizes their:                 │\n│     • Rights ⚖️                                 │\n│     • Freedom 🔓                                │\n│     • Property 🏠                               │\n└─────────────────────────────────────────────────┘\n```\n\n✨ This is how the modern concept of **'human'** is refined!",
    emoji: "⚡",
    illustration: "civilizational-conflict",
    duration: 26000
  },
  {
    id: 6,
    title: "🎯 Goals and Goods",
    content: "**🤔 Let's return to our thinking person.** They are troubled by uncertainty, threats, lack of something. To relieve anxiety, they build a mental model of a better state — a **goal** 🎯.\n\nBut to achieve the goal, **resources** are needed, sources of energy ⚡. Resources used for a goal are **goods** 💎. And goods are always **insufficient** 📉.\n\n```\n❓ DOUBLE TASK:\n\n1️⃣ How to OBTAIN goods? 🔍\n2️⃣ How to DISTRIBUTE them among\n   competing goals? ⚖️\n```\n\n⚠️ At the same time, actions must remain **within the law** — be non-violent 🤝.\n\n```\n🎯 Goal + 💎 Goods + ⚖️ Law = 👤 Human Activity\n```",
    emoji: "🎯",
    illustration: "goals-goods",
    duration: 24000
  },
  {
    id: 7,
    title: "👤 Human Activity Defined",
    content: "**📖 Thus, a strict definition is born:**\n\n```\n┌─────────────────────────────────────────────────┐\n│  👤 HUMAN ACTIVITY = activity aimed at          │\n│     achieving formed goals WITHOUT              │\n│     using violence 🚫                           │\n└─────────────────────────────────────────────────┘\n```\n\n**🔥 Here is its core:**\n\n```\n🎯 Goal\n    ↓\n🔍 Analysis of options (PRAXEOLOGY)\n    ↓\n📏 Action by rules without violence\n    ↓\n✨ HUMAN ACTIVITY\n```",
    emoji: "👤",
    illustration: "human-activity-defined",
    duration: 20000
  },
  {
    id: 8,
    title: "⚖️ Ethics and Experience",
    content: "**🤔 Before acting, a person evaluates not only effectiveness but also reputational risks.** Spoiling relationships with others is too high a price 💔.\n\nThus, rules of non-violent interaction are spontaneously born — **ethics** ⚖️.\n\n```\n┌─────────────────────────────────────────────────┐\n│  ⚖️ ETHICS = rules regulating non-violent      │\n│     interaction between people 🤝              │\n└─────────────────────────────────────────────────┘\n```\n\n❓ **And if goals exist but how to achieve them is unclear?** No knowledge to build a model? Then a person can act spontaneously, unintentionally.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🎲 EXPERIENCE = connection between objects    │\n│     or phenomena obtained through               │\n│     unintentional actions                       │\n└─────────────────────────────────────────────────┘\n```\n\n🔥 Gaining experience is a **sacrifice**, a risk in the name of knowledge 📚.",
    emoji: "⚖️",
    illustration: "ethics-experience",
    duration: 26000
  },
  {
    id: 9,
    title: "💰 Economics Defined",
    content: "**📊 Now let's put it all together.**\n\nThe science of human activity as a whole is **praxeology** 📚.\n\nAnd its key part, studying methods of obtaining and distributing **limited goods** for achieving goals, is **economics** 💰.\n\n```\n┌─────────────────────────────────────────────────┐\n│  💰 ECONOMICS = human activity aimed at         │\n│     obtaining goods and distributing them       │\n│     among goals by RANK OF IMPORTANCE 📊       │\n└─────────────────────────────────────────────────┘\n```\n\n```\n📚 Praxeology (Science of Action)\n        ↓\n    💰 Economics\n    (Goods & Distribution)\n```",
    emoji: "💰",
    illustration: "economics-defined",
    duration: 22000
  },
  {
    id: 10,
    title: "⚛️ Economics vs Physics",
    content: "**❓ How does economics differ from, say, physics?**\n\n⚛️ In **physics**, connections are objective and don't depend on our opinion.\n\n💰 In **economics**, everything is based on private evaluative judgments of people that constantly change 🔄.\n\n❓ How to build theory in such uncertainty? Economics finds **regularities** — what's true for most people in most cases:\n\n```\n✅ A person prefers to be healthy & rich 💪💰\n   rather than sick & poor 🤒💸\n\n✅ A good TODAY is more valuable than\n   the same good in uncertain FUTURE ⏰\n\n✅ A person strives to get desired\n   with MINIMUM costs 📉\n```\n\n⚠️ But in economics there are **no universal formulas**. Formulas here are always **agreements** between people about what to consider a standard and how to calculate within a specific deal 🤝.",
    emoji: "⚛️",
    illustration: "economics-physics",
    duration: 28000
  },
  {
    id: 11,
    title: "🎭 Imitation of Activity",
    content: "**✨ Human activity based on voluntary cooperation gives phenomenal growth in well-being** 📈.\n\n**💀 Violence leads to decline** 📉.\n\n🎭 Therefore, those who use violence — thieves, fraudsters, robbers — **disguise themselves**. They create an **imitation** of human activity:\n\n```\n👤 REAL              🎭 IMITATION\n─────────────────────────────────\n💼 Business     →    'Business'\n💰 Profit       →    Loot 🏴‍☠️\n🛠️ Work         →    Robbery\n🎁 Services     →    'Services'\n```\n\n⚠️ **Recognizing this imitation is difficult.** Outwardly everything is decent: politeness 😊, documents 📄, environmental care 🌱...\n\n💀 But inside — **emptiness and violence**. This emptiness devours society, leading to **crises** 💥.",
    emoji: "🎭",
    illustration: "imitation",
    duration: 28000
  },
  {
    id: 12,
    title: "🎓 Learning to See the Difference",
    content: "**🎯 Learning to see this difference is the main practical goal of our course.**\n\nFor this you need:\n\n✅ Be **honest** with yourself\n✅ Accept conclusions of **formal logic** 🧠\n✅ Use **only your own reason** for analysis\n✅ Master **quantitative analysis** at 7th-grade math level 📊\n\n📜 As economist **Ludwig von Mises** said:\n\n> 💬 *\"Economics is the main and true business of every citizen.\"*\n\n⏰ For this business, as for daily hygiene 🚿, it's worth finding time and energy.\n\n🌟 Because only this way can we protect the **genuinely human world** 🌍, built on abstractions, rules, and voluntary cooperation 🤝.\n\n```\n🧠 Abstractions + 📏 Rules + 🤝 Cooperation\n            ↓\n    🌍 Human World ✨\n```",
    emoji: "🎓",
    illustration: "conclusion",
    duration: 30000
  }
];

export default function Lesson6Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  const totalDuration = LESSON_6_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);

    const audioFile = `/audio/lesson6/slide${currentSlide + 1}.mp3`;
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
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [currentSlide, isPlaying, totalDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentSlide < LESSON_6_SLIDES.length - 1) setCurrentSlide(prev => prev + 1);
      else setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
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
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      setIsPlaying(false);
      totalTimeRef.current += LESSON_6_SLIDES[currentSlide].duration * progress;
    } else {
      setIsPlaying(true);
    }
  };

  const goToSlide = (index: number) => {
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    setCurrentSlide(index);
    setProgress(0);
    totalTimeRef.current = 0;
    LESSON_6_SLIDES.slice(0, index).forEach(slide => { totalTimeRef.current += slide.duration; });
  };

  const nextSlide = () => { if (currentSlide < LESSON_6_SLIDES.length - 1) goToSlide(currentSlide + 1); };
  const prevSlide = () => { if (currentSlide > 0) goToSlide(currentSlide - 1); };

  const currentSlideData = LESSON_6_SLIDES[currentSlide];

  const renderIllustration = (illustrationType: string) => {
    const illustrationMap: { [key: string]: JSX.Element } = {
      'language-society': (
        <div className="flex flex-col items-center space-y-4 animate-float">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">👤</div>
            <div className="text-2xl">🗣️</div>
            <div className="text-4xl">👤</div>
            <div className="text-2xl">→</div>
            <div className="text-4xl">👥</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Communication → Society</div>
        </div>
      ),
      'violence-law': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">💀</div>
            <div className="text-3xl text-red-400">🚫</div>
            <div className="text-4xl">⚖️</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Violence Prohibited = Law</div>
        </div>
      ),
      'defense-civilization': (
        <div className="flex flex-col items-center space-y-3 animate-slideInLeft">
          <div className="flex items-center space-x-2">
            <div className="text-4xl">🛡️</div>
            <div className="text-xl">→</div>
            <div className="text-4xl">🏛️</div>
            <div className="text-xl">→</div>
            <div className="text-4xl">🌆</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Defense → Civilization</div>
        </div>
      ),
      'civilization-levels': (
        <div className="flex flex-col items-center space-y-2 animate-fadeInUp">
          <div className="flex flex-col space-y-1 text-sm">
            <div className="bg-green-500/30 px-3 py-1 rounded">🌍 Civil Society</div>
            <div className="bg-blue-500/30 px-3 py-1 rounded">🏴 Nation</div>
            <div className="bg-yellow-500/30 px-3 py-1 rounded">🏕️ Tribe</div>
            <div className="bg-red-500/30 px-3 py-1 rounded">👨‍👩‍👧‍👦 Family</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Levels ↑</div>
        </div>
      ),
      'civilizational-conflict': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="flex items-center space-x-4">
            <div className="text-center"><div className="text-3xl">🏕️</div><div className="text-xs">Tribe</div></div>
            <div className="text-2xl">⚡</div>
            <div className="text-center"><div className="text-3xl">🏴</div><div className="text-xs">Nation</div></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Different Rules Clash</div>
        </div>
      ),
      'goals-goods': (
        <div className="flex flex-col items-center space-y-3 animate-float">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🎯</div>
            <div className="text-xl">+</div>
            <div className="text-3xl">💎</div>
            <div className="text-xl">+</div>
            <div className="text-3xl">⚖️</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Goal + Goods + Law</div>
        </div>
      ),
      'human-activity-defined': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="text-5xl">👤</div>
          <div className="flex space-x-1 text-xl">
            <span>🎯</span><span>→</span><span>🔍</span><span>→</span><span>📏</span><span>→</span><span>✨</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Human Activity</div>
        </div>
      ),
      'ethics-experience': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex space-x-6">
            <div className="text-center"><div className="text-4xl">⚖️</div><div className="text-xs">Ethics</div></div>
            <div className="text-center"><div className="text-4xl">🎲</div><div className="text-xs">Experience</div></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Rules & Learning</div>
        </div>
      ),
      'economics-defined': (
        <div className="flex flex-col items-center space-y-3 animate-slideInRight">
          <div className="text-5xl">💰</div>
          <div className="flex space-x-2 text-sm">
            <div className="bg-green-500/30 px-2 py-1 rounded">Obtain</div>
            <div className="bg-blue-500/30 px-2 py-1 rounded">Distribute</div>
            <div className="bg-purple-500/30 px-2 py-1 rounded">Rank</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Economics</div>
        </div>
      ),
      'economics-physics': (
        <div className="flex flex-col items-center space-y-3 animate-fadeInUp">
          <div className="flex items-center space-x-4">
            <div className="text-center"><div className="text-4xl">⚛️</div><div className="text-xs text-green-300">Objective</div></div>
            <div className="text-2xl">≠</div>
            <div className="text-center"><div className="text-4xl">💰</div><div className="text-xs text-yellow-300">Relative</div></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Different Sciences</div>
        </div>
      ),
      'imitation': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="flex items-center space-x-4">
            <div className="text-center"><div className="text-4xl">👤</div><div className="text-xs text-green-300">Real</div></div>
            <div className="text-2xl">vs</div>
            <div className="text-center"><div className="text-4xl">🎭</div><div className="text-xs text-red-300">Fake</div></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Spot the Imitation!</div>
        </div>
      ),
      'conclusion': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="text-5xl">🎓</div>
          <div className="flex space-x-1 text-xl">
            <span>🧠</span><span>+</span><span>📏</span><span>+</span><span>🤝</span><span>=</span><span>🌍</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Human World</div>
        </div>
      ),
      'default': (<div className="text-6xl">{currentSlideData.emoji}</div>)
    };
    return illustrationMap[illustrationType] || illustrationMap['default'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
      <header className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentSlideData.title}</h1>
              <p className="text-teal-100">Slide {currentSlide + 1} of {LESSON_6_SLIDES.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm bg-white/20 px-4 py-2 rounded-full">Progress: {Math.round(totalProgress * 100)}%</div>
              <Link href="/lessons" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all">Back to Lessons</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-teal-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-teal-800">📈 Lesson Progress</span>
              <span className="text-sm text-teal-600 font-semibold bg-teal-50 px-3 py-1 rounded-full">{Math.round(totalProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 h-3 rounded-full transition-all" style={{ width: `${totalProgress * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-teal-200">
            <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-teal-100">Slide {currentSlide + 1} of {LESSON_6_SLIDES.length}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8 flex justify-center">
                <div className="bg-gradient-to-br from-teal-500 via-cyan-600 to-sky-600 rounded-2xl p-8 shadow-xl">
                  {renderIllustration(currentSlideData.illustration)}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="bg-gradient-to-r from-white to-teal-50 p-4 rounded-xl border-l-4 border-teal-400 hover:shadow-md transition-all">
                      <ReactMarkdown className="text-gray-700 leading-relaxed">{paragraph}</ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-teal-800">📊 Slide Progress</span>
                  <span className="text-sm font-semibold text-teal-600 bg-white px-3 py-1 rounded-full">{Math.round(progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-3 rounded-full transition-all" style={{ width: `${progress * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-teal-50 px-8 py-6 border-t border-teal-200">
              <div className="flex items-center justify-between">
                <button onClick={prevSlide} disabled={currentSlide === 0} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl font-medium transition-all">← Previous</button>
                <button onClick={togglePlay} className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white'}`}>
                  <span className="text-2xl mr-2">{isPlaying ? '⏸️' : '▶️'}</span>{isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={nextSlide} disabled={currentSlide === LESSON_6_SLIDES.length - 1} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl font-medium transition-all">Next →</button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {LESSON_6_SLIDES.map((_, index) => (
                  <button key={index} onClick={() => goToSlide(index)} className={`w-4 h-4 rounded-full transition-all ${index === currentSlide ? 'bg-gradient-to-r from-teal-500 to-cyan-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
            </div>
          </div>

          <audio ref={audioRef} />

          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link href="/lessons/5" className="text-gray-600 hover:text-teal-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all">← Lesson 5</Link>
            <Link href="/checkout" className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl">🚀 Enroll to Continue</Link>
            <Link href="/lessons/7" className="text-gray-600 hover:text-teal-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all">Lesson 7 →</Link>
          </div>

          <div className="mt-16 bg-gradient-to-r from-teal-500 via-cyan-600 to-sky-700 rounded-3xl p-10 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🏛️ Understand Society & Law!</h2>
            <p className="text-teal-100 mb-8 text-xl max-w-2xl mx-auto">Continue learning with all 17 interactive lessons for just $30</p>
            <Link href="/checkout" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-110 shadow-xl">🚀 Enroll Now - $30</Link>
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
