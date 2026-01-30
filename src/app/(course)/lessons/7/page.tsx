'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with speech recognition
const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_7_SLIDES = [
  {
    id: 1,
    title: "From Gifts to Money",
    content: "**Today we'll talk about how from simple exchange of gifts between tribes, money, markets, and the banking system were born.**\n\nThis is a journey from the communal pot to retail trade.\n\n> Gifts → Markets → Money → Banks\n\nLet's trace this fascinating path of human cooperation!",
    emoji: "💰",
    duration: 18000
  },
  {
    id: 2,
    title: "The World Before Trade",
    content: "**Part One: The World Before Trade**\n\nIn closed patriarchal-communal societies, **trade did not exist**. In prehistoric times, most resources were at the disposal of only heads of families, clans, or tribal chiefs.\n\n**Communal Life:**\n• Work together\n• Eat from common pot\n• No private property yet\n\nEach community had its relatively stable **boundary**, protected from outsiders' encroachment.\n\nNevertheless, between chiefs of neighboring communities there was interaction, accompanied by **mutual gifts**. Gifts could include rare items that arrived through a chain from very distant places.\n\n**Stage 1:**\n• Goods move\n• Owners don't move\n• Exchange only between strangers",
    emoji: "🏕️",
    duration: 28000
  },
  {
    id: 3,
    title: "Birth of Merchants",
    content: "**Part Two: Birth of Merchants and Caravans**\n\nThe uniqueness and high usefulness of some goods received as gifts from a neighboring tribe prompted sending a **special group** to search for them.\n\nFor traveling through neighboring communities' territory, appropriate **gifts and guides** were needed.\n\n**Evolution:**\n• Occasional gifts\n• Regular expeditions\n• Established routes\n• **Merchants & Caravans born!**\n\nRoutes became more diverse and distant. Now goods weren't moving between communities on their own — **special groups of people** moved them.\n\nA place where several caravan routes intersected became a **joint camp**. Here merchants exchanged both goods and information. They could agree to meet next season.\n\n**Thus seasonal fairs appeared!**",
    emoji: "🐪",
    duration: 28000
  },
  {
    id: 4,
    title: "Formal Rules and Markets",
    content: "**Part Three: Formal Rules and Markets**\n\nThe number of fairs began to grow. Each developed its own **rules**. Fairs grew faster where conditions for exchange were better and where understandable rules recognized by most were maintained.\n\n**New Rules vs Tribal Rules:**\n• Apply to ALL vs Only for 'us'\n• Formal vs Personal\n• Protected vs Customary\n\nFair owners were most interested in protecting new rules. They allocated part of their forces and resources to ensure these rules worked on their territory.\n\nThe largest and most successful fairs attracted merchants from **other nations**. International trade brought peoples closer, forming **unified exchange rules** and a **common language** of exchange.\n\n> **Market** = territory with unified exchange rules independent of tribal, ethnic, or racial differences — formal rules.",
    emoji: "📜",
    duration: 30000
  },
  {
    id: 5,
    title: "Birth of the Coin",
    content: "**Part Four: Birth of the Coin**\n\nLand at the intersection of trade routes was rented for warehouses, workshops, and markets. Payment was calculated **daily**.\n\nAs markets grew, tracking rent payments became crucial. Each merchant, after paying daily rent, received a **token** — a tag certifying payment.\n\n**Token Evolution:**\n• Leather piece with stamp\n• More durable material needed\n• Copper, bronze, silver, gold!\n• **First cast coin born!**\n\nToken forms varied across markets — it could be leather with a seal or the landlord's family crest imprint.\n\nAs trade volume increased, tokens became fragile and easy to forge. The next step: stamping the family crest on **more durable material** — copper, bronze, silver, or gold.\n\n> In many countries, silver coin for daily market rent was called **tanga** or **denga** from 'tamga' — family/clan crest.",
    emoji: "🪙",
    duration: 28000
  },
  {
    id: 6,
    title: "Birth of the Bank",
    content: "**Part Five: Birth of the Bank**\n\nHow to achieve **multiple use** of coins? How to return coins from merchant back to owner?\n\nA special house was designated — a **treasury**, storage of valuables, where natural payments for daily market rent were accepted. In exchange for received products, a **coin was issued**.\n\n**Coin Circulation:**\n• Products → Treasury → Coin issued\n• Controllers collect coins back\n\nSpecial **controllers** each day at a set time walked around the market and collected coins **back**. If no coin was found — the stall was **closed**.\n\n**Buyers** didn't pay for market access. They had a separate entrance called the **'eye of the needle'** — due to its resemblance to old needle holders. Only people could physically pass through, but not pack animals.\n\n> Coins issued at the cash desk returned to the same cash desk! Closed circulation system.",
    emoji: "🏦",
    duration: 30000
  },
  {
    id: 7,
    title: "Coin as Payment",
    content: "**Part Six: Coin as Payment Means**\n\nA merchant could finish their trading season early. Then remaining coins could be:\n\n**Options for Leftover Coins:**\n• Save until next season\n• Sell to neighbors (at discount)\n• Buy from neighbor if needed (premium)\n\nThus, within a given market, the coin gradually became a **payment means** between merchants themselves and with buyers.\n\nThe owner who minted coins couldn't miss this. He began using the treasury not only for rent payments but also for **issuing coins on loan** — on credit.\n\n> **Credit Discovery:** This additional financial mechanism unexpectedly brought great profit!\n\nThe treasury transformed from simple storage into a **profit-generating institution**!",
    emoji: "💱",
    duration: 26000
  },
  {
    id: 8,
    title: "Good and Bad Money",
    content: "**Part Seven: Good and Bad Money**\n\nCast coin is durable but **easy to forge**. Casting was replaced by **minting** — stamping an imprint.\n\n**Coin Evolution:**\n• Cast coin (easy to forge)\n• Minted coin (one-sided = bracteate)\n• Two-sided coin (more secure)\n\nIncreased silver coin production raised silver's value. This led to **coin clipping** — scraping off small amounts of silver. Weight changed, value changed — leading to **payment conflicts** and undermining trust.\n\n**Competition began between coins!** Same denomination coins with different mints were valued differently.\n\n**Key Insight:**\n• **Good money** = coins whose owners strictly prevented forgery and clipping\n• **Bad money** = coins easily corrupted or forged\n\n> On a free market, good money drives out bad money, bringing their owners greater profit!",
    emoji: "⚖️",
    duration: 28000
  },
  {
    id: 9,
    title: "Network Banking System",
    content: "**Part Eight: Network Banking System**\n\nCoin owners, seeing the profit from minting coins for retail trade, sought to **expand** the zone of application.\n\nThey could rent space at **other markets** to open branches of their exchange office there.\n\n> Network banking system born!\n\nGradually, the term **'cash desk'** remained only for the place of receiving or issuing cash. The house where all other operations occurred — from minting to exchange and credit — received the name **bank**.\n\n**From Latin 'banco'** — bench, counter, table on which money changers laid out coins.\n\n**Urbanization:**\n• Seasonal fairs → Permanent markets\n• Farmers bring products → Exchange for coins\n• **Cities appear!**\n• Independent owners emerge\n\n**Summary:** Two concepts — bank and coin — radically changed the exchange system:\n• Markets appeared\n• Retail trade emerged\n• Coin minting & quality control\n• Fighting counterfeiters\n• Currency exchange\n• Credit system\n\n**Thank you for your attention.**",
    emoji: "🌐",
    duration: 35000
  }
];

