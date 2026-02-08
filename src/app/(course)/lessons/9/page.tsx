'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
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

  const totalSlides = LESSON_9_SLIDES.length;

  // Простая функция воспроизведения слайда
  const playSlide = useCallback((slideIndex: number) => {
    const totalSlides = LESSON_9_SLIDES.length;
    console.log(`Playing slide ${slideIndex + 1} of ${totalSlides}`);
    
    // Останавливаем предыдущее аудио
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Создаём новый Audio объект
    const audio = new Audio(`/audio/lesson9/slide${slideIndex + 1}.mp3`);
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
      const fallbackAudio = new Audio(`/audio/lesson9/slide1.mp3`);
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
  }, [LESSON_9_SLIDES.length]);

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
      const audioPath = `/audio/lesson9/slide${currentSlide + 1}.mp3`;
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

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-16 border-t-4 border-amber-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              href="/lessons/8"
              className="hover:text-white transition"
            >
              ← Lecture VIII
            </Link>
            <span className="text-stone-500 text-sm font-serif">Lecture IX</span>
            <Link 
              href="/lessons/10"
              className="hover:text-white transition"
            >
              Lecture X →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}