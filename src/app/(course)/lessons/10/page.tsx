'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

const VoiceQuiz = dynamic(() => import('@/components/quiz/VoiceQuiz'), { ssr: false })

const LESSON_10_SLIDES = [
  {
    id: 1,
    title: "A Personal Investigation",
    content: "We have traveled a tremendous path together. We have examined what a definition is, what a number is, a formula, a law, a sacred description.\n\nBut the most personal, most intimate question remains: **how exactly do I do this?** How is a thought born in my head?\n\n> Today's lecture is special. This is not an exposition of truth. This is **a report on an internal investigation**.\n\nI am a pedagogue. I must understand how a thought comes to a child, in order to help it come.",
    emoji: "🧠",
    duration: 26000
  },
  {
    id: 2,
    title: "The Supercomputer Paradox",
    content: "Our brain is a supercomputer. Trillions of operations per second. Billions of possible \"thoughts.\"\n\n**How do I manage to choose that very one, the needed one?**\n\nIf \"I\" were the one sorting through all the options, it would be physically impossible. We hit a logical wall:\n\n> That very \"I\" which should choose the thought is itself a product of the thought process. **A closed circle.**\n\nTo break it, a different model is needed. Let's imagine that **\"I\" is not the author of thoughts, but their radio receiver.**",
    emoji: "💻",
    duration: 28000
  },
  {
    id: 3,
    title: "The Radio Receiver Model",
    content: "Let us recall how a radio receiver works. In the airwaves — thousands of signals from different radio stations. The receiver has an oscillatory circuit with a tunable natural frequency.\n\nWhen the circuit's frequency matches the frequency of one of the stations — **resonance occurs**. The signal of that station is sharply amplified, all others are filtered out.\n\n**What if our consciousness works the same way?**\n\n• **The \"airwaves\"** — an infinite fund of possible combinations of abstractions\n• **The \"radio station\"** — a specific thought with a unique \"frequency\"\n• **The \"oscillatory circuit\"** — a structure in our brain, unique for each person\n• **\"Resonance\"** — the moment when frequencies match\n\n> In this model, we do not compose thoughts. **We catch them.** We are not the conductor of the neural orchestra. We are a listener who catches that very melody that resonates with us.",
    emoji: "📻",
    duration: 38000
  },
  {
    id: 4,
    title: "The Birth of Abstractions",
    content: "Where do these \"radio stations\" — thoughts — come from? Let us trace the path from the very beginning, from an infant.\n\n**First distinction.** An infant cries — receives the breast. He does not yet know words, but distinguishes a connection: \"this sound leads to good.\"\n\n**Physical abstraction.** He sees an apple. To see it as a whole, one must draw a boundary between the apple and not-apple. This is the birth of a **first-level abstraction**.\n\n**Second-level abstraction.** The brain conserves energy. Seeing many apples, it creates a generalized pattern \"apple in general.\" Thus is born an **absolute abstraction**.\n\n**Sign.** When people agree: to this pattern we assign the sound \"apple.\"\n\n> An abstraction connected with a sign — **this is knowledge**.",
    emoji: "👶",
    duration: 34000
  },
  {
    id: 5,
    title: "Memory as Frequency Patterns",
    content: "Memory is not a warehouse of pictures. It is **preserved patterns of frequencies**.\n\n**Forgot a word?** You send a query to memory. While the search continues, there is no resonance — you \"don't remember.\"\n\n**Someone prompts you:** \"Maybe Ivanov?\" A new pattern enters interaction with your query. No resonance — \"No, that's not it.\"\n\n**Found it!** The pattern matched perfectly. **Cognitive resonance occurs.** The pattern is restored in all its fullness. \"Yes, it's Petrov!\"\n\n> **To remember** means to tune your heterodyne to the frequency of the preserved pattern and obtain resonance.",
    emoji: "🔍",
    duration: 30000
  },
  {
    id: 6,
    title: "Implications for Education",
    content: "And here we approach what is most important for me as a pedagogue. If this model is close to the truth, then:\n\n**To teach thinking does not mean** filling memory with ready-made patterns. That is like giving a person ready-made radio broadcasts on cassettes. He will reproduce them, but will not learn to tune his receiver.\n\n**To teach thinking means** training the very process of tuning:\n\n• **Developing the ability to distinguish** — exercises where one needs to find differences\n• **Developing the ability to compare** — finding similarities and differences\n• **Developing the ability to abstract** — moving from the specific to the general\n• **Creating conditions for resonance** — asking the right questions\n\n> When a child themselves arrives at the formulation of the Pythagorean theorem, **cognitive resonance** occurs in their brain. They cry \"Wow!\" Such a child will not be lazy to think. They will think **with pleasure**.",
    emoji: "🎓",
    duration: 38000
  },
  {
    id: 7,
    title: "Who Are We?",
    content: "So, who are we in this model? We are a complex system that itself generates the \"airwaves\" of possible thoughts and itself tunes in to receive them.\n\nOur **\"I\"** is not a static conductor. It is a **dynamic process of tuning**, a unique resonant circuit whose frequency is the sum of all our past experience.\n\nWe have no power over the entire \"airwaves\" of our thoughts. But **we have power to turn the tuning dial** — to ask ourselves questions, to change the focus of attention, to learn to distinguish and compare.\n\n> And then we will increasingly catch those signals — thoughts — that lead us to our goal, to beauty, to truth.\n\n**Assignment for today:** Catch your next thought. Not as its master, but as a radio amateur. Ask yourself: **what \"wave\" was I tuned to when it came?**",
    emoji: "🌟",
    duration: 36000
  }
];