// Get lesson content for quiz
const LESSON_CONTENT = LESSON_7_SLIDES.map(s => s.content).join('\n\n');

export default function Lesson7Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_7_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson7/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_7_SLIDES[currentSlide].duration;
        timerRef.current = setTimeout(() => {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, duration);
      });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isPlaying, totalSlides]);

  useEffect(() => {
    if (!isPlaying || !audioError) return;
    
    const duration = LESSON_7_SLIDES[currentSlide].duration;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError, currentSlide]);

  useEffect(() => {
    if (!isPlaying || audioError) return;
    
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audioError]);

  const handleAudioEnded = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const goToSlide = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentSlide(index);
    setProgress(0);
    if (isPlaying) {
      setAudioError(false);
    }
  };

  const currentSlideData = LESSON_7_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        onError={() => setAudioError(true)}
      />
      
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
              ← Back to Course
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture VII</p>
            </div>
            <div className="text-stone-400 text-sm">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">
            {currentSlideData.title}
          </h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        <article className="bg-white rounded-lg shadow-lg border border-stone-200 p-8 md:p-12 mb-8">
          <div className="prose prose-stone prose-lg max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="text-stone-700 leading-relaxed mb-5 text-lg">{children}</p>,
                strong: ({children}) => <strong className="text-stone-900 font-semibold">{children}</strong>,
                em: ({children}) => <em className="text-stone-600 italic">{children}</em>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-amber-700 pl-6 my-6 italic text-stone-600 bg-amber-50 py-4 pr-4 rounded-r">
                    {children}
                  </blockquote>
                ),
                ul: ({children}) => <ul className="list-disc list-outside ml-6 text-stone-700 space-y-2 my-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-outside ml-6 text-stone-700 space-y-2 my-4">{children}</ol>,
                li: ({children}) => <li className="text-stone-700 leading-relaxed">{children}</li>,
                h1: ({children}) => <h1 className="text-2xl font-serif text-stone-800 mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-serif text-stone-800 mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold text-stone-800 mt-4 mb-2">{children}</h3>,
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-500 font-medium">Slide Progress</span>
            <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-700 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {audioError && (
            <p className="text-xs text-stone-400 mt-2 text-center">
              Audio unavailable — using timed advancement
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 mb-10">
          <button
            onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium"
          >
            ← Previous
          </button>
          
          <button
            onClick={togglePlay}
            className="px-8 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Lecture'}
          </button>
          
          <button
            onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
            disabled={currentSlide === totalSlides - 1}
            className="px-5 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition font-medium"
          >
            Next →
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-lg p-6 mb-10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎤 Ready to Test Your Knowledge?</h3>
          <p className="text-amber-100 mb-4">Take a voice quiz with AI-generated questions based on this lecture</p>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition shadow-md"
          >
            Start Voice Quiz
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {LESSON_7_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`p-3 rounded text-sm font-medium transition ${
                  index === currentSlide
                    ? 'bg-amber-700 text-white'
                    : index < currentSlide
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
                title={slide.title}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {showQuiz && (
        <VoiceQuiz
          lessonId={7}
          lessonTitle="The Fair and the Coin"
          onClose={() => setShowQuiz(false)}
        />
      )}

      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/6"
              className="hover:text-white transition"
            >
              ← Lecture VI: Conditional Reflexes
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture VII</span>
            <Link 
              href="/lessons/8"
              className="hover:text-white transition"
            >
              Lecture VIII: Cognitive Resonance →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
