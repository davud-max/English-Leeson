'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

const LESSON_7_SLIDES = [
  {
    id: 1,
    title: "💰 From Gifts to Money",
    content: "**👋 Today we'll talk about how from simple exchange of gifts between tribes, money 💰, markets 🏪, and the banking system 🏦 were born.**\n\nThis is a journey from the communal pot 🍲 to retail trade 🛒.\n\n```\n🎁 Gifts → 🏪 Markets → 💰 Money → 🏦 Banks\n```\n\n✨ Let's trace this fascinating path of human cooperation!",
    emoji: "💰",
    illustration: "gifts-money",
    duration: 18000
  },
  {
    id: 2,
    title: "🏕️ The World Before Trade",
    content: "**📖 Part One: The World Before Trade**\n\nIn closed patriarchal-communal societies, **trade did not exist** 🚫. In prehistoric times, most resources were at the disposal of only heads of families, clans, or tribal chiefs 👑.\n\n```\n🏕️ COMMUNAL LIFE:\n• Work together 👥\n• Eat from common pot 🍲\n• No private property yet ❌\n```\n\n🛡️ Each community had its relatively stable **boundary**, protected from outsiders' encroachment.\n\n🎁 Nevertheless, between chiefs of neighboring communities there was interaction, accompanied by **mutual gifts**. Gifts could include rare items that arrived through a chain from very distant places 🌍.\n\n```\n📍 Stage 1: Goods move 📦➡️\n           Owners DON'T move 🚫👤\n           Exchange only between STRANGERS 👥↔️👥\n```",
    emoji: "🏕️",
    illustration: "world-before-trade",
    duration: 28000
  },
  {
    id: 3,
    title: "🐪 Birth of Merchants",
    content: "**📖 Part Two: Birth of Merchants and Caravans**\n\n✨ The uniqueness and high usefulness of some goods received as gifts from a neighboring tribe prompted sending a **special group** to search for them 🔍.\n\n🎁 For traveling through neighboring communities' territory, appropriate **gifts and guides** were needed.\n\n```\n🔄 EVOLUTION:\n\n🎁 Occasional gifts\n    ↓\n🚶 Regular expeditions\n    ↓\n🐪 Established routes\n    ↓\n👔 MERCHANTS & CARAVANS born!\n```\n\n📍 Routes became more diverse and distant. Now goods weren't moving between communities on their own — **special groups of people** moved them.\n\n🏕️ A place where several caravan routes intersected became a **joint camp**. Here merchants exchanged both goods 📦 and information 📰. They could agree to meet next season.\n\n🎪 **Thus seasonal FAIRS appeared!**",
    emoji: "🐪",
    illustration: "merchants-caravans",
    duration: 28000
  },
  {
    id: 4,
    title: "📜 Formal Rules and Markets",
    content: "**📖 Part Three: Formal Rules and Markets**\n\n📈 The number of fairs began to grow. Each developed its own **rules**. Fairs grew faster where conditions for exchange were better and where understandable rules recognized by most were maintained.\n\n```\n⚖️ NEW RULES vs 🏕️ TRIBAL RULES\n─────────────────────────────────\n• Apply to ALL 👥     • Only for 'us'\n• Formal ⚖️           • Personal 🤝\n• Protected 🛡️        • Customary\n```\n\n🛡️ Fair owners were most interested in protecting new rules. They allocated part of their forces and resources to ensure these rules worked on their territory.\n\n🌍 The largest and most successful fairs attracted merchants from **other nations**. International trade brought peoples closer, forming **unified exchange rules** and a **common language** of exchange.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🏪 MARKET = territory with unified exchange    │\n│     rules independent of tribal, ethnic,        │\n│     or racial differences — FORMAL rules ⚖️    │\n└─────────────────────────────────────────────────┘\n```",
    emoji: "📜",
    illustration: "formal-rules-market",
    duration: 30000
  },
  {
    id: 5,
    title: "🪙 Birth of the Coin",
    content: "**📖 Part Four: Birth of the Coin**\n\n🏠 Land at the intersection of trade routes was rented for warehouses, workshops, and markets. Payment was calculated **daily** 📅.\n\n📝 As markets grew, tracking rent payments became crucial. Each merchant, after paying daily rent, received a **token** — a tag certifying payment.\n\n```\n🏷️ TOKEN EVOLUTION:\n\n📜 Leather piece with stamp\n    ↓\n🔨 More durable material needed\n    ↓\n🪙 Copper, bronze, silver, gold!\n    ↓\n💰 FIRST CAST COIN born!\n```\n\n🏷️ Token forms varied across markets — it could be leather with a seal or the landlord's family crest imprint.\n\n📈 As trade volume increased, tokens became fragile and easy to forge. The next step: stamping the family crest on **more durable material** — copper, bronze, silver, or gold.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🪙 In many countries, silver coin for daily   │\n│     market rent was called TANGA or DENGA      │\n│     from 'tamga' — family/clan crest 🏷️       │\n└─────────────────────────────────────────────────┘\n```",
    emoji: "🪙",
    illustration: "birth-of-coin",
    duration: 28000
  },
  {
    id: 6,
    title: "🏦 Birth of the Bank",
    content: "**📖 Part Five: Birth of the Bank**\n\n❓ How to achieve **multiple use** of coins? How to return coins from merchant back to owner?\n\n🏛️ A special house was designated — a **treasury**, storage of valuables, where natural payments for daily market rent were accepted. In exchange for received products, a **coin was issued**.\n\n```\n🔄 COIN CIRCULATION:\n\n🍎 Products → 🏦 Treasury → 🪙 Coin issued\n                  ↑              ↓\n                  └──── 🪙 ←────┘\n              Controllers collect coins\n```\n\n👮 Special **controllers** each day at a set time walked around the market and collected coins **back**. If no coin was found — the stall was **closed** ❌.\n\n🚶 **Buyers** didn't pay for market access. They had a separate entrance called the **'eye of the needle'** 🪡 — due to its resemblance to old needle holders. Only people could physically pass through, but not pack animals 🐪❌.\n\n```\n┌─────────────────────────────────────────────────┐\n│  🏦 Coins issued at the cash desk              │\n│     returned to the SAME cash desk!            │\n│     → Closed circulation system 🔄             │\n└─────────────────────────────────────────────────┘\n```",
    emoji: "🏦",
    illustration: "birth-of-bank",
    duration: 30000
  },
  {
    id: 7,
    title: "💱 Coin as Payment",
    content: "**📖 Part Six: Coin as Payment Means**\n\n📅 A merchant could finish their trading season early. Then remaining coins could be:\n\n```\n🪙 OPTIONS FOR LEFTOVER COINS:\n\n1️⃣ Save until next season 💾\n2️⃣ Sell to neighbors (at discount) 📉\n3️⃣ Buy from neighbor if needed (premium) 📈\n```\n\n💹 Thus, within a given market, the coin gradually became a **payment means** between merchants themselves and with buyers.\n\n👀 The owner who minted coins couldn't miss this. He began using the treasury not only for rent payments but also for **issuing coins on loan** — on credit 📝.\n\n```\n┌─────────────────────────────────────────────────┐\n│  💰 CREDIT DISCOVERY:                           │\n│  This additional financial mechanism            │\n│  unexpectedly brought GREAT PROFIT! 📈         │\n└─────────────────────────────────────────────────┘\n```\n\n🏦 The treasury transformed from simple storage into a **profit-generating institution**!",
    emoji: "💱",
    illustration: "coin-payment",
    duration: 26000
  },
  {
    id: 8,
    title: "⚖️ Good and Bad Money",
    content: "**📖 Part Seven: Good and Bad Money**\n\n🪙 Cast coin is durable but **easy to forge**. Casting was replaced by **minting** — stamping an imprint 🔨.\n\n```\n🪙 COIN EVOLUTION:\n\n🫠 Cast coin (easy to forge)\n    ↓\n🔨 Minted coin (one-sided = BRACTEATE)\n    ↓\n🪙 Two-sided coin (more secure)\n```\n\n⚠️ Increased silver coin production raised silver's value. This led to **coin clipping** — scraping off small amounts of silver. Weight changed, value changed — leading to **payment conflicts** and undermining trust 😟.\n\n⚔️ **Competition began between coins!** Same denomination coins with different mints were valued differently.\n\n```\n┌─────────────────────────────────────────────────┐\n│  ✅ GOOD MONEY = coins whose owners strictly   │\n│     prevented forgery and clipping             │\n│                                                 │\n│  ❌ BAD MONEY = coins easily corrupted         │\n│     or forged                                   │\n└─────────────────────────────────────────────────┘\n```\n\n📊 **On a free market, GOOD money drives out BAD money**, bringing their owners greater profit! 💰",
    emoji: "⚖️",
    illustration: "good-bad-money",
    duration: 28000
  },
  {
    id: 9,
    title: "🌐 Network Banking System",
    content: "**📖 Part Eight: Network Banking System**\n\n💰 Coin owners, seeing the profit from minting coins for retail trade, sought to **expand** the zone of application 🗺️.\n\n🏪 They could rent space at **other markets** to open branches of their exchange office there.\n\n```\n🏦 → 🏦 → 🏦 → 🏦\nNETWORK BANKING SYSTEM born!\n```\n\n📝 Gradually, the term **'cash desk'** remained only for the place of receiving or issuing cash 💵. The house where all other operations occurred — from minting to exchange and credit — received the name **BANK** 🏦.\n\n> 📜 From Latin 'banco' — bench, counter, table on which money changers laid out coins.\n\n```\n🏘️ URBANIZATION:\n\n🎪 Seasonal fairs → 🏪 Permanent markets\n🌾 Farmers bring products → 💰 Exchange for coins\n🏠 CITIES appear! 🌆\n👤 Independent owners emerge (Cossacks, farmers)\n```\n\n```\n┌─────────────────────────────────────────────────┐\n│  🎓 SUMMARY:                                    │\n│  Two concepts — BANK 🏦 and COIN 🪙 —          │\n│  radically changed the exchange system:         │\n│                                                 │\n│  ✅ Markets appeared 🏪                        │\n│  ✅ Retail trade emerged 🛒                    │\n│  ✅ Coin minting & quality control 🔍          │\n│  ✅ Fighting counterfeiters ⚔️                 │\n│  ✅ Currency exchange 💱                       │\n│  ✅ Credit system 📝                           │\n└─────────────────────────────────────────────────┘\n```\n\n🙏 **Thank you for your attention!**",
    emoji: "🌐",
    illustration: "network-banking",
    duration: 35000
  }
];

