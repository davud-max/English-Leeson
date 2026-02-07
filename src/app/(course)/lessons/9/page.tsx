'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_9_SLIDES = [
  {
    id: 1,
    title: "In the Beginning",
    content: "**In the beginning God created the heaven and the earth.** Thus begins the Book of Genesis.\n\nThe concepts of **heaven** and **earth** are foundational for the first chapters of the Bible. They constitute the starting point.\n\nAnd here, heaven and earth are not the familiar heaven and earth we know, but **abstract concepts** denoting, respectively, the **observable** and the **unobservable**.\n\n> In modern vocabulary, the concepts closest in meaning to heaven and earth are, respectively, **Nothing** and **the World**.",
    emoji: "📖",
    duration: 28000
  },
  {
    id: 2,
    title: "Part One: The First Sacred Trinity",
    content: "**And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.** So says the second verse.\n\nThe earth that was without form, and darkness upon the deep, that is, heaven. What water is being spoken of?\n\nIn the beginning, the boundary between earth and heaven was not yet distinguishable, and both were unobservable. Therefore, they both are something unified, boundless, formless, indistinguishable, which is called **water**.\n\n> In modern vocabulary, the most appropriate word for this concept is **Being**.\n\nThe Spirit of God moved upon the waters. The Spirit of God belongs neither to heaven nor to earth. Essentially, water and the Holy Spirit together are conditionally God. Any attempt to see God leads to water or the Holy Spirit. But **all three are one**.",
    emoji: "🌊",
    duration: 32000
  },
  {
    id: 3,
    title: "Part Two: The Creation of Light",
    content: "**And God said, Let there be light: and there was light.** So says the third verse.\n\nThe Spirit of God, moving upon the waters, having fertilized the primordial water, that is, Being, gives birth to light. But what is this light?\n\nHere it is **not physical light**, which, for example, comes from the sun. The sun does not yet exist. Moreover, nothing observable exists, as there is no observer.\n\n> **The ability to abstract is the light** — that is, that through which man distinguishes, observes.\n\nAn animal has vision, it can see. But this is merely a reaction to ordinary physical light. An animal cannot observe.\n\n**To observe** means to distinguish the boundaries between the observable, that is, the World, and the unobservable, that is, Nothing. This is possible only with the ability to look from the outside, only with the **ability to abstract**.",
    emoji: "💡",
    duration: 34000
  },
  {
    id: 4,
    title: "Part Three: God Saw That the Light Was Good",
    content: "**And God saw the light, that it was good: and God divided the light from the darkness.** So says the fourth verse.\n\nSo who saw? God? It turns out that God only after creating light saw, learned that it was good. But God is the unity of water and the Holy Spirit, that is, the absolute All. He is omniscient.\n\n> **To see means to distinguish boundaries.** And this is a violation of the principle of boundlessness and unity of God.\n\nBut man himself does not yet exist, for he has not yet seen himself. Therefore it is said that God saw.\n\n**To distinguish good from evil**, to distinguish what is good from what is not good — only God can do this. Only God knows the **final purpose of man**, by which alone it is possible to determine what is good and what is not good.",
    emoji: "👁️",
    duration: 30000
  },
  {
    id: 5,
    title: "Part Four: The Division of Waters",
    content: "**And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.** So say the sixth and seventh verses.\n\nThus, water was divided from water. What does this mean?\n\nBefore the appearance of light, water was not yet divided, that is, Being, and earth and heaven were indistinguishable, that is, the World and Nothing.\n\n> **The firmament is the boundary** that divided the World and Nothing after light appeared, that is, after the ability to abstract appeared.\n\nOne could say that the boundary between heaven and earth existed before, but it was not visible. Light was needed to distinguish the firmament.\n\nAnd it is about this light that they will speak when they talk about the **end of light**.",
    emoji: "🌐",
    duration: 30000
  },
  {
    id: 6,
    title: "Part Five: The Birth of the Observer",
    content: "Through light came the birth from water of the observer himself, **Man**.\n\nFor to see the World within its boundaries, beyond which is Nothing, one can only be **outside both this World and this Nothing**. One must emerge from the water.\n\n> For comparison, the same in the Quran in the Surah Al-Furqan: *\"And it is He who has created from water a human being.\"*\n\nThe process of material evolution began long before the appearance of the firmament, that is, boundaries. Only the appearance of a specific human being with a specific metric allows human consciousness to distinguish the specific structure of our World.\n\nAt the same time, no one guarantees that there are no other beings with a different metric. They will split the same Being in completely different boundaries.\n\n> **Within the same Being, potentially exist many different Worlds.**\n\n*Thank you for your attention.*",
    emoji: "🧬",
    duration: 36000
  }
];

const LESSON_CONTENT = LESSON_9_SLIDES.map(s => s.content).join('\n\n');

export default function Lesson9Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = LESSON_9_SLIDES.length;

  useEffect(() => {
    if (!isPlaying) return;

    const audioFile = `/audio/lesson9/slide${currentSlide + 1}.mp3`;
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play().catch(e => {
        console.log("Audio not available, using timer fallback");
        setAudioError(true);
        const duration = LESSON_9_SLIDES[currentSlide].duration;
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
    
    const duration = LESSON_9_SLIDES[currentSlide].duration;
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

  const currentSlideData = LESSON_9_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Fixed Audio Controls */}
      <div className="sticky top-0 z-50 bg-white border-b-4 border-amber-700 shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/lessons" className="text-stone-600 hover:text-stone-800 text-sm whitespace-nowrap">
              ← Back
            </Link>
            
            <div className="flex items-center justify-center gap-3 flex-1">
              <button
                onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-4 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition text-sm"
              >
                ← Prev
              </button>
              
              <button
                onClick={togglePlay}
                className="px-6 py-2 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition shadow-md text-sm"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              
              <button
                onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="px-4 py-2 rounded border border-stone-300 text-stone-600 disabled:opacity-30 hover:bg-stone-100 transition text-sm"
              >
                Next →
              </button>
            </div>
            
            <div className="text-stone-500 text-sm whitespace-nowrap">
              {currentSlide + 1}/{totalSlides}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
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
                h1: ({children}) => <h1 className="text-2xl font-bold text-stone-900 mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-bold text-stone-900 mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-bold text-stone-900 mt-4 mb-2">{children}</h3>,
              }}
            >
              {currentSlideData?.content || LESSON_CONTENT}
            </ReactMarkdown>
          </div>
        </article>

        {/* Voice Quiz Button */}
        <div className="text-center mb-10">
          <button
            onClick={() => setShowQuiz(true)}
            className="px-6 py-2 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition shadow"
          >
            Start Voice Test
          </button>
        </div>
      </main>

      {/* Voice Quiz Modal */}
      {showQuiz && (
        <VoiceQuiz
          lessonId={9}
          lessonTitle="Sacred Text and Reality"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Academic Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/8"
              className="hover:text-white transition"
            >
              ← Lecture VIII: Theory of Cognitive Resonance
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture IX</span>
            <Link 
              href="/lessons/10"
              className="hover:text-white transition"
            >
              Lecture X: How Thought Finds Us →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}