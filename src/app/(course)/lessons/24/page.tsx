'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_24_SLIDES = [
  {
    id: 1,
    title: "",
    content: `Until now we have been discussing **abstract principles**. But how are they embodied in real life? How did money, markets and banks emerge from simple exchange between people? Let us trace this path.`,
    emoji: "📖",
    duration: 20000
  },
  {
    id: 2,
    title: "",
    content: `In **closed patriarchal-communal societies**, trade does not exist. In prehistoric times, the majority of resources were at the disposal of only the **heads of families**, **clans**, or **tribal chiefs**. People worked collectively and ate together from a common pot. **Private property** did not yet exist.

> The formation of new goals was exclusively the responsibility of the leaders.`,
    emoji: "🔍",
    duration: 27040
  },
  {
    id: 3,
    title: "",
    content: `Within the **community**, everything is shared—there is no exchange, no property. The **community's boundaries** are defended against encroachments by outsiders. Between communities, interaction occurs through **gift exchange** between chiefs. This is the first stage: goods move, people do not. Gifts are passed along in a chain from **chief to chief**. Rare objects can arrive from very distant places. 

> Exchange occurs only between foreign groups.`,
    emoji: "💡",
    duration: 34080
  },
  {
    id: 4,
    title: "",
    content: `The uniqueness and high value of certain **goods** received as gifts from neighboring tribes motivates sending special groups of people to search for them. **Expeditions** for rare goods become regular occurrences. Routes become increasingly diverse and distant. 

> Now it is not the goods themselves that move, but people who transport them.

This is how **merchants** and **caravans** emerge.`,
    emoji: "📊",
    duration: 29120
  },
  {
    id: 5,
    title: "",
    content: `The intersection point of several **caravan routes** becomes a place for joint rest stops. Here, the exchange of **goods and information** takes place. Merchants arrange to meet in the following season. This is how **seasonal fairs** emerge.`,
    emoji: "🎯",
    duration: 20000
  },
  {
    id: 6,
    title: "",
    content: `The number of **fairs** begins to grow. Each of them develops its own rules. Those fairs with better conditions for exchange grow faster. 

**Community rules** are based on kinship, tradition, and submission to a leader. **Fair rules** are formal and independent of kinship, ethnicity, or race. 

The **fair owners** are interested in protecting these new rules. They allocate part of their resources and efforts to ensure the implementation of new rules within their territory. 

> This is how a **market** emerges — territories with unified exchange rules that are independent of tribal, ethnic, or racial differences among participants.`,
    emoji: "🧠",
    duration: 49360
  },
  {
    id: 7,
    title: "",
    content: `Land at the intersection of **trade routes** was rented for the placement of warehouses, workshops, and markets. Payment was calculated on a daily basis. 

As markets expanded, **payment tracking** became increasingly important. After making payment, a merchant would receive a **label** — a sign of payment. However, labels were short-lived and easily counterfeited. 

The solution was to place the **clan symbol (tamga)** on durable materials: copper, bronze, silver, and gold. This led to the emergence of **cast coins** bearing the relief of clan symbols.`,
    emoji: "✨",
    duration: 36960
  },
  {
    id: 8,
    title: "",
    content: `How to achieve **reusable circulation of coins**? How to return coins from merchants back to the owner? They created a **treasury** (Turkic: khazna) — a special house, a storage facility for valuables, where natural payments for rent were accepted. **Coins were issued in exchange for products**. 

**Controllers** made daily rounds of the market and collected the coins back. No coin — the shop was closed or a fine was imposed. A separate entrance for buyers was created, through which only people could pass, but **pack animals could not**. 

> Coins issued at the cashier were returned back to the same cashier. A closed cycle.`,
    emoji: "📝",
    duration: 47840
  },
  {
    id: 9,
    title: "",
    content: `A merchant could end the season early and sell the remaining **coins** to neighbors. Or buy a coin from a neighbor when it came time to pay. The **price of the coin** changed depending on demand. 

The coin gradually becomes a **means of payment** between the merchants themselves. The owner began using the cash register not only to receive payment, but also to issue coins as loans — as **credit**. 

> This mechanism unexpectedly began to generate significant profit.`,
    emoji: "🌟",
    duration: 35200
  },
  {
    id: 10,
    title: "",
    content: `**Cast coins** were durable, but easy to counterfeit. Later, **minting** was invented — the application of an imprint, which was harder to forge. **Bractеates** appeared — coins with single-sided minting.`,
    emoji: "🔮",
    duration: 20000
  },
  {
    id: 11,
    title: "",
    content: `The increase in **silver coin production** led to the practice of **coin debasement** — scraping off portions of silver. This changed the weight of the coin, and consequently its value. 

> This resulted in conflicts during payments and undermined trust in the currency.

The owner bore the costs of identifying and remelting **debased and counterfeit coins**.`,
    emoji: "📖",
    duration: 26640
  },
  {
    id: 12,
    title: "",
    content: `**Good money** is that which owners strictly monitor, preventing corruption and counterfeiting. It enjoys greater trust. **Bad money** has less control, more counterfeits, and less trust. 

In a free market, **good money drives out bad money**, bringing greater profit to its owners. In a non-free market, **bad money drives out good money**. 

> This is the so-called **Gresham's Law**.`,
    emoji: "🔍",
    duration: 28560
  },
  {
    id: 13,
    title: "",
    content: `The **coin owners**, seeing profit from minting, strive to expand their zone of application. They rent spaces in other markets to open branches of their treasury. This is how the treasury transforms into a **bank** (Latin *banco* — bench, money changer's table) — a house where all operations take place: from minting to exchange and credit.

> A network of branches appears across different markets.`,
    emoji: "💡",
    duration: 31360
  },
  {
    id: 14,
    title: "",
    content: `The development of **retail trade** enabled the creation of permanent markets. Agricultural producers themselves brought their products, exchanged them for coins, and purchased goods. **Cities emerged**. **Property owners** who had separated from the community appeared—Cossacks or farmers.`,
    emoji: "📊",
    duration: 21760
  },
  {
    id: 15,
    title: "",
    content: `**Two inventions that changed the world**: the **coin** and the **bank**. 

The **coin** evolved from a payment token to a **universal medium of exchange**. 

The **bank** transformed from a cashbox to a **networked system of minting, exchange, and credit**.

The **market** established **formal rules** independent of kinship and ethnicity. 

The **city** became a **permanent place of trade** and gave birth to **property owners**.`,
    emoji: "🎯",
    duration: 30000
  }
];