export default function Lesson7Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(0);

  const totalDuration = LESSON_7_SLIDES.reduce((sum, slide) => sum + slide.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);

    const audioFile = `/audio/lesson7/slide${currentSlide + 1}.mp3`;
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
      if (currentSlide < LESSON_7_SLIDES.length - 1) setCurrentSlide(prev => prev + 1);
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
      totalTimeRef.current += LESSON_7_SLIDES[currentSlide].duration * progress;
    } else {
      setIsPlaying(true);
    }
  };

  const goToSlide = (index: number) => {
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    setCurrentSlide(index);
    setProgress(0);
    totalTimeRef.current = 0;
    LESSON_7_SLIDES.slice(0, index).forEach(slide => { totalTimeRef.current += slide.duration; });
  };

  const nextSlide = () => { if (currentSlide < LESSON_7_SLIDES.length - 1) goToSlide(currentSlide + 1); };
  const prevSlide = () => { if (currentSlide > 0) goToSlide(currentSlide - 1); };

  const currentSlideData = LESSON_7_SLIDES[currentSlide];

  const renderIllustration = (illustrationType: string) => {
    const illustrationMap: { [key: string]: JSX.Element } = {
      'gifts-money': (
        <div className="flex flex-col items-center space-y-4 animate-float">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🎁</div>
            <div className="text-2xl">→</div>
            <div className="text-4xl">🏪</div>
            <div className="text-2xl">→</div>
            <div className="text-4xl">💰</div>
            <div className="text-2xl">→</div>
            <div className="text-4xl">🏦</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Evolution of Exchange</div>
        </div>
      ),
      'world-before-trade': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="flex items-center space-x-4">
            <div className="text-center"><div className="text-4xl">🏕️</div><div className="text-xs">Community</div></div>
            <div className="text-2xl">🍲</div>
            <div className="text-center"><div className="text-4xl">👥</div><div className="text-xs">Together</div></div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Communal Life</div>
        </div>
      ),
      'merchants-caravans': (
        <div className="flex flex-col items-center space-y-3 animate-slideInLeft">
          <div className="flex items-center space-x-2">
            <div className="text-4xl">👔</div>
            <div className="text-3xl">🐪</div>
            <div className="text-3xl">🐪</div>
            <div className="text-3xl">🐪</div>
            <div className="text-2xl">→</div>
            <div className="text-4xl">🎪</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Caravans & Fairs</div>
        </div>
      ),
      'formal-rules-market': (
        <div className="flex flex-col items-center space-y-3 animate-fadeInUp">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">📜</div>
            <div className="text-2xl">+</div>
            <div className="text-4xl">⚖️</div>
            <div className="text-2xl">=</div>
            <div className="text-4xl">🏪</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Rules → Market</div>
        </div>
      ),
      'birth-of-coin': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">📜</div>
            <div className="text-xl">→</div>
            <div className="text-3xl">🏷️</div>
            <div className="text-xl">→</div>
            <div className="text-5xl">🪙</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Token → Coin</div>
        </div>
      ),
      'birth-of-bank': (
        <div className="flex flex-col items-center space-y-3 animate-float">
          <div className="text-5xl mb-2">🏦</div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🪙</div>
            <div className="text-xl">↔️</div>
            <div className="text-2xl">🍎</div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Treasury System</div>
        </div>
      ),
      'coin-payment': (
        <div className="flex flex-col items-center space-y-3 animate-pulse-slow">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">👔</div>
            <div className="text-3xl">🪙</div>
            <div className="text-2xl">↔️</div>
            <div className="text-4xl">🛒</div>
          </div>
          <div className="bg-green-500/30 px-3 py-1 rounded text-sm mt-2">+ Credit System 📝</div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Payment & Credit</div>
        </div>
      ),
      'good-bad-money': (
        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl">🪙</div>
              <div className="text-xs text-green-300">✅ Good</div>
            </div>
            <div className="text-2xl">⚔️</div>
            <div className="text-center">
              <div className="text-4xl">🪙</div>
              <div className="text-xs text-red-300">❌ Bad</div>
            </div>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Competition of Coins</div>
        </div>
      ),
      'network-banking': (
        <div className="flex flex-col items-center space-y-3 animate-bounceIn">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🏦</div>
            <div className="text-xl">—</div>
            <div className="text-3xl">🏦</div>
            <div className="text-xl">—</div>
            <div className="text-3xl">🏦</div>
          </div>
          <div className="flex space-x-1 mt-2">
            <span className="text-xl">🏘️</span>
            <span className="text-xl">→</span>
            <span className="text-xl">🌆</span>
          </div>
          <div className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">Banking Network & Cities</div>
        </div>
      ),
      'default': (<div className="text-6xl">{currentSlideData.emoji}</div>)
    };
    return illustrationMap[illustrationType] || illustrationMap['default'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <header className="bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentSlideData.title}</h1>
              <p className="text-yellow-100">Slide {currentSlide + 1} of {LESSON_7_SLIDES.length}</p>
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
          <div className="mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-yellow-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-yellow-800">📈 Lesson Progress</span>
              <span className="text-sm text-yellow-600 font-semibold bg-yellow-50 px-3 py-1 rounded-full">{Math.round(totalProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 h-3 rounded-full transition-all" style={{ width: `${totalProgress * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{currentSlideData.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
                  <p className="text-yellow-100">Slide {currentSlide + 1} of {LESSON_7_SLIDES.length}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8 flex justify-center">
                <div className="bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 rounded-2xl p-8 shadow-xl text-white">
                  {renderIllustration(currentSlideData.illustration)}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {currentSlideData.content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="bg-gradient-to-r from-white to-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400 hover:shadow-md transition-all">
                      <ReactMarkdown className="text-gray-700 leading-relaxed">{paragraph}</ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-yellow-800">📊 Slide Progress</span>
                  <span className="text-sm font-semibold text-yellow-600 bg-white px-3 py-1 rounded-full">{Math.round(progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all" style={{ width: `${progress * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-yellow-50 px-8 py-6 border-t border-yellow-200">
              <div className="flex items-center justify-between">
                <button onClick={prevSlide} disabled={currentSlide === 0} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl font-medium transition-all">← Previous</button>
                <button onClick={togglePlay} className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white'}`}>
                  <span className="text-2xl mr-2">{isPlaying ? '⏸️' : '▶️'}</span>{isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={nextSlide} disabled={currentSlide === LESSON_7_SLIDES.length - 1} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl font-medium transition-all">Next →</button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {LESSON_7_SLIDES.map((_, index) => (
                  <button key={index} onClick={() => goToSlide(index)} className={`w-4 h-4 rounded-full transition-all ${index === currentSlide ? 'bg-gradient-to-r from-yellow-500 to-amber-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
            </div>
          </div>

          <audio ref={audioRef} />

          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link href="/lessons/6" className="text-gray-600 hover:text-yellow-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all">← Lesson 6</Link>
            <Link href="/checkout" className="bg-gradient-to-r from-yellow-600 to-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl">🚀 Enroll to Continue</Link>
            <Link href="/lessons/8" className="text-gray-600 hover:text-yellow-700 font-medium px-6 py-3 bg-white/50 hover:bg-white rounded-xl transition-all">Lesson 8 →</Link>
          </div>

          <div className="mt-16 bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-700 rounded-3xl p-10 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">💰 Understand Money & Markets!</h2>
            <p className="text-yellow-100 mb-8 text-xl max-w-2xl mx-auto">Continue learning with all 17 interactive lessons for just $30</p>
            <Link href="/checkout" className="inline-block bg-white text-yellow-600 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-110 shadow-xl">🚀 Enroll Now - $30</Link>
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