const LESSON_CONTENT = LESSON_10_SLIDES.map(s => s.content).join('\n\n');

export default function Lesson10Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, []);

  const totalSlides = LESSON_10_SLIDES.length;

  // Простая функция воспроизведения слайда
  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = LESSON_10_SLIDES.length;
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`);
    
    // Останавливаем предыдущее аудио
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Создаём новый Audio объект
    const audio = new Audio(`/audio/lesson10/slide${slideIndex + 1}.mp3`);
    audioRef.current = audio;
    
    // Обновление прогресса
    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    // Когда аудио закончилось - переход к следующему слайду
    audio.onended = () => {
      console.log(`Slide ${slideIndex + 1} ended`);
      if (slideIndex < totalSlides - 1) {
        const nextSlide = slideIndex + 1;
        setCurrentSlide(nextSlide);
        setProgress(0);
        // Рекурсивно запускаем следующий слайд
        playSlide(nextSlide);
      } else {
        // Конец урока
        setIsPlaying(false);
        setProgress(100);
      }
    };
    
    // Ошибка загрузки - пробуем slide1.mp3 или пропускаем
    audio.onerror = () => {
      console.log(`Error loading slide ${slideIndex + 1}, trying slide1.mp3`);
      // Пробуем fallback на slide1.mp3
      const fallbackAudio = new Audio(`/audio/lesson10/slide1.mp3`);
      audioRef.current = fallbackAudio;
      
      fallbackAudio.ontimeupdate = () => {
        if (fallbackAudio.duration) {
          setProgress((fallbackAudio.currentTime / fallbackAudio.duration) * 100);
        }
      };
      
      fallbackAudio.onended = () => {
        if (slideIndex < totalSlides - 1) {
          const nextSlide = slideIndex + 1;
          setCurrentSlide(nextSlide);
          setProgress(0);
          playSlide(nextSlide);
        } else {
          setIsPlaying(false);
          setProgress(100);
        }
      };
      
      fallbackAudio.onerror = () => {
        // Нет аудио - используем таймер
        console.log('No audio available, using timer');
        setTimeout(() => {
          if (slideIndex < totalSlides - 1) {
            const nextSlide = slideIndex + 1;
            setCurrentSlide(nextSlide);
            setProgress(0);
            playSlide(nextSlide);
          } else {
            setIsPlaying(false);
            setProgress(100);
          }
        }, 20000);
      };
      
      fallbackAudio.play().catch(console.error);
    };
    
    // Запускаем воспроизведение
    audio.play().catch((err) => {
      console.error('Audio play error:', err);
      if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
        // Safari блокирует автовоспроизведение
        setIsPlaying(false);
        alert('Please click Play button to start audio');
      }
    });
  }, [LESSON_10_SLIDES.length]);

  const togglePlay = () => {
    if (isPlaying) {
      // Пауза
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Запуск - создаём и запускаем аудио синхронно в обработчике клика
      setIsPlaying(true);
      setProgress(0);
      
      // Останавливаем предыдущее аудио
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Создаём аудио синхронно в обработчике клика (важно для Safari)
      const audioPath = `/audio/lesson10/slide${currentSlide + 1}.mp3`;
      console.log('Loading audio:', audioPath);
      const audio = new Audio(audioPath);
      audioRef.current = audio;
      
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      
      audio.onended = () => {
        if (currentSlide < totalSlides - 1) {
          const nextSlide = currentSlide + 1;
          setCurrentSlide(nextSlide);
          setProgress(0);
          playSlide(nextSlide);
        } else {
          setIsPlaying(false);
          setProgress(100);
        }
      };
      
      audio.onerror = () => {
        console.error(`Error loading slide ${currentSlide + 1}`);
        // Переходим к следующему слайду
        if (currentSlide < totalSlides - 1) {
          const nextSlide = currentSlide + 1;
          setCurrentSlide(nextSlide);
          setProgress(0);
          playSlide(nextSlide);
        } else {
          setIsPlaying(false);
        }
      };
      
      // Запускаем немедленно - это важно для Safari
      audio.play().catch((err) => {
        console.error('Play failed:', err);
        setIsPlaying(false);
        alert('Audio playback failed. Please try again.');
      });
    }
  };

  const goToSlide = (index: number) => {
    // Останавливаем текущее аудио
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setCurrentSlide(index);
    setProgress(0);
    
    // Если играем - запускаем новый слайд
    if (isPlaying) {
      playSlide(index);
    }
  };

  const currentSlideData = LESSON_10_SLIDES[currentSlide];

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
          lessonId={10}
          lessonTitle="How Thought Finds Us"
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/9"
              className="hover:text-white transition"
            >
              ← Lecture IX
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture X</span>
            <Link 
              href="/lessons/11"
              className="hover:text-white transition"
            >
              Lecture XI →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}