export default function Lesson24Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_24_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson24/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_24_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_24_SLIDES[currentSlide].duration;
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

  const currentSlideData = LESSON_24_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        onError={() => setAudioError(true)}
      />
      
      {/* Academic Header */}
      <header className="bg-stone-800 text-stone-100 border-b-4 border-amber-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/lessons" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm">
              ← Back to Course
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-serif">Algorithms of Thinking and Cognition</h1>
              <p className="text-stone-400 text-sm">Lecture 24</p>
            </div>
            <div className="text-stone-400 text-sm">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Lesson Title */}
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">{currentSlideData.emoji}</span>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">
            {currentSlideData.title}
          </h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        {/* Content Card */}
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
              }}
            >
              {currentSlideData.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Progress Section */}
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

        {/* Controls */}
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

        {/* Voice Quiz Button */}
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

        {/* Slide Navigation */}
        <div className="bg-white rounded-lg shadow border border-stone-200 p-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Lecture Sections</h3>
          <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
            {LESSON_24_SLIDES.map((slide, index) => (
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

      {/* Voice Quiz Modal */}
      {showQuiz && (
        <VoiceQuiz
          lessonId={24}
          lessonTitle="THE BIRTH OF MONEY AND BANKS: FROM FAIR TO CITY"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/23"
              className="hover:text-white transition"
            >
              ← Lecture 23
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture 24</span>
            <Link 
              href="/lessons"
              className="hover:text-white transition"
            >
              All Lessons →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